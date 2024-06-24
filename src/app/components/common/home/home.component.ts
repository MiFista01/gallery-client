import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RequestsService } from '@services/requests.service';
import { Subscription } from 'rxjs';
interface painting {
  id: number
  title: string
  rusTitle: string
  estTitle: string
  des: string
  rusDes: string
  estDes: string
  price: number
  img: any
  imgPath: string
  size: string
  showTitle: string
  showDes: string
}
interface news {
  id: number
  title: string
  rusTitle: string
  estTitle: string
  text: string
  rusText: string
  estText: string
  showTitle: string
  showText: string
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  private subscriptionPopular: Subscription | undefined;
  private subscriptionLast: Subscription | undefined;
  private subscriptionNews: Subscription | undefined;
  mostPopular: painting[] = []
  lastAdded: painting[] = []
  news: news[] = []
  desLength = 40
  constructor(
    private readonly req: RequestsService,
    private language: LanguageService
  ) { }
  ngOnInit(): void {
    this.req.Get<painting[]>(`${environment.apiUrl}/painting/popular`).subscribe(data => {
      this.mostPopular = data.map(value => {
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
      this.subscriptionPopular = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<painting>(this.mostPopular, data, {showTitle: 'title',showDes: 'des'})
      })
    })
    this.req.Get<painting[]>(`${environment.apiUrl}/painting/last-added`).subscribe(data => {
      this.lastAdded = data.map(value => {
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
      this.subscriptionLast = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<painting>(this.lastAdded, data, { showTitle: 'title', showDes: 'des' })
      })
    })
    this.req.Get<news[]>(`${environment.apiUrl}/news`).subscribe(data => {
      const arrayLength = data.length < 4 ? data.length : 4
      for (let i = 0; i < arrayLength; i++) {
        this.news.push(data.pop()!)
      }
      this.subscriptionNews = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<news>(this.news, data, { showTitle: 'title', showText: 'text' })
      })
    })
  }
  ngOnDestroy(): void {
    this.subscriptionPopular?.unsubscribe()
    this.subscriptionLast?.unsubscribe()
    this.subscriptionNews?.unsubscribe()
  }
}
