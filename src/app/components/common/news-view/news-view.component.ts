import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
interface news {
  id?:number
  title: string
  text: string
}
@Component({
  selector: 'app-news-view',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './news-view.component.html',
  styleUrl: './news-view.component.scss'
})
export class NewsViewComponent {
  showNews: news[] = []
  allNews: news[] = []
  constructor(
    private readonly req: RequestsService
  ){}
  ngOnInit(): void {
    this.req.Get<news[]>(`${environment.apiUrl}/news`).subscribe(data=>{
      this.showNews = [...data]
      this.allNews = [...data]
    })
  }
  searchNews(e:any){
    this.showNews = this.allNews.filter((value, index, array) => {return value.title.toLowerCase().includes(e.target.value.toLowerCase())})
  }
}
