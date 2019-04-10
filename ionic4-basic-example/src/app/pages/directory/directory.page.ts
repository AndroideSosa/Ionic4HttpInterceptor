import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, AlertController } from '@ionic/angular';
import { RestApiService } from '../../rest-api.service';
import { Router } from '@angular/router';
import { GlobalService } from './../../global.service';
import { AddAreaPage } from './../add-area/add-area.page';
import { EditAreaPage } from './../edit-area/edit-area.page';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.page.html',
  styleUrls: ['./directory.page.scss'],
})
export class DirectoryPage implements OnInit {

  //Declaración de variables
  areas: any;
  userInfo: any;
  authorities: any;
  showButtons: boolean=false;
  
  constructor(private api: RestApiService, 
              private router: Router,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private modalController: ModalController,
              public global: GlobalService) { }

  ngOnInit() {
  }

  //Función para obtener las áreas registradas
  ionViewWillEnter() {
    this.getAreas();
    this.getUserInfo();
   }

   //Modales para agregar áreas
  async showAddAreaModal(){
    const modal = await this.modalController.create({
      component: AddAreaPage
      });
      modal.onDidDismiss()
      .then((data) => {
        if(data.data == "created"){
          this.getAreas();
        }else{
          console.log("Sin actualizacion");
        }
    });
      await modal.present();
  }

   //Función para presentar alerta con botones y eliminar área
   async showDeleteAlert(area,id) {
    const alert = await this.alertController.create({
      header: '¿Esta seguro de eliminar esta área?',
      message: area,
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: 'Si',
          handler: () => {
            this.deleteArea(id);
          }
        }
      ]
    });
    await alert.present();
  }

   //Modal para editar áreas
   async showEditAreaModal(area, role){
    const modal = await this.modalController.create({
      component: EditAreaPage,
      componentProps: { value: area, role:role }
      });
      modal.onDidDismiss()
      .then((data) => {
        if(data.data == "edited"){
          this.getAreas();
        }else{
          console.log("Sin actualizacion");
        }
    });
      await modal.present();
  }


    //Función para presentar alerta y mostrar al usuario
    async presentAlert(header,message) {
      const alert = await this.alertController.create({
        header: header,
        message: message,
        buttons: ['OK']
      });
  
      await alert.present();
    }  

    //Función para navegar al listado de usuarios por área
  goToUsersArea(name){
    this.router.navigate(['directory-detail',name]);
  }

  //Función para salir de la aplicación y eliminar token de usuario
  logout(){
    this.global.myGlobalVar=null;
    this.goAppLogin();
   }

  //Función para navegar al home de la aplicación
  goAppLogin(){
    this.router.navigate(['/login']);
  }


    //Llamada a servicio para obtener los datos del usuario en sesión
  async getUserInfo() {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.getUserInfo()
      .subscribe(res => {
        this.userInfo = res;
        this.authorities = this.userInfo.authorities;
       for (let index = 0; index < this.authorities.length; index++) {
         if(this.authorities[index].role == "ROLE_ADMIN" || this.authorities[index].role == "ROLE_SYSADMIN"){
           this.showButtons = true;
         }else{
         }
       }
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }

  //Llamada a servicios Rest
  async getAreas() {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.getAreas()
      .subscribe(res => {
        this.areas = res;
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }

   //Llamada a servicio Rest para eliminar un área seleccionada
   async deleteArea(id) {
    await this.api.deleteArea(id)
      .subscribe(res => {
        this.getAreas();
      }, (err) => {
        this.presentAlert("Error","Ocurrió un error mientras se intentaba eliminar el área, por favor inténtelo mas tarde.");
        console.log(err);
      });
  }

}
