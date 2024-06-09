import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagePreviewService {

  constructor() { }

  previewImage(file: File) {
    const imagePreviewSubject = new Subject<string | ArrayBuffer | null>();
    const reader = new FileReader();
    reader.onload = async () => {
      imagePreviewSubject.next(reader.result);
    };
    reader.readAsDataURL(file);
    return imagePreviewSubject
  }
}
