import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { environment } from '@env';
import { TranslateModule } from '@ngx-translate/core';
import { ImagePreviewService } from '@services/image-preview.service';
import { RequestsService } from '@services/requests.service';
import { Subscription, timer } from 'rxjs';
declare function initSwiper(element: HTMLElement, thumb: any, mouse: boolean): void;
interface news {
  id: number
  title: string
  rusTitle: string
  estTitle: string
  text: string
  rusText: string
  estText: string
  poster: any
}
@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './news.component.html',
  styleUrl: './news.component.scss'
})
export class NewsComponent {
  id = 0
  news: Partial<news> = {}
  newsArray: news[] = []
  errorMessage = ""
  newsPreviewUrl: string | ArrayBuffer | null = "assets/imgs/painting/create.png"
  timer: Subscription | null = null
  @ViewChild('poster') poster!: ElementRef<HTMLInputElement>;
  @ViewChild('titleSwiper', { static: true }) title!: ElementRef<HTMLElement>;
  @ViewChild('textSwiper', { static: true }) text!: ElementRef<HTMLElement>;
  singleClickDelay = 250;
  activeItemId = 0
  default = true
  active = false
  showNewsGallery = false
  clickTimeout: any;

  constructor(
    private readonly req: RequestsService,
    private readonly preview: ImagePreviewService
  ) { }
  ngOnInit(): void {
    this.req.Get<news[]>(`${environment.apiUrl}/news`).subscribe(data => {
      this.newsArray = data.map(data => {
        data.poster = data.poster ? `${environment.apiUrl}/static/imgs/news/${data.poster}` : ''
        return { ...data }
      })
    })
    initSwiper(this.title.nativeElement, initSwiper(this.text.nativeElement, null, false), true)
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
    const file = fileList[0];
    this.news.poster = file
    this.default = false
    this.preview.previewImage(file).subscribe(data => {
      this.newsPreviewUrl = data
    })
  }
  submitNews() {
    let formData: FormData = new FormData();
    if (this.news.poster instanceof File) {
      formData.append('uploadImage', this.news.poster, this.news.poster.name)
    }
    formData.append('title', this.news.title ? this.news.title : '')
    formData.append('text', this.news.text ? this.news.text : '')
    formData.append('rusTitle', this.news.rusTitle ? this.news.rusTitle : '')
    formData.append('rusText', this.news.rusText ? this.news.rusText : '')
    formData.append('estTitle', this.news.estTitle ? this.news.estTitle : '')
    formData.append('estText', this.news.estText ? this.news.estText : '')
    this.active = true
    if (this.id == 0) {
      this.req.Post<news>(`${environment.apiUrl}/news`, formData).subscribe(
        data => {
          if (data) {
            this.newsArray.push({ ...data, poster: `${environment.apiUrl}/static/imgs/news/${data.poster}` })
            this.news = {}
            this.poster.nativeElement.value = ''
            this.newsPreviewUrl = "assets/imgs/painting/create.png"
            this.default = true
            this.active = false
          }
        },
        error => {
          this.errorMessage = 'An error occurred while submitting the form.';
          this.clearError()
        }
      )
    } else {
      this.req.Patch<news>(`${environment.apiUrl}/news/${this.id}`, formData).subscribe(
        data => {
          if (data) {
            const index = this.newsArray.findIndex(item => item.id === this.id);
            if (index !== -1) {
              this.newsArray[index] = { ...data, poster: `${environment.apiUrl}/static/imgs/news/${data.poster}` };
            }
            this.news = {}
            this.poster.nativeElement.value = ''
            this.newsPreviewUrl = "assets/imgs/painting/create.png"
            this.default = true
            this.active = false
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
  toggleNewsGallery() {
    this.showNewsGallery = !this.showNewsGallery
    if (this.showNewsGallery) {
      this.activeItemId = 0
    }
  }
  selectNewsUpdate(item: news) {
    this.news = item
    if (item.poster) {
      this.newsPreviewUrl = item.poster
      this.default = false
    }
    this.id = item.id
    this.toggleNewsGallery()
  }
  handleClick(item: news) {
    if (this.clickTimeout) {
      clearTimeout(this.clickTimeout);
      this.clickTimeout = null;
      this.selectNewsUpdate(item)
    } else {
      this.clickTimeout = setTimeout(() => {
        this.activeItemId = item.id
        this.clickTimeout = null;
        this.activeItemId = item.id
      }, this.singleClickDelay);
    }
  }
  deleteNews(id: number) {
    this.req.Delete(`${environment.apiUrl}/news/${id}`).subscribe(data => {
      if (data) {
        const index = this.newsArray.findIndex(value => { return value.id == id })
        this.newsArray.splice(index, 1)
      }
    })
  }
}
