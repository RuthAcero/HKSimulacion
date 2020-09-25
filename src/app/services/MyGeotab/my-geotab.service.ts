import { Injectable } from '@angular/core';
import { GeotabService } from 'mm-gah';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MyGeotabService {
  apiRef: any;
  geotabService: any;

  constructor() {
    this.geotabService = new GeotabService();
  }

  initApi() {
    return new Promise(async (res, reject) => {
      try {
        if (this.apiRef) {
          res(this.apiRef);
        } else {
          this.apiRef = await this.geotabService.init(environment.addin_name, environment.production);
          res(this.apiRef);
        }
      } catch (error) {
        reject(error);
      }
    });
  }


  async getGeotabData() {
    await this.initApi();
    return new Promise((res, rej) => {
      this.apiRef.getSession((cred, db) => {
        if (cred) {
          const calls = [
            ['Get', { typeName: 'Device' }],
            ['Get', { typeName: 'User', search: { name: cred.userName } }],
          ];
          this.apiRef.multiCall(calls, results => {
            const devices = results[0].filter(r => r.serialNumber !== '000-000-0000');
            const user = { name: results[1][0].name, ...cred, server: db }
            res({ devices: devices, user: user });
          }, error => {
            rej(error);
          });
        } else {
          rej();
        }
      });
    });
  }

  async initGeotab() {
    await this.initApi();
    return new Promise((res, rej) => {
      this.apiRef.getSession((cred, db) => {
        if (cred) {
          const calls = [
            ['Get', { typeName: 'User', search: { name: cred.userName } }],
            ['Get', { typeName: 'User' }],
          ];
          this.apiRef.multiCall(calls, result => {
            if (result) {
              const user = {
                id: result[0][0].id,
                name: result[0][0].name,
                sessionId: cred.sessionId,
                database: cred.database,
                userName: cred.userName,
                server: db
              }

              result[1] = result[1].map(e => ({
                userName: e.name,
                name: e.firstName,
                lastName: e.lastName,
                comments: ''
              }));


              res({ user: user, users: result[1] });
            } else {
              rej({ user: null, users: null });
            }
          });
        }
      });
    });
  }


  async getDevices() {
    await this.initApi();
    return new Promise((res, rej) => {
      this.apiRef.getSession((cred, db) => {
        if (cred) {
          this.apiRef.multiCall([['Get', { typeName: 'Device' }]], result => {
            if (result) {
              result[0] = result[0].map(e => ({
                id: e.id,
                name: e.name, serialNumber: e.serialNumber, plate: e.licensePlate, vin: e.vehicleIdentificationNumber
              }));
              res(result[0]);
            } else {
              rej([]);
            }
          });
        }
      });
    });
  }


  async getZones() {
    await this.initApi();
    return new Promise((res, rej) => {
      this.apiRef.getSession((cred, db) => {
        if (cred) {
          this.apiRef.multiCall([['Get', { typeName: 'Zone' }]], result => {
            if (result) {
              res(result[0]);
            } else {
              rej([]);
            }
          });
        }
      });
    });
  }


}
