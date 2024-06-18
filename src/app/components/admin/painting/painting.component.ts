import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@env';
import { ImagePreviewService } from '@services/image-preview.service';
import { RequestsService } from '@services/requests.service';
import { Subscription, timer } from 'rxjs';
interface painting {
  id: number
  title: string
  des: string
  price: number
  img: any
  imgPath: string
  size:string
}
@Component({
  selector: 'app-painting',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './painting.component.html',
  styleUrl: './painting.component.scss'
})
export class PaintingComponent {
  id = 0
  singleClickDelay = 250;
  activeItemId = 0
  width = ""
  height = ""
  errorMessage = ""
  default = true
  active = false
  showGallery = false

  @ViewChild('choicePainting') img!: ElementRef<HTMLInputElement>;
  painting: Partial<painting> = {}
  galleryItems: painting[] = []
  paintingPreviewUrl: string | ArrayBuffer | null = "assets/imgs/painting/create.png"
  timer: Subscription | null = null
  
  clickTimeout: any;

  constructor(
    private readonly req: RequestsService,
    private readonly preview: ImagePreviewService
  ) { }
  ngOnInit(): void {
    this.req.Get<painting[]>(`${environment.apiUrl}/painting`).subscribe(data => {
      this.galleryItems = data.map(data => {
        data.imgPath = `${environment.apiUrl}/static/imgs/paintings/${data.imgPath}`
        return { ...data }
      })
    })
  }
  ngOnDestroy() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
  }
  setImg(e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    this.default = false
    const file = fileList[0];
    this.painting.img = file
    this.preview.previewImage(file).subscribe(data => {
      this.paintingPreviewUrl = data
    })
  }

  submitPainting() {
    let formData: FormData = new FormData();
    if (!(this.painting.img instanceof File) && this.id == 0) {
      this.errorMessage = 'Please select a valid image file.';
      this.clearError()
      return;
    } else {
      if ((this.painting.img instanceof File)) {
        formData.append('uploadImage', this.painting.img, this.painting.img.name)
      }
    }
    formData.append('title', this.painting.title ? this.painting.title : '')
    formData.append('price', String(this.painting.price))
    formData.append('des', this.painting.des ? this.painting.des : '')
    formData.append('size', `${this.width}x${this.height}`)
    this.active = true
    if (this.id == 0) {
      this.req.Post<painting>(`${environment.apiUrl}/painting`, formData).subscribe(
        data => {
          if (data) {
            this.painting.imgPath
            this.galleryItems.push({...data, imgPath: `${environment.apiUrl}/static/imgs/paintings/${data.imgPath}` })
            this.painting = {}
            this.img.nativeElement.value = ''
            this.width = ''
            this.height = ''
            this.paintingPreviewUrl = "assets/imgs/painting/create.png"
            this.active = false
            this.default = true
            this.id = 0
          }
        },
        error => {
          this.errorMessage = 'An error occurred while submitting the form.';
          this.clearError()
        }
      )
    } else {
      this.req.Patch<painting>(`${environment.apiUrl}/painting/${this.id}`, formData).subscribe(
        data => {
          if (data) {
            const index = this.galleryItems.findIndex(item => item.id === this.id);
            if (index !== -1) {
              this.galleryItems[index] = { ...this.painting as painting, imgPath: `${environment.apiUrl}/static/imgs/paintings/${data.imgPath}` };
            }
            this.painting = {}
            this.img.nativeElement.value = ''
            this.width = ''
            this.height = ''
            this.paintingPreviewUrl = "assets/imgs/painting/create.png"
            this.active = false
            this.default = true
            this.id = 0
          }
        },
        error => {
          this.errorMessage = 'An error occurred while submitting the form.';
          this.clearError()
        }
      )
    }
  }
  clearError() {
    if (this.timer) {
      this.timer.unsubscribe();
    }
    this.timer = timer(500).subscribe(() => { this.errorMessage = '' });
  }
  toggleGallery() {
    this.showGallery = !this.showGallery
  }
  selectPaintingUpdate(item: painting) {
    this.painting = item
    this.paintingPreviewUrl = item.imgPath
    this.default = false
    this.id = item.id
    if(item.size){
      this.width = item.size.split('x')[0]
      this.height = item.size.split('x')[1]
    }else{
      this.width = ''
      this.height = ''
    }
    this.toggleGallery()
  }
  handleClick(item: painting) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.selectPaintingUpdate(item)
    } else {
      this.clickTimeout = setTimeout(() => {
        this.activeItemId = item.id
        this.clickTimeout = null;
        this.activeItemId = item.id
      }, this.singleClickDelay);
    }
  }
  deletePainting(id:number){
    this.req.Delete(`${environment.apiUrl}/painting/${id}`).subscribe(data => {
      if (data) {
        const index = this.galleryItems.findIndex(value => { return value.id == id })
        this.galleryItems.splice(index, 1)
      }
    })
  }
}
