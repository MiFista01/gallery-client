import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { RequestsService } from '@services/requests.service';
interface painting {
  id?:number
  title: string
  des: string
  price:number
  imgPath: string
}
interface news {
  id?:number
  title: string
  text: string
}
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  mostPopular:painting[] = []
  lastAdded:painting[] = []
  news: news[] = []
  desLength = 40
  constructor(
    private readonly req: RequestsService
  ){}
  ngOnInit(): void {
    this.req.Get<painting[]>(`${environment.apiUrl}/painting/popular`).subscribe(data=>{
      this.mostPopular = data.map(value=>{
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
    })
    this.req.Get<painting[]>(`${environment.apiUrl}/painting/last-added`).subscribe(data=>{
      this.lastAdded = data.map(value=>{
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
    })
    this.req.Get<news[]>(`${environment.apiUrl}/news`).subscribe(data=>{
      for(let i= 0; i <4; i++){
        this.news.push(data.pop()!)
      }
    })
  }
}
