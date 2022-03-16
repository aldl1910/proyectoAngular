import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Tienda } from '../tienda';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  arrayColeccionTienda: any =[{
    id:"",
    data:{} as Tienda
  }]
  filtro: string='';
  
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;

  tiendaEditando: Tienda;
  constructor(
    private firestoreService: FirestoreService, 
    private router: Router,  
    public loadingCtrl: LoadingController,
    private authService: AuthService, 
    public afAuth: AngularFireAuth) {
    // Crear una herramienta vacía al empezar
    this.tiendaEditando = {} as Tienda;
    this.obtenerListaVehiculos();
    
  }
  obtenerListaVehiculos(){
    this.firestoreService.consultar("vehiculos").subscribe((resultadoConsultaVehiculos) =>
    {
      this.arrayColeccionTienda =[];
      resultadoConsultaVehiculos.forEach((datosTienda: any) => {
        this.arrayColeccionTienda.push({
          id: datosTienda.payload.doc.id,
          data: datosTienda.payload.doc.data()
        });
      })
    });
  }

  segundaPantalla (){
    this.router.navigate(['detalle/:id'])
  }

  idVehiculoSelec: string;

  selecHerramienta(vehiculoSelec){
    console.log("Vehículo seleccionado:");
    console.log(vehiculoSelec);
    this.idVehiculoSelec = vehiculoSelec.id;
    this.tiendaEditando.marca = vehiculoSelec.data.marca;
    this.tiendaEditando.modelo = vehiculoSelec.data.modelo;
    this.tiendaEditando.precio = vehiculoSelec.data.precio;
    this.tiendaEditando.imagen = vehiculoSelec.data.imagen;
    this.router.navigate(['/detalle', this.idVehiculoSelec]);
  }
  ionViewDidEnter(){
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
}
