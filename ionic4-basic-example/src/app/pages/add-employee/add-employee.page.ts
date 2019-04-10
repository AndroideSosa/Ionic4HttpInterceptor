import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ModalController, LoadingController,NavParams } from '@ionic/angular';
import { RestApiService } from '../../rest-api.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.page.html',
  styleUrls: ['./add-employee.page.scss'],
})
export class AddEmployeePage implements OnInit {

   //Declaración de variables
   addUserForm: FormGroup;
   areaName;
   areas: any;
   userData = { name:'', password: '', email: '', job: '', skills: '', area: '', phone:'', authorities: []};
   roles = [{"value": "ROLE_USER","name": "Usuario"},{"value": "ROLE_ADMIN", "name": "Administrador"},{"value": "ROLE_SYSADMIN", "name": "Super Administrador"}];

   //Declaración de los tipos de errores 
  error_messages = {
    'name': [
      {type: 'required', message: 'Name is required'}
    ],
    'phone': [
      {type: 'required', message: 'Phone is required'},
      {type: 'minlength', message: 'Phone length must be equal than 4 characters.'},
      {type: 'maxlength', message: 'Phone length must be equal than 4 characters.'},
      {type: 'pattern', message: 'No characters are allowed, only numbers.'}
    ],
    'job': [
      {type: 'required', message: 'Job is required'}
    ],
    'skills': [
      {type: 'required', message: 'Skills is required'}
    ],
    'role': [
      {type: 'required', message: 'Area is required'}
    ],
    'email': [
      {type: 'required', message: 'Email is required.'},
      {type: 'pattern', message: 'Please enter a valid email.'}
    ],
    'password': [
      {type: 'required', message: 'Password is required.'}
    ]
  }

  constructor(public modalController: ModalController,
              private formBuilder: FormBuilder,
              private loadingController: LoadingController,
              private navParams: NavParams,
              private api: RestApiService) { 
                this.areaName = this.navParams.get('value');
                console.log(this.areaName);
                this.addUserForm = this.formBuilder.group({
                  name: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  phone: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.minLength(4),
                    Validators.maxLength(4),
                    Validators.pattern('^(0|[1-9][0-9]*)$')
                  ])),
                  job: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  skills: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  role: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  email: new FormControl('', Validators.compose([
                    Validators.required,
                    Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
                  ])),
                  password: new FormControl('', Validators.compose([
                    Validators.required
                  ]))
                })
              }

  ngOnInit() {
  }

  //Función para cargar y refrescar las areas registradas
  ionViewWillEnter() {
    this.getAreas();
   }

   //Función para crear un nuevo usuario
   createUser(){
    this.userData.name = this.addUserForm.value.name;
    this.userData.phone = this.addUserForm.value.phone;
    this.userData.job = this.addUserForm.value.job;
    this.userData.skills = this.addUserForm.value.skills;
    this.userData.area = this.areaName;
    this.userData.authorities = this.addUserForm.value.role;
    this.userData.email = this.addUserForm.value.email;
    this.userData.password = this.addUserForm.value.password;
    console.log(this.userData);
    this.postUser();
   }

  //Función para ocultar modal
  dismissModal(data){
    this.modalController.dismiss(data);
  }

  //Llamada a servicios Rest para obtener las areas registradas
  async getAreas() {
    const loading = await this.loadingController.create({
      message: 'wait. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.getInitialAreas()
      .subscribe(res => {
        this.areas = res;
        loading.dismiss();
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }

    //Llamada a servicio Rest para registrar un nuevo usuario
    async postUser() {
      const loading = await this.loadingController.create({
        message: 'wait. . .',
        duration: 5000
      });
      await loading.present();
      await this.api.postAdminNewUser(this.userData)
        .subscribe(res => {
          loading.dismiss();
          this.dismissModal("created");
          console.log(res);
        }, (err) => {
          loading.dismiss();
          loading.dismiss();
          console.log(err);
        });
    }
  

}
