import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
interface painting {
  id?:number
  title: string
  des: string
  price:number
  imgPath: string
}
@Component({
  selector: 'app-gallery-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  showPaintings:painting[] = []
  allPaintings:painting[] = []
  constructor(
    private readonly req: RequestsService
  ){}
  ngOnInit(): void {
    this.req.Get<painting[]>(`${environment.apiUrl}/painting`).subscribe(data=>{
      this.showPaintings = data.map(value=>{
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
      this.allPaintings = data.map(value=>{
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
    })
  }
  searchPainting(e:any){
    this.showPaintings = this.allPaintings.filter((value, index, array) => {return value.title.toLowerCase().includes(e.target.value.toLowerCase())})
  }
}
