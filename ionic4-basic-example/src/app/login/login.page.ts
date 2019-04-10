import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { MenuController, LoadingController, AlertController } from '@ionic/angular';
import { RestApiService } from '../rest-api.service';
import { GlobalService } from './../global.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  //Declaración de variables
  loginForm: FormGroup;
  token: any;
  response: any;
  passwordShown: boolean = false;
  public type = 'password';
  public showPass = false;
  userLogin = { username:'', password:''};

  //Declaración de los tipos de errores 
  error_messages = {
    'username': [
      {type: 'required', message: 'Correo electrónico es un campo obligatorio.'},
      {type: 'pattern', message: 'Ingrese un correo electrónico válido'}
    ],
    'password': [
      {type: 'required', message: 'Contraseña es un campo obligatorio.'}
    ]
  }

  constructor(private menu: MenuController,
              private api: RestApiService,
              private router: Router, 
              private alertController: AlertController,
              private loadingController: LoadingController,
              private formBuilder: FormBuilder,
              public global: GlobalService) { 

                this.loginForm = this.formBuilder.group({
                username: new FormControl('', Validators.compose([
                  Validators.required,
                  Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$')
                ])),
                password: new FormControl('', Validators.compose([
                  Validators.required
                ]))
                });
              }

  ngOnInit() {

  }

  //Función para ocultar el menú lateral a la hora de ver la PWA's en un navegdor web
  ionViewWillEnter() {
    this.menu.enable(false);
    this.loginForm.reset();
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

  //Función para mostrar/ocultar contraseña
  showPassword() {
    this.showPass = !this.showPass;
    if(this.showPass){
      this.type = 'text';
    } else {
      this.type = 'password';
    }
  }

   //Función para autenticarse
   signIn(){
    this.userLogin.username = this.loginForm.value.username;
    this.userLogin.password = this.loginForm.value.password;
    this.userAuthenticate(this.userLogin);
  }

  //Llamada al servicio de autenticación
  async userAuthenticate(data) {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.authenticateUser(data)
      .subscribe(res => {
        this.token = res.id_token;
        //Se almacena el token recibido en variable de sesion
        this.global.myGlobalVar=this.token;
        loading.dismiss();
        //Se llama a la función para ir al home de la aplicación
        this.goAppHome();
      }, (err) => {
        loading.dismiss();
        this.presentAlert("Datos incorrectos","Verifique su información y vuelva a intentarlo.");
      });
  }

  //Función para navegar al home de la aplicación
  goAppHome(){
    this.router.navigate(['/home']);
  }
}
