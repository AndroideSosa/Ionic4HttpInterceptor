import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators} from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from '.././../rest-api.service';

@Component({
  selector: 'app-add-area',
  templateUrl: './add-area.page.html',
  styleUrls: ['./add-area.page.scss'],
})
export class AddAreaPage implements OnInit {
  
  //Declaración de variables
  addAreaForm: FormGroup;
  areaData = { name:'', description:''};


  constructor(public modalController: ModalController,
              private router: Router,
              private api: RestApiService,
              private loadingController: LoadingController,
              private formBuilder: FormBuilder) { 
                this.addAreaForm = this.formBuilder.group({
                  name: new FormControl('', Validators.compose([
                    Validators.required
                  ])),
                  description: new FormControl('', Validators.compose([
                    Validators.required
                  ]))
                  });
              }

  ngOnInit() {
  }

  //Función para ocultar modal
  dismissModal(data){
    this.modalController.dismiss(data);
  }

  //Función para crear una nueva área
  createArea(){
    this.areaData.name = this.addAreaForm.value.name;
    this.areaData.description = this.addAreaForm.value.description;
    console.log(this.areaData);
    this.postArea();
  }

  //Llamada a servicio Rest para registrar una nueva área
  async postArea() {
    const loading = await this.loadingController.create({
      message: 'Espere un momento. . .',
      duration: 5000
    });
    await loading.present();
    await this.api.postNewArea(this.areaData)
      .subscribe(res => {
        loading.dismiss();
        this.dismissModal("created");
      }, (err) => {
        console.log(err);
        loading.dismiss();
      });
  }



}
