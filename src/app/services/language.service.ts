import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private _sharedLangue = new BehaviorSubject<any>('eng');
  langue$ = this._sharedLangue.asObservable();
  constructor(
    private translate: TranslateService,
    private cookieService: CookieService
  ) {
    if (!cookieService.get("lang")) {
      cookieService.set("lang","eng")
    } else {
      const langValue = cookieService.get("lang")
      translate.use(langValue)
      this._sharedLangue.next(langValue)
    }
  }
  updateLanguageFields<T extends Record<string, any>>(items: T[], lang: string, fieldMappings: Record<string, string>): void {
    items.forEach(item => {
      for (const [key, value] of Object.entries(fieldMappings)) {
        let fieldName = '';
        if (lang === "eng") {
          item[key as keyof T] = item[value] ? item[value] : '';
        } else if (lang === "ru") {
          fieldName = `rus${value.charAt(0).toUpperCase() + value.slice(1)}`;
          item[key as keyof T] = item[fieldName] ? item[fieldName] : '';
        } else {
          fieldName = `est${value.charAt(0).toUpperCase() + value.slice(1)}`;
          item[key as keyof T] = item[fieldName] ? item[fieldName] : '';
        }
      }
    });
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this._sharedLangue.next(language);
    this.cookieService.set("lang", language)
  }
}
