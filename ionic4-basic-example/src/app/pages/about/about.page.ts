import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './../../global.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  constructor(private router: Router,
              public global: GlobalService) { }

  ngOnInit() {
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
