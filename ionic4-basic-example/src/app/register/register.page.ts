import { Component, OnInit } from '@angular/core';
import { MenuController,LoadingController,AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RestApiService } from '../rest-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
   
  //Declaración de variables
  registerForm: FormGroup;
  areas: any;
  userData = { name:'', password: '', email: '', job: '', skills: '', area: '', phone:'', authorities: ["ROLE_USER"]};
  public type = 'password';
  public showPass = false;

  //Declaración de los tipos de errores 
  error_messages = {
    'name': [
      {type: 'required', message: 'Nombre es un campo obligatorio.'}
    ],
    'phone': [
      {type: 'required', message: 'Extensión de teléfono es un campo obligatorio.'},
      {type: 'minlength', message: 'La longitud de la extensión de teléfono debe ser igual a 4 números.'},
      {type: 'maxlength', message: 'La longitud de la extensión de teléfono debe ser igual a 4 números.'},
      {type: 'pattern', message: 'No se permiten caracteres, solo números.'}
    ],
    'job': [
      {type: 'required', message: 'Empleo es un campo obligatorio.'}
    ],
    'skills': [
      {type: 'required', message: 'Habilidades es un campo obligatorio.'}
    ],
    'area': [
      {type: 'required', message: 'Area es un campo obligatorio.'}
    ],
    'email': [
      {type: 'required', message: 'Correo electrónico es un campo obligatorio.'},
      {type: 'pattern', message: 'Ingrese un coreo electrónico válido.'}
    ],
    'password': [
      {type: 'required', message: 'Contraseña es un campo obligatorio.'}
    ]
  }

  constructor(private menu: MenuController,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private formBuilder: FormBuilder,
              private router: Router,
              private api: RestApiService) {
                this.registerForm = this.formBuilder.group({
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
                  area: new FormControl('', Validators.compose([
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

  //Función para crear un nuevo registr0
  signUpUser(){
    this.userData.name = this.registerForm.value.name;
    this.userData.phone = this.registerForm.value.phone;
    this.userData.job = this.registerForm.value.job;
    this.userData.skills = this.registerForm.value.skills;
    this.userData.area = this.registerForm.value.area;
    this.userData.email = this.registerForm.value.email;
    this.userData.password = this.registerForm.value.password;
    this.postUser();
  }

  //Función de inicio para ocultar menú en PWA's y para obtener las areas registradas
  ionViewWillEnter() {
    this.menu.enable(false);
    this.registerForm.reset();
    this.getAreas();
   }

    //Función para mostrar/ocultar contraseña
  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

   //Función para presentar alerta y redirigir al login
   async showSuccesAlert() {
    const alert = await this.alertController.create({
      header: 'Éxito',
      message: 'Su cuenta se ha creado correctamente.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.goAppLogin();
          }
        }
      ]
    });
    await alert.present();
  }
  
   //Llamada a servicios Rest para obtener las areas registradas
  async getAreas() {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
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
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.postNewUser(this.userData)
      .subscribe(res => {
        loading.dismiss();
        this.showSuccesAlert();
      }, (err) => {
        loading.dismiss();
        console.log(err);
      });
  }

   //Función para navegar al home de la aplicación
   goAppLogin(){
    this.router.navigate(['/login']);
  }

}
