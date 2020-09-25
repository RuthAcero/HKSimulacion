import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }


  async login(data) {
    try {
      const result: any = await this.httpClient.post(`${environment.api}login`, data).toPromise();
      return result.result;
    } catch (error) {
      return error;
    }
  }

  setSession(user) {
    localStorage.setItem('APPSecurityToken', user);
  }

}
