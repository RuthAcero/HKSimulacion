import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private httpClient: HttpClient) { }


  async lastLocation(devices, offset) {
    try {
      let result: any = await this.httpClient.get(`${environment.api}dashboard/go?deviceIds=${devices}2&offset=${offset}`).toPromise();
      console.log(result);
      return result.result;
    } catch (error) {
      console.log(error);
      return { status: false, message: error };
    }
  }
}
