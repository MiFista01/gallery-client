import { Component } from '@angular/core';
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
  selector: 'app-about-view',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  user:profile = {}
  constructor(private readonly req:RequestsService){}
  ngOnInit(): void {
    this.req.Get<profile>(`${environment.apiUrl}/user/1`).subscribe(data=>{
      data.avatar = `${environment.apiUrl}/static/imgs/avatar/${data.avatar}`
      this.user = data
    })
  }
}
