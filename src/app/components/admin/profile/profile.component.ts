import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { ImagePreviewService } from '@services/image-preview.service';
import { RequestsService } from '@services/requests.service';
interface profile {
  name: string,
  email: string,
  phone: string,
  text: string,
  avatar: any,
  password: string
}
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  user: profile = { name: "", email: "", phone: "", text: "", avatar: "", password: "" }
  avatarPreviewUrl: string | ArrayBuffer | null = "assets/imgs/painting/create.png"
  update = false
  constructor(
    private readonly req: RequestsService,
    private readonly preview: ImagePreviewService
  ) { }
  ngOnInit(): void {
    this.req.Get<profile>(`${environment.apiUrl}/user/1`).subscribe(data => {
      this.user = data
      if (data.avatar) {
        this.avatarPreviewUrl = `${environment.apiUrl}/static/imgs/avatar/${data.avatar}`
      }
    })
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
      formData.append('uploadImage', this.user.avatar, this.user.avatar.name)
    }

    formData.append('name', this.user.name)
    formData.append('email', this.user.email)
    formData.append('phone', this.user.phone)
    formData.append('password', this.user.password)
    formData.append('text', this.user.text)
    this.update = true
    this.req.Patch(`${environment.apiUrl}/user/1`, formData).subscribe(data => {
      if(data){
        this.update = false
        this.user.password = ''
      }
    })
  }
}
