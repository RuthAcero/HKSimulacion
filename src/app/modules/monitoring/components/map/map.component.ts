import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MapsAPILoader, GoogleMapsAPIWrapper, AgmMap, LatLngBounds, LatLngBoundsLiteral } from '@agm/core';
import { EventsService } from 'src/app/services/Events/events.service';
import { ShareService } from 'src/app/services/Share/share.service';
import { MyGeotabService } from 'src/app/services/MyGeotab/my-geotab.service';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('AgmMap') agmMap: AgmMap;
  @Input() typeMap = null;
  @Input() heightContent;
  @Input() lstDevices;
  zoomMap = 5;
  lat = 25.5421195;
  lng = -103.3999041;
  seemAp = false;
  isFisrt = true;
  pathsPolygon = [];
  constructor(
    private eventService: EventsService,
    private geotabService: MyGeotabService,
    private shareServie: ShareService
  ) { }

  ngOnInit() {
    this.eventService.varListDevices = this.eventService.
      invokeListDevices.subscribe((list) => {
        this.lstDevices = list;
        if (this.isFisrt) {
          if (list.length) {
            const auxFinds = list.filter(e => e.latitude !== 0 && e.longitude !== 0).map(e => ({ lat: e.latitude, lng: e.longitude }))
            if (auxFinds.length) {
              this.searchFitBounds(auxFinds);
              this.isFisrt = false;
            }
          }
        }
      });

    this.eventService.varDeviceSelect = this.eventService.
      invokeDeviceSelect.subscribe((item) => {
        if (item.latitude !== 0 && item.longitude !== 0) {
          this.searchFitBounds([{ lat: item.latitude, lng: item.longitude }]);
        } else {
          this.shareServie.showInfoToastAutoClose(`No se encontró posición para dispositivo "${item.name}"`)
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.typeMap && changes.typeMap.currentValue) {
      if (this.typeMap === 0) {
        console.log('Solo ver');
      }

      if (this.typeMap === 1) {
        console.log('VER Y MOSTRAR ZONAS');
        // this.getZones();
      }

      if (this.typeMap === 2) {
        console.log('VER y agregar zonas');

      }
    }
  }

  ngOnDestroy() {
    this.eventService.varDeviceSelect.unsubscribe();
    this.eventService.varListDevices.unsubscribe();
  }

  onMapReady(map) {
    map.setOptions({
      zoomControl: 'true',
      mapTypeControl: 'true',
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
        style: google.maps.ZoomControlStyle.DEFAULT
      },
      mapTypeControlOptions: {
        position: google.maps.ControlPosition.RIGHT_TOP,
      }
    });
  }

  searchFitBounds(data) {
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    for (const mm of data) {
      bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
    }
    // @ts-ignore
    this.agmMap._mapsWrapper.fitBounds(bounds, { zoom: 14 });
  }



  async getZones() {
    try {
      let result: any = await this.geotabService.getZones();
      console.log(result);
    } catch (error) {
      this.shareServie.showErrorToast(error);
    }
  }
}
