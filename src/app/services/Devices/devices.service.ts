import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevicesService {

  constructor(private httpClient: HttpClient) { }

  async addST(data) {
    return this.httpClient.post(`${environment.api}devices/st`, data).toPromise();
  }

  async getDevicesST() {
    try {
      const result: any = await this.httpClient.get(`${environment.api}devices/st`).toPromise();
      return result.result.data;
    } catch (error) {
      return error;
    }
  }

  async updateST(data, id) {
    return this.httpClient.put(`${environment.api}devices/st/${id}`, data).toPromise();
  }

  async deleteST(id) {
    return this.httpClient.delete(`${environment.api}devices/st/${id}`).toPromise();
  }

  async deleteList(data) {
    const auxD = []
    for (const item of data) {
      const result: any = await this.httpClient.delete(`${environment.api}devices/st/${item.id}`).toPromise();
      result.result.status ?
        auxD.push({ status: true, message: result.result.message, data: item.id }) :
        auxD.push({ status: false, message: result.result.message ? result.result.message  + ` [${item.name}]`: `Conflicto al eliminar dispositivo "${item.name}".` });
    }
    return auxD;
  }
}
