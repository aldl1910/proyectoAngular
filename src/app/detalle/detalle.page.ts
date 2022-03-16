import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tienda } from '../tienda';
import { FirestoreService } from '../firestore.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  id: string = "";
  //titulo: string ="";
  //precio: string ="";
  // descripcion: string ="";
  userEmail: String = "";
  userUID: String = "";
  isLogged: boolean;
  imageURL: String;
  
  document: any = {
    id: "",
    data: {} as Tienda
  };

  arrayColeccionTienda: any =[{
    id:"",
    data:{} as Tienda
  }]

  tiendaEditando: Tienda;
  

  constructor(
    private activatedRoute: ActivatedRoute, 
    private firestoreService: FirestoreService, 
    public alertController: AlertController,
    private loadingController: LoadingController,
    private toastConstroller: ToastController,
    private authService: AuthService, 
    public afAuth: AngularFireAuth,
    public loadingCtrl: LoadingController,
    private router: Router
    ) {  }

  

  ngOnInit() {
    
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    this.firestoreService.consultarPorId("vehiculos", this.id).subscribe((resultado) => {
      // Preguntar si se hay encontrado un document con ese ID
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // Como ejemplo, mostrar el título de la tarea en consola
        console.log(this.document.data.marca);
      } else {
        // No se ha encontrado un document con ese ID. Vaciar los datos que hubiera
        this.document.data = {} as Tienda;
      } 
    });
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

  idVehiculoSelec: string;
  clicBotonInsertar(){
    return this.firestoreService.insertar("vehiculos", this.document.data).then(
      ()=> {
        console.log("Vehículo creado correctamente");
        // Limpiar el contenido de la herramienta que se estaba editando
        this.tiendaEditando = {} as Tienda;
      }, (error) => {
        console.error(error);
      }
    );
  }
  clicBotonBorrar(){
    this.alertController.create({
      header: 'Alerta de confirmacion',
      subHeader: 'Confirmaremos si procedemos a borrar',
      message: '¿Estás seguro? ¿Desea eliminarlo?',
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('Lo necesito!');
          }
        },
        {
          text: 'Sí!',
          handler: () => {
            console.log('Qué más dá');
            this.firestoreService.borrar("vehiculos", this.document.id).then(() => {
              this.obtenerListaVehiculos();
              this.tiendaEditando = {} as Tienda;
            })
          }
        }
      ]
    }).then(res => {
      res.present();
    });
    
  }

  clicBotonModificar(){
    this.firestoreService.actualizar("vehiculos", this.document.id, this.document.data).then(() => {
      this.obtenerListaVehiculos();
      this.tiendaEditando = {} as Tienda;
    });
  }

  ionViewDidEnter(){
    this.isLogged = false;
    this.afAuth.user.subscribe(user =>{
      if(user){
        this.userEmail = user.email;
        this.userUID = user.uid;
        this.isLogged = true;
      } else {
        this.router.navigate(["/home"])
      }
    })
  }
}
