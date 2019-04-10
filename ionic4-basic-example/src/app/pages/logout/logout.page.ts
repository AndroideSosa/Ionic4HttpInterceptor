import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.goAppLogin();
    console.log("Se cierra sesion");
   }

   //Función para cerrar sesión y borrar token de usuario en sesión
  goAppLogin(){
    this.router.navigate(['/login']);
  }

}
