import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
import { IAlbum, Lightbox, LightboxModule } from 'ngx-lightbox';
import { forkJoin, map, Subscription, switchMap, timer } from 'rxjs';
interface painting {
  id: number
  title: string
  des: string
  price: number
  imgPath: string
  size: string
}
interface Order {
  name: string;
  lastName: string;
  address: string;
  email: string;
  zip: string;
  city: string;
  phone: string;
  wishes: string;
};
@Component({
  selector: 'app-gallery-item',
  standalone: true,
  imports: [CommonModule, RouterModule, LightboxModule, FormsModule],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss'
})
export class GalleryItemComponent {

  painting: Partial<painting> | null = {}
  allPaintings: painting[] = []
  private _album: IAlbum[] = [];
  timerSub: Subscription | undefined
  clearMessage: Subscription | undefined
  order: Order = { name: "", lastName: "", address: "", email: "", zip: "", city: "", phone: "", wishes: "" }
  id = 0
  placeArray = 0
  change = false
  send = false
  showMessage = false
  message = ''
  constructor(
    private readonly req: RequestsService,
    private route: ActivatedRoute,
    private _lightbox: Lightbox
  ) { }
  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id !== null) {
          this.id = +id;
          return forkJoin({
            painting: this.req.Get<painting>(`${environment.apiUrl}/painting/${id}`).pipe(
              map(data => {

                if (data === null) {
                  return null
                }
                return {
                  ...data,
                  imgPath: `${environment.apiUrl}/static/imgs/paintings/${data.imgPath}`
                };
              }),
            ),
            allPaintings: this.req.Get<painting[]>(`${environment.apiUrl}/painting`).pipe(
              map(array => array.map(data => ({
                ...data,
                imgPath: `${environment.apiUrl}/static/imgs/paintings/${data.imgPath}`
              })))
            )
          });
        }
        return [];
      })
    ).subscribe(({ painting, allPaintings }) => {
      this.painting = painting;
      this._album = [{
        src: painting?.imgPath ? painting?.imgPath : "",
        thumb: painting?.imgPath ? painting?.imgPath : "",
        caption: painting?.title
      }]

      this.allPaintings = allPaintings;
      this.placeArray = allPaintings.findIndex(value => { return value.id == painting?.id })
    });
  }
  handleChangeItem(value: number) {
    this.placeArray += value
  }
  open(): void { // open lightbox 
    this._lightbox.open(this._album, 0);
  }

  close(): void { // close lightbox programmatically 
    this._lightbox.close();
  }
  submitOrder() {
    this.send = true
    for (let i of Object.keys(this.order) as (keyof Order)[]) {
      if (!this.order[i] && i != "wishes") {
        this.message = `Sa ei täitnud välja nime "${i}" all`
        if (this.timerSub) {
          this.timerSub.unsubscribe()
          this.clearMessage?.unsubscribe()
        }
        this.showMessage = true
        this.timerSub = timer(3000).subscribe(data => {
          this.showMessage = false
          this.clearMessage = timer(450).subscribe(data=>{
            this.message = ''
          })
        })
        this.send = false
        break
      }
    }
    if (this.send) {
      this.req.Post<{status:boolean, message: string}>(`${environment.apiUrl}/painting/order`, { order: this.order, painting: this.painting }).subscribe(data => {
        if (data.status) {
          this.send = false
          this.order = { name: "", lastName: "", address: "", email: "", zip: "", city: "", phone: "", wishes: "" }
        }
      })
    }
  }
}
