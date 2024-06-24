import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RequestsService } from '@services/requests.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isAdmin = false
  open = false
  openLanguages = false
  languagesIcons = {
    eng: "./assets/imgs/languages/eng.png",
    ru: "./assets/imgs/languages/ru.png",
    est: "./assets/imgs/languages/est.png"
  }
  activeLanguage = "eng" as "eng" | "ru" | "est"
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly req: RequestsService,
    private language: LanguageService
  ) { }
  ngOnInit() {
    if (!this.router.url.includes("/admin") || this.router.url == "/admin/login") {
      this.isAdmin = false
    } else {
      this.isAdmin = true
    }
    this.router.events.pipe(
      filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (!event.url.includes("/admin") || event.url == "/admin/login") {
        this.isAdmin = false
      } else {
        this.isAdmin = true
      }
    });
    this.language.langue$.subscribe(data => {
      this.activeLanguage = data
    })
  }
  toggleBurger() {
    this.open = !this.open
  }
  logOut() {
    this.req.Post(`${environment.apiUrl}/user/logout`, {}).subscribe({
      next: () => {
        this.router.navigate(['admin/login']);
      },
      error: (err) => { }
    })
  }
  getOtherLanguages() {
    let languagesIconsArray: { lang: "eng" | "ru" | "est", icon: string }[] = []
    for (let i of Object.keys(this.languagesIcons)) {
      if (i != this.activeLanguage) {
        languagesIconsArray.push({ lang: i as "eng" | "ru" | "est", icon: this.languagesIcons[i as "eng" | "ru" | "est"] })
      }
    }
    return languagesIconsArray
  }
  toggleLanguages() {
    this.openLanguages = !this.openLanguages
  }
  changeLanguage(lang: "eng" | "ru" | "est") {
    this.activeLanguage = lang
    this.language.switchLanguage(this.activeLanguage)
  }
  trackByFnLang(index:number, item: { lang: "eng" | "ru" | "est" , icon:string}) {
    return item.lang
  }
}
