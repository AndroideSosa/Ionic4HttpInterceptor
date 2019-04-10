import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { GlobalService } from './../../global.service';
import { RestApiService } from '../../rest-api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  //Declaracion de variables
  areas: any;
  userRole: any;
  adminRole: any;
  superAdmin: any;
  userInfo;
  editProfileForm: FormGroup; 
  isenabled:boolean=false;
  userData = { id:'', name:'', email: '', job: '', skills: '', area: '', phone:'', authorities: []}; 
  roles = [{"name": "ROLE_USER"},{"name": "ROLE_ADMIN"},{"name": "ROLE_SYSADMIN"}];
  userRoles = []; 
  rolesUser = []; 

  constructor(public global: GlobalService,
              private loadingController: LoadingController,
              private router: Router,
              private formBuilder: FormBuilder,
              private api: RestApiService) { 
                this.editProfileForm = this.formBuilder.group({
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
              }

  ngOnInit() {
  }

  //Función para obtener la información del usuario en sesión
  ionViewWillEnter() {
    this.getUserInfo();
    this.isenabled = false;
    this.userRoles = [];
    this.rolesUser = []; 
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

  //Función para activar boton de editar
  activateEditButton(){
    this.isenabled = true;
  }

  //Función para detectar un cambio en el área del usuario
  onSelectChangeArea(data) : void {
    this.userData.area = data.detail.value;        
  }

    //Función para detectar un cambio en el role del usuario
    onSelectChangeAuthorities(data) : void {
      this.userData.authorities = data.detail.value;        
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
      message: 'wait. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.getUserInfo()
      .subscribe(res => {
        this.userInfo = res;
        this.userData.id = this.userInfo.id;
        this.userData.name = this.userInfo.name;
        this.userData.email = this.userInfo.email;
        this.userData.phone = this.userInfo.phone;
        this.userData.job = this.userInfo.job;
        this.userData.skills = this.userInfo.skills;
        this.userData.area = this.userInfo.area.name;
        for (let index = 0; index < this.userInfo.authorities.length; index++) {
          this.userRoles.push(this.userInfo.authorities[index].role);
          this.userData.authorities = this.userRoles;
          for(let i=0; i < this.userRoles.length; i++){
            if(this.userRoles[i] == 'ROLE_SYSADMIN'){
              this.superAdmin = "Super Administrador";
              this.rolesUser.push(this.superAdmin);
            }if(this.userRoles[i] == 'ROLE_ADMIN'){
              this.adminRole = "Administrador";
              this.rolesUser.push(this.adminRole);
            }if(this.userRoles[i] == 'ROLE_USER'){
              this.userRole = "Usuario";
              this.rolesUser.push(this.userRole);
            }
          }
        }
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }

}
