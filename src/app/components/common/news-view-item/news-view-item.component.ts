import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '@services/language.service';
import { RequestsService } from '@services/requests.service';
import { IAlbum, Lightbox, LightboxModule } from 'ngx-lightbox';
import { forkJoin, map, Subscription, switchMap } from 'rxjs';
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
  poster: string | null
  createdAt: string
  updatedAt: string
}
@Component({
  selector: 'app-news-view-item',
  standalone: true,
  imports: [CommonModule, RouterModule, LightboxModule, TranslateModule],
  templateUrl: './news-view-item.component.html',
  styleUrl: './news-view-item.component.scss'
})
export class NewsViewItemComponent {
  private subscriptionNews: Subscription | undefined;
  private subscriptionNewsArray: Subscription | undefined;
  id = 0
  news: Partial<news> | null = {}
  allNews: news[] = []
  private _album: IAlbum[] = []; 
  placeArray = -1
  constructor(
    private readonly req: RequestsService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox,
    private language: LanguageService
  ) { }
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id !== null) {
          this.id = +id;
          return forkJoin({
            news: this.req.Get<news>(`${environment.apiUrl}/news/${id}`).pipe(
              map(data => {

                if (data === null) {
                  return null
                }
                return {
                  ...data,
                  poster: data.poster ? `${environment.apiUrl}/static/imgs/news/${data.poster}` : null
                };
              }),
            ),
            allNews: this.req.Get<news[]>(`${environment.apiUrl}/news`).pipe(
              map(array => array.map(data => ({
                ...data,
                poster: data.poster ? `${environment.apiUrl}/static/imgs/news/${data.poster}` : null
              })))
            )
          });
        }
        return [];
      })
    ).subscribe(({ news, allNews }) => {
      this.news = news;
      
      this.subscriptionNews = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<news>([this.news as news], data, { showTitle: 'title', showText: 'text' })
        this._album = [{
          src: news?.poster ? news?.poster : "",
          thumb: news?.poster ? news?.poster : "",
          caption: news?.title
        }]
      })
      this.allNews = allNews;
      this.subscriptionNewsArray = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<news>(allNews, data, { showTitle: 'title', showText: 'text' })
      })
      this.placeArray = allNews.findIndex(value => { return value.id == news?.id })
    });
  }
  handleChangeItem(value: number) {
    this.placeArray += value
  }
  getItemRoute(place: number, array: any[], defaultValue: any = 1) {
    let value:any = ''
    if (array.length > 0) {
      if (array[place]) {
        value =  array[place]
      } else {
        value =  array[0].id
      }
    }
    value = defaultValue
    return defaultValue
  }
  open(): void { // open lightbox 
    this._lightbox.open(this._album, 0);
  }

  close(): void { // close lightbox programmatically 
    this._lightbox.close();
  }
}
