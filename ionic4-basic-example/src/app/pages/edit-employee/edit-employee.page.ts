import { Component, OnInit } from '@angular/core';
import { ModalController,NavParams } from '@ionic/angular';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '../../rest-api.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.page.html',
  styleUrls: ['./edit-employee.page.scss'],
})
export class EditEmployeePage implements OnInit {

  //Declaracion de variables
  editUserForm: FormGroup;  
  userInfo;
  userRole;
  userRoleName: any;
  adminRoleName: any;
  superAdminName: any;
  areas: any;
  areaUser: string;
  roleUser: any;
  isenabled:boolean=false;
  showButton: boolean=false;
  userRoles = [];  
  rolesUser = [];
  userData = { id:'', name:'', email: '', job: '', skills: '', area: '', phone:'', authorities: []};
  roles = [{"value": "ROLE_USER","name": "Usuario"},{"value": "ROLE_ADMIN", "name": "Administrador"},{"value": "ROLE_SYSADMIN", "name": "Super Administrador"}];
  
  constructor(public modalController: ModalController,
              public navParams: NavParams,
              private loadingController: LoadingController,
              private formBuilder: FormBuilder,
              private api: RestApiService) { 
                this.userInfo = this.navParams.get('value');
                this.userRole = this.navParams.get('role');
                this.areaUser = this.userInfo.area.name;
                this.roleUser = this.userInfo.authorities.role;
                this.userData.id = this.userInfo.id;
                this.userData.name = this.userInfo.name;
                this.userData.email = this.userInfo.email;
                this.userData.job = this.userInfo.job;
                this.userData.skills = this.userInfo.skills;
                this.userData.area = this.userInfo.area.name;
                this.userData.phone = this.userInfo.phone;

                this.editUserForm = this.formBuilder.group({
                  editName: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editEmail: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editPhone: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editJob: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editSkills: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editArea: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  editRole: new FormControl('', Validators.compose([
                    Validators.required
                  ]))
                });

                for (let index = 0; index < this.userInfo.authorities.length; index++) {
                  this.userRoles.push(this.userInfo.authorities[index].role);
                  this.userData.authorities = this.userRoles;
                  for(let i=0; i < this.userRoles.length; i++){
                    if(this.userRoles[i] == 'ROLE_SYSADMIN'){
                      this.superAdminName = "Super Administrador";
                      this.rolesUser.push(this.superAdminName);
                    }if(this.userRoles[i] == 'ROLE_ADMIN'){
                      this.adminRoleName = "Administrador";
                      this.rolesUser.push(this.adminRoleName);
                    }if(this.userRoles[i] == 'ROLE_USER'){
                      this.userRoleName = "Usuario";
                      this.rolesUser.push(this.userRoleName);
                    }
                  }
                  if(this.userInfo.authorities[index].role == "ROLE_ADMIN" || this.userInfo.authorities[index].role == "ROLE_SYSADMIN"){
                    this.showButton = true;
                  }else{
                    
                  }
                }

              }

  ngOnInit() {
  }

  //Función para cargar las areas registradas
  ionViewWillEnter() {
    this.getAreas();
   }

  //Función para ocultar modal
  dismissModal(data){
    this.modalController.dismiss(data);
  }

  //Función para detectar un cambio en el nombre del usuario
  onChangeName(data) : void {
    this.userData.name = data;        
  }

  //Función para detectar un cambio en el email del usuario
  onChangeEmail(data) : void {
    this.userData.email = data;        
  }

    //Función para detectar un cambio en el teléfono del usuario
  onChangePhone(data) : void {
    this.userData.phone = data;        
  }

  //Función para detectar un cambio en el empleo del usuario
  onChangeJob(data) : void {
    this.userData.job = data;        
  }

  //Función para detectar un cambio en las habilidades del usuario
  onChangeSkills(data) : void {
    this.userData.skills = data;        
  }

  //Función para detectar un cambio en el área del usuario
  onSelectChangeArea(data) : void {
    this.userData.area = data.detail.value;        
  }

  //Función para detectar un cambio en el role del usuario
  onSelectChangeAuthorities(data) : void {
    this.userData.authorities = data.detail.value;        
  }

  //Función para activar boton de editar
  activateEditButton(){
    this.isenabled = true;
  }

  //Función para editar un usuario registrado
  updateUser(){
    console.log(this.userData);
    this.editUser();
  }

  //Llamada a servicio Rest para obtener todas las areas registradas
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

     //Llamada a servicio Rest para editar un usuario
     async editUser() {
      const loading = await this.loadingController.create({
        message: 'Espere un momento. . .',
        duration: 5000
      });
      await loading.present();
      await this.api.editUser(this.userData)
        .subscribe(res => {
          loading.dismiss();
          this.dismissModal("edited");
        }, (err) => {
          console.log(err);
          loading.dismiss();
        });
    }
  

}
