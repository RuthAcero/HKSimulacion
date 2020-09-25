import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(private httpClient: HttpClient) { }

  async getRoles() {
    try {
      let result: any = await this.httpClient.get(`${environment.api}roles`).toPromise();
      return result.result.data;
    } catch (err) {
      return err;
    }
  }

  async addRole(data) {
    return this.httpClient.post(`${environment.api}roles`, data).toPromise();
  }

  async editRole(data, id) {
    return this.httpClient.put(`${environment.api}roles/${id}`, data).toPromise();
  }

  async deleteRole(id) {
    return this.httpClient.delete(`${environment.api}roles/${id}`).toPromise();
  }


  async getModules() {
    try {
      let result: any = await this.httpClient.get(`${environment.api}modules`).toPromise();
      return result.result.data;
    } catch (err) {
      return err;
    }
  }

}
