import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams, LoadingController } from '@ionic/angular';
import { RestApiService } from '.././../rest-api.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.page.html',
  styleUrls: ['./edit-area.page.scss'],
})
export class EditAreaPage implements OnInit {

  //Declaracion de variables
  isenabled:boolean=false;
  areaInfo;
  roleUser;
  editAreaData = { id:'', name:'', description: '', logo: null};

  constructor(public modalController: ModalController,
              private loadingController: LoadingController,
              private navParams: NavParams,
              private api: RestApiService) {
                
                this.areaInfo = this.navParams.get('value');
                this.roleUser = this.navParams.get('role');
                this.editAreaData.id = this.areaInfo.id;
                this.editAreaData.name = this.areaInfo.name;
                this.editAreaData.description = this.areaInfo.description;

                console.log(this.editAreaData);
                console.log(this.roleUser);
              }

  ngOnInit() {
  }

  //Función para detectar un cambio en el nombre del area
  onChangeName(data) : void {
    this.editAreaData.name = data;        
  }

  //Función para detectar un cambio en la descripción del area
  onChangeDescription(data) : void {
    this.isenabled = !this.isenabled;      
    this.editAreaData.description = data;
    this.updateArea(); 
  }

  //Función para ocultar modal
  dismissModal(data){
    this.modalController.dismiss(data);
  }

  //Función para activar boton de editar
  activateEditButton(){
    this.isenabled = true;
  }

  //Función para crear una nueva área
  updateArea(){
    console.log(this.editAreaData);
    this.editArea();
  }

    //Llamada a servicio Rest para registrar una nueva área
    async editArea() {
      const loading = await this.loadingController.create({
        message: 'Espere un momento. . .',
        duration: 5000
      });
      await loading.present();
      await this.api.editArea(this.editAreaData)
        .subscribe(res => {
          console.log(res);
          loading.dismiss();
          this.dismissModal("edited");
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
    }
  


}
