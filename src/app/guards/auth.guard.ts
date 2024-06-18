import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { environment } from '@env';
import { RequestsService } from '@services/requests.service';
import { lastValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const req: RequestsService = inject(RequestsService);
  const router: Router = inject(Router);
  try {
    const result = req.Get(`${environment.apiUrl}/user/check`)
    let res = await lastValueFrom(result);
    return (res as boolean);
    
  } catch (error) {
    router.navigate(['/home'])
    return false
  }
};
