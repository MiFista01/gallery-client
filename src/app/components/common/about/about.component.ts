import { Component } from '@angular/core';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RequestsService } from '@services/requests.service';
import { Subscription } from 'rxjs';
interface profile {
  name?: string,
  email?: string,
  phone?: string,
  text?: string,
  rusText?: string,
  estText?:string,
  avatar?: any,
  showText?: string
}
@Component({
  selector: 'app-about-view',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  private subscription: Subscription | undefined;
  user:profile = {}
  constructor(
    private readonly req: RequestsService,
    private language: LanguageService
  ) { }
  ngOnInit(): void {
    this.req.Get<profile>(`${environment.apiUrl}/user/1`).subscribe(data=>{
      data.avatar = `${environment.apiUrl}/static/imgs/avatar/${data.avatar}`
      this.user = data
      this.subscription = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields([this.user], data, { showText: 'text' })
      })
    })
  }
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
}
