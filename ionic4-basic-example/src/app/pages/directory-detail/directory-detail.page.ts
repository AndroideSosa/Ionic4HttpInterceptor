import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController,AlertController, LoadingController  } from '@ionic/angular';
import { AddEmployeePage } from './../add-employee/add-employee.page';
import { EditEmployeePage } from './../edit-employee/edit-employee.page';
import { RestApiService } from '.././../rest-api.service';

@Component({
  selector: 'app-directory-detail',
  templateUrl: './directory-detail.page.html',
  styleUrls: ['./directory-detail.page.scss'],
})
export class DirectoryDetailPage implements OnInit {

  //Declaracion de variables
  area = null;
  users: any;
  userInfo: any;
  authorities: any;
  showButton: boolean=false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public modalController: ModalController,
    private api: RestApiService
  ) { }

  ngOnInit() {
    this.area = this.activatedRoute.snapshot.paramMap.get('name');
  }

  ionViewWillEnter() {
    this.getUsers(this.area);
    this.getUserInfo();
   }


   //Funcion para presentar el modal para agregar un usuario
  async showAddEmployeeModal(){
    const modal = await this.modalController.create({
      component: AddEmployeePage,
      componentProps: { value: this.area }
      });
      modal.onDidDismiss()
      .then((data) => {
        console.log(data);
        if(data.data == "created"){
          console.log("Actulizacion");
          this.getUsers(this.area);
        }else{
          console.log("Sin actualizacion");
        }
    });
      return await modal.present();
  }

  //Función para presentar modal para editar algun usuaio
  async showEditEmployeeModal(user,role){
    const modal = await this.modalController.create({
      component: EditEmployeePage,
      componentProps: { value: user,role:role }
      });
      modal.onDidDismiss()
      .then((data) => {
        if(data.data == "edited"){
          console.log("Actulizacion");
          this.getUsers(this.area);
        }else{
          console.log("Sin actualizacion");
        }
    });
      return await modal.present();
  }

  //Función para presentar alerta con botones y eliminar usuario
  async showDeleteAlert(user,id) {
    const alert = await this.alertController.create({
      header: '¿Desea eliminar este usuario?',
      message: user,
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
            console.log('Confirm Okay');
            this.deleteUser(id);
          }
        }
      ]
    });

    await alert.present();
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
           this.showButton = true;
         }else{
           
         }
       }
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }


  //Llamada a servicio Rest para obtener los usuarios registrados en una área en específico
  async getUsers(name) {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.getUsersByArea(name)
      .subscribe(res => {
        this.users = res;
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }

  //Llamada a servicio Rest para eliminar un área seleccionada
  async deleteUser(id) {
    await this.api.deleteUser(id)
      .subscribe(res => {
        this.getUsers(this.area);
      }, (err) => {
        this.presentAlert("Error","Ocurrió un error mientras se eliminaba este usuario, por favor intente más tarde.");
        console.log(err);
      });
  }

}
