import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {


  constructor(private httpClient: HttpClient) { }

  async addGO(data) {
    return this.httpClient.post(`${environment.api}devices/go`, data).toPromise();
  }

  async createGO(data) {
    return this.httpClient.post(`${environment.api}devices/go`, data).toPromise();
  }

  async getDevicesGO() {
    try {
      const result: any = await this.httpClient.get(`${environment.api}devices/go`).toPromise();
      return result.result.data;
    } catch (error) {
      return error;
    }
  }

  async updateGO(data, id) {
    return this.httpClient.put(`${environment.api}devices/go/${id}`, data).toPromise();
  }

  async deleteGO(id) {
    return this.httpClient.delete(`${environment.api}devices/go/${id}`).toPromise();
  }

}
