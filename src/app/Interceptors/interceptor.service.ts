import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = window.localStorage.getItem('APPSecurityToken');
    const dataSend = JSON.parse(authToken);

    if (authToken) {
      req = req.clone({
        headers: req.headers.set('token', dataSend.tokenApi),
      });
    }
    return next.handle(req);
  }
}
