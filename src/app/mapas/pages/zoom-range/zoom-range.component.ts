import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'; // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getzoom

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .row {
        background-color: white;
        border-radius: 5px;
        bottom: 50px;
        left: 50px;
        padding: 5px;
        position: fixed;
        z-index: 99999;
        width: 400px;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('mapa') divMapa!: ElementRef; // ElementsRef perquè agafa la propietat mapa de l'html (el div #mapa)
  mapa!: mapboxgl.Map;
  zoomLevel: number = 10;
  center: [number, number] = [ 1.242534252261665, 41.12374039214378 ];

  constructor() {
   }
  ngOnDestroy(): void { // Removem els eventListeners que hem inclòs perquè no s'acumulin
    this.mapa.off('zoom', () => {});
    this.mapa.off('zoomend', () => {});
    this.mapa.off('move', () => {});
  }

  ngAfterViewInit(): void { // Treballem amb ngAfterViewInit i no ngOnInit perquè quan entra en aquest mètode, el mapa no s'ha carregat, es carrega quan es carrega la vista. Llavors utilitzem aquest mètode
    
    // console.log(this.divMapa)/
    // EL mapa està importat a app.component.ts (perquè tots estan connectats amb l'app)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // Busca IDS (buscarà el div del html amb id mapa)
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    // Accions al fer zoom en el mapa
    this.mapa.on('zoom', (e) => { // Quan es faci zoom, s'executa. És una funció de mapbox
      const zoomActual = this.mapa.getZoom();
      this.zoomLevel = zoomActual;
      console.log(zoomActual)
    });

    this.mapa.on('zoomend', (e) => { // Quan s'hagi acabat de fer l'animació zoom, s'executa. És una funció de mapbox
      if( this.mapa.getZoom() > 18 ) {
        this.mapa.zoomTo(18); // Si es passa el zoom de 18, se li assigna a 18
      }
    });

    // Moviment del mapa (Quan es movi el mapa, lat i lng de l'html es canvien en temps real)
    this.mapa.on('move', (e) => {
      const target = e.target;
      const { lng, lat } = target.getCenter();
      this.center = [lng, lat];
    })

  }

  zoomOut() {
    this.mapa.zoomOut();
  }

  zoomIn() {
    this.mapa.zoomIn();
  }

  canviZoom( valor: string ) {
    this.mapa.zoomTo( Number(valor) ); // Com que és un string, el passem a number
  }

}
