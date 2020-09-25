import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private httpClient: HttpClient) { }

  async addUserData(data) {
    return this.httpClient.post(`${environment.api}users`, data).toPromise();
  }

  async getAlllUsersData() {
    try {
      const result: any = await this.httpClient.get(`${environment.api}users`).toPromise();
      return result.result.data;
    } catch (error) {
      return error;
    }
  }

  async updateUser(user, id) {
    return this.httpClient.put(`${environment.api}users/${id}`, user).toPromise();
  }

  async deleteUser(idUser) {
    return this.httpClient.delete(`${environment.api}users/${idUser}`).toPromise();
  }

  async deleteList(data) {
    const auxD = []
    for (const item of data) {
      const result: any = await this.httpClient.delete(`${environment.api}users/${item.userId}`).toPromise();
      result.result.status ?
        auxD.push({ status: true, message: result.result.message, data: item.id }) :
        auxD.push({ status: false, message: `Conflicto al eliminar usuario "${item.name}".` });
    }
    return auxD;
  }

  async getTimeZones() {
    try {
      const result: any = await this.httpClient.get(`${environment.api}timezones`).toPromise();
      return result.result.data;
    } catch (error) {
      return error;
    }
  }
}
