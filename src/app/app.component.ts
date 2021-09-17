import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl'; // https://docs.mapbox.com/mapbox-gl-js/api/map/#map#getzoom
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
  }
}
