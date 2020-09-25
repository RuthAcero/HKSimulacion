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

  getSession() {
    return localStorage.getItem('APPSecurityToken');
  }
  


  setSessionStorage(user) {
    const userString = JSON.stringify(user);
    localStorage.setItem('APPSecurityToken', userString);
  }


  getSessionStorage() {
    const data = localStorage.getItem('APPSecurityToken');
    console.log(data);
    if (data !== null && data !== undefined) {
      const dataSend = JSON.parse(data);
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('token', dataSend.tokenApi);
      return this.httpClient.get(`${environment.api}login`, { headers }).toPromise();
    } else {
      return null;
    }
  }
}
