import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
interface profile {
  name?: string,
  email?: string,
  phone?: string,
  text?: string,
  avatar?: any
}
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  src=""
  safeSrc:SafeResourceUrl | undefined
  user:profile = {}
  constructor(
    private readonly req: RequestsService,
    private sanitizer: DomSanitizer
  ){}

  ngOnInit(): void {
    this.req.Get<any>(`${environment.apiUrl}/user/1`).subscribe(data=>{
      this.src = data.mapSrc
      if (this.src){
        this.safeSrc = this.sanitizer.bypassSecurityTrustResourceUrl(this.src);
      }
    })
    this.req.Get<profile>(`${environment.apiUrl}/user/1`).subscribe(data=>{
      data.avatar = `${environment.apiUrl}/static/imgs/avatar/${data.avatar}`
      this.user = data
    })
  }
}
