import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-full-screen',
  templateUrl: './full-screen.component.html',
  styles: [
    `
      #mapa {
        height: 100%;
        width: 100%;
      }
    `
  ]
})
export class FullScreenComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // EL mapa està importat a app.component.ts (perquè tots estan connectats amb l'app)
    var map = new mapboxgl.Map({
      container: 'mapa', // Busca IDS (buscarà el div del html amb id mapa)
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [ 1.242534252261665, 41.12374039214378 ],
      zoom: 16
    });
  }

}
