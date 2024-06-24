import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
@Component({
  selector: 'app-gallery-view',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, FormsModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent {
  private subscriptionPaintingsAll: Subscription | undefined;
  private subscriptionPaintingsShow: Subscription | undefined;
  showPaintings:painting[] = []
  allPaintings: painting[] = []
  searchValue = ""
  constructor(
    private readonly req: RequestsService,
    private language: LanguageService
  ){}
  ngOnInit(): void {
    this.req.Get<painting[]>(`${environment.apiUrl}/painting`).subscribe(data=>{
      this.allPaintings = data.map(value=>{
        return {
          ...value,
          imgPath: `${environment.apiUrl}/static/imgs/paintings/${value.imgPath}`
        }
      })
      this.subscriptionPaintingsAll = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<painting>(this.allPaintings, data, { showTitle: 'title', showDes: 'des' })
      })
      this.showPaintings = [...this.allPaintings]
      this.subscriptionPaintingsShow = this.language.langue$.subscribe(data => {
        this.language.updateLanguageFields<painting>(this.showPaintings, data, { showTitle: 'title', showDes: 'des' })
        this.showPaintings = this.allPaintings.filter((value, index, array) => { return value.showTitle.toLowerCase().includes(this.searchValue.toLowerCase()) })
      })
    })
  }
  searchPainting(){
    this.showPaintings = this.allPaintings.filter((value, index, array) => { return value.showTitle.toLowerCase().includes(this.searchValue.toLowerCase())})
  }
  ngOnDestroy(): void {
    this.subscriptionPaintingsAll?.unsubscribe()
    this.subscriptionPaintingsShow?.unsubscribe()
  }
}
