import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from './../../global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  images =[
    {"img": "assets/imgs/infotec1.jpg", "title":"INFOTEC", "description": "Bienvenido a nuestra aplicación PWA's para empleados."},
    {"img": "assets/imgs/infotec2.jpg", "title":"Instalaciones", "description": "Nuestras instalaciones son de las mejores de todo México."},
    {"img": "assets/imgs/infotec3.jpg", "title":"Aguascalientes", "description": "También contamos con instalaciones en Aguascalientes."},
    {"img": "assets/imgs/infotec4.jpg", "title":"CONACYT", "description": "Somos parte del Consejo Nacional de Ciencia y Tecnología."},
    {"img": "assets/imgs/infotec5.jpg", "title":"Página web", "description": "Visita nuestra página web: https://www.infotec.mx/es_mx/infotec/home"}
  ]

  constructor(private menu: MenuController,
              private router: Router,
              public global: GlobalService) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.menu.enable(true);
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


}
