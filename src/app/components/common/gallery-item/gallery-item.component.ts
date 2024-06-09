import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
import { forkJoin, map, switchMap } from 'rxjs';
interface painting {
  id:number
  title: string
  des: string
  price:number
  imgPath: string
}
@Component({
  selector: 'app-gallery-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gallery-item.component.html',
  styleUrl: './gallery-item.component.scss'
})
export class GalleryItemComponent {
  painting: Partial<painting> | null = {}
  allPaintings: painting[] = []
  id = 0
  placeArray = 0
  change = false
  constructor(
    private readonly req: RequestsService,
    private route: ActivatedRoute
  ){}
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
      this.allPaintings = allPaintings;
      this.placeArray = allPaintings.findIndex(value=>{return value.id == painting?.id})
    });
  }
  handleChangeItem(value:number){
    this.placeArray += value
  }
}
