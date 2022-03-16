import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import * as L from 'leaflet';
@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})

export class InformacionPage implements OnInit {

  map: L.Map;
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  constructor(
    private authService: AuthService, 
    public afAuth: AngularFireAuth,
    private router: Router,) {  }

  

  ionViewDidEnter(){
    this.loadMap();
    this.isLogged = false;
    this.afAuth.user.subscribe(user =>{
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } 
    })
  }
  
  login() {
    this.router.navigate(["/login"]);
  }

  logout(){
    this.authService.doLogout()
    .then(res => {
      this.userEmail = "";
      this.userUID = "";
      this.isLogged = false;
      console.log(this.userEmail);
    }, err => console.log(err));
  }
  

  loadMap() {
    var greenIcon = L.icon({
      iconUrl: 'https://leafletjs.com/SlavaUkraini/examples/custom-icons/leaf-green.png',
      shadowUrl: 'https://leafletjs.com/SlavaUkraini/examples/custom-icons/leaf-shadow.png',
    
      iconSize:     [38, 95], // size of the icon
      shadowSize:   [50, 64], // size of the shadow
      iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62],  // the same for the shadow
      popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    let latitud = 42.534611;
    let longitud = 1.525853;
    let zoom = 7.18;
    this.map = L.map("mapId").setView([latitud, longitud], zoom);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(this.map);
    var marker = L.marker([latitud, longitud], {icon: greenIcon}).addTo(this.map);
    marker.bindPopup("<b>Bienvenidos a <br>nuestra sede </b>").openPopup();
    var circle = L.circle([36.674912, -5.445099], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(this.map);
    circle.bindPopup("Nuestros concesionarios");

    var circle1 = L.circle([37.392778, -5.996775], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(this.map);
    circle1.bindPopup("Nuestros concesionarios");

    var circle2 = L.circle([40.391483,  -3.693944], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(this.map);
    circle2.bindPopup("Nuestros concesionarios");

    var circle3 = L.circle([39.502855,  -0.413761], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(this.map);
    circle3.bindPopup("Nuestros concesionarios");

    var circle4 = L.circle([42.875053,  -8.542924], {
      color: 'blue',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(this.map);
    circle4.bindPopup("Nuestros concesionarios");
  }

  ngOnInit() {
  }

}
