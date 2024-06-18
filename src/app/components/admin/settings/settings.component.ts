import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '@env';
import { BgService } from '@services/bg.service';
import { RequestsService } from '@services/requests.service';
import { FormsModule } from '@angular/forms';
interface bg {
  id: number;
  path: string;
  status: boolean;
  createdAt: string
}
interface user {
  mapSrc: string
}
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  backgrounds$ = this.bgService.getBackgrounds();
  mapSrc = ""
  change = false
  constructor(
    private readonly req: RequestsService,
    private bgService: BgService
  ) { }
  ngOnInit(): void {
    this.req.Get<user>(`${environment.apiUrl}/user/1`).subscribe(data => {
      this.mapSrc = data.mapSrc
    })
  }
  trackByFn(index: number, item: any) {
    return item.id;
  }
  uploadBgFile(e: any): void {
    const fileList: FileList = e.target.files;
    if (fileList.length < 1) {
      return;
    }
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      this.bgService.uploadBackground(file).subscribe(() => {
        e.target.value = "";
        console.log(`Background ${file.name} uploaded`);
      });
    }
  }
  toggleBackgroundStatus(bg: bg): void {
    this.bgService.updateBackgroundStatus(bg.id, !bg.status).subscribe(() => {
      
    });
  }
  deleteBackground(id: number): void {
    this.bgService.deleteBackground(id).subscribe(() => {
      
    });
  }
  changeMapSrc(){
    this.change = true
    this.req.Patch(`${environment.apiUrl}/user/1`,{mapSrc: this.mapSrc}).subscribe(data=>{
      if(data){
        this.change = false
      }
    })
  }
}
