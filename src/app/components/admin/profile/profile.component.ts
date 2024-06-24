import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ImagePreviewService } from '@services/image-preview.service';
import { RequestsService } from '@services/requests.service';
import { finalize, Subscription, timer } from 'rxjs';
declare function initSwiper(element: HTMLElement, thumb: any, mouse: boolean): void;
interface profile {
  name: string,
  email: string,
  phone: string,
  text: string,
  rusText: string,
  estText: string,
  avatar: any,
  password: string
}
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: profile = { name: "", email: "", phone: "", text: "", rusText: "", estText: "", avatar: "", password: "" }
  avatarPreviewUrl: string | ArrayBuffer | null = "assets/imgs/painting/create.png"
  update = false
  isError = false
  errorMessage = ''
  timerSub: Subscription | undefined
  @ViewChild('desSwiper', { static: true }) des!: ElementRef<HTMLElement>;
  constructor(
    private readonly req: RequestsService,
    private readonly preview: ImagePreviewService,
    private translate: TranslateService
  ) { }
  ngOnInit(): void {
    this.req.Get<profile>(`${environment.apiUrl}/user/1`).subscribe(data => {
      if (data.avatar) {
        this.avatarPreviewUrl = `${environment.apiUrl}/static/imgs/avatar/${data.avatar}`
      }
      this.user = data
    })
    initSwiper(this.des.nativeElement, null, true)
  }

  setImg(e: any) {
    let fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    const file = fileList[0];
    this.user.avatar = file
    this.preview.previewImage(file).subscribe(data => {
      this.avatarPreviewUrl = data
    })
  }

  updateProfile() {
    let formData: FormData = new FormData();

    if (this.user.avatar instanceof File) {
      formData.append('uploadImage', this.user.avatar, this.user.avatar.name);
    }

    if (this.user.name) {
      formData.append('name', this.user.name);
    } else {
      this.handleError('errors.emptyName');
      return;
    }

    if (this.user.email) {
      formData.append('email', this.user.email);
    } else {
      this.handleError('errors.emptyEmail');
      return;
    }
    if (this.user.phone) {
      formData.append('phone', this.user.phone);
    }
    if (this.user.password) {
      formData.append('password', this.user.password);
    }
    if (this.user.text) {
      formData.append('text', this.user.text);
    }
    if (this.user.text) {
      formData.append('rusText', this.user.rusText);
    }
    if (this.user.text) {
      formData.append('estText', this.user.estText);
    }

    this.update = true;
    this.req.Patch(`${environment.apiUrl}/user/1`, formData).pipe(
      finalize(() => {
        this.update = false;
      })
    ).subscribe({
      next: data => {
        if (data) {
          this.user.password = '';
        }
      },
      error: err => {
        console.error('Update profile error:', err);
        // Здесь можно добавить обработку ошибки, если требуется
      }
    });
  }

  private handleError(errorKey: string) {
    this.translate.get(errorKey).subscribe((res: string) => {
      this.errorMessage = res;
      this.isError = true;
      if (this.timerSub) {
        this.timerSub.unsubscribe();
      }
      this.timerSub = timer(2000).subscribe(() => {
        this.isError = false;
      });
    });
  }

}
