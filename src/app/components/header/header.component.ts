import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule, Event } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
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
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly req: RequestsService
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
}
