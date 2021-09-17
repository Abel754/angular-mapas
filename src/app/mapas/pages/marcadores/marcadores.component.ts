import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'; // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getzoom

interface MarcadorColor {
  color: string;
  marker?: mapboxgl.Marker;
  centro?: [number, number];
}

@Component({
  selector: 'app-marcadores',
  templateUrl: './marcadores.component.html',
  styles: [
    `
      .mapa-container {
        height: 100%;
        width: 100%;
      }

      .list-group {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 99;
      }

      li {
        cursor: pointer;
      }
      
    `
  ]
})
export class MarcadoresComponent implements AfterViewInit {

  @ViewChild('mapa') divMapa!: ElementRef; // ElementsRef perquè agafa la propietat mapa de l'html (el div #mapa)
  mapa!: mapboxgl.Map;
  zoomLevel: number = 15;
  center: [number, number] = [ 1.242534252261665, 41.12374039214378 ];

  // Array de marcadors:
  marcadores: MarcadorColor[] = [];
  

  constructor() { }

  ngAfterViewInit(): void {
    // console.log(this.divMapa)/
    // EL mapa està importat a app.component.ts (perquè tots estan connectats amb l'app)
    this.mapa = new mapboxgl.Map({
      container: this.divMapa.nativeElement, // Busca IDS (buscarà el div del html amb id mapa)
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.leerLocalStorage(); // Cada cop que carregui la vista, llegirà si al carregar la pantalla, hi ha marcadors al localStorage afegits prèviament

  }

  irMarcador( marcador: MarcadorColor ) {
    this.mapa.flyTo({
      center: marcador.marker?.getLngLat()
    })
  }

  agregarMarcador() {

    // Codi per generar un color aleatori 
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));

    const nuevoMarcador = new mapboxgl.Marker({ // Amb la funció Marker de mapbox, genera un nou marcador
      draggable: true, // Podem moure el marcador
      color: color
    })
    .setLngLat( this.center ) // Indiquem on ha d'estar el marcador (coordenades)
    .addTo( this.mapa ) // I a quin mapa

    this.marcadores.push( {
      color: color,
      marker: nuevoMarcador
    } );

    console.log(this.marcadores)
    this.guardarMarcadoresLocalStorage();

    nuevoMarcador.on('dragend', () => { // S'activa cada cop que es deixa d'arrossegar un marcador
      this.guardarMarcadoresLocalStorage();
    })
  }

  // Guarda els marcadors al LocalStorage
  guardarMarcadoresLocalStorage() {

    const lngLatArr: MarcadorColor[] = [];

    this.marcadores.forEach( marcador => {
      
      const color = marcador.color;
      const { lng, lat } = marcador.marker!.getLngLat();

      lngLatArr.push({
        color: color,
        centro: [ lng, lat ]
      })

      localStorage.setItem('marcadores', JSON.stringify(lngLatArr));

    })

  }

  leerLocalStorage() {

    if( !localStorage.getItem('marcadores') ) {
      return;
    }

    const lngLatArr: MarcadorColor[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( marcador => {

      const newMarker = new mapboxgl.Marker({
        color: marcador.color,
        draggable: true
      })
        .setLngLat( marcador.centro! )
        .addTo( this.mapa );

        this.marcadores.push({ // Omple l'array al llegir-los, perquè es perdria al refrescar el navegador
          marker: newMarker,
          color: marcador.color
        })

        newMarker.on('dragend', () => { // S'activa cada cop que es deixa d'arrossegar un marcador
          this.guardarMarcadoresLocalStorage();
        })

    })

  }

  borrarMarcador( i: number ) {

    // L'esborra del mapa
    this.marcadores[i].marker?.remove(); 

    // L'esborra de l'array
    this.marcadores.splice( i, 1 );

    // Actualitza els valors al localStorage
    this.guardarMarcadoresLocalStorage();

  }

}
