import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RequestsService } from '@services/requests.service';
import { Subscription } from 'rxjs';
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
  selector: 'app-news-view',
  standalone: true,
  imports: [RouterModule, CommonModule, TranslateModule, FormsModule],
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.scss'
})
export class NewsViewComponent {
  private subscriptionShowNews: Subscription | undefined;
  private subscriptionAllNews: Subscription | undefined;
  showNews: news[] = []
  allNews: news[] = []
  searchValue = ""
  constructor(
    private readonly req: RequestsService,
    private language: LanguageService
  ) { }
  ngOnInit(): void {
    this.req.Get<news[]>(`${environment.apiUrl}/news`).subscribe(data => {
      this.showNews = [...data]
      this.allNews = [...data]
      this.subscriptionAllNews = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<news>(this.allNews, data, { showTitle: 'title', showText: 'text' })
      })
      this.subscriptionShowNews = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<news>(this.showNews, data, { showTitle: 'title', showText: 'text' })
        this.showNews = this.allNews.filter((value, index, array) => { return value.showTitle.toLowerCase().includes(this.searchValue.toLowerCase()) })
      })
    })
  }
  searchNews() {
    this.showNews = this.allNews.filter((value, index, array) => { return value.showTitle.toLowerCase().includes(this.searchValue.toLowerCase()) })
  }
  ngOnDestroy(): void {
    this.subscriptionAllNews?.unsubscribe()
    this.subscriptionShowNews?.unsubscribe()
  }
}
