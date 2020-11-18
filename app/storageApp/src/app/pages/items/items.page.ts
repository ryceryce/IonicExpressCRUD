import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

url : string = "http://127.0.0.1:3000";  
items: Observable<any>;
//items: any;

  constructor(
    private httpClient: HttpClient, 
    private route: Router, 
    private alertController: AlertController,
    private toastController: ToastController) { 
  }

  ngOnInit() {
    this.retrieve();
    };
  
  retrieve() {
    this.items = this.httpClient.get(this.url + "/items");
  }  

  //Add New Pop Up
  async alertNew() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Add New Data',
      inputs: [
        {
          name: 'item',
          type: 'text',
          placeholder: 'Product Name'
        },
        {
          name: 'amount',
          type: 'number',
          placeholder: '0'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log("cancel");
          }
        }, {
          text: 'Ok',
          handler: (newData) => {
            if (newData.item == null || newData.item == '') {
              this.presentToast("Product name cannot be empty");
              return false;
            } else if(newData.amount == null || newData.item == 0 || newData.amount == '') {
              this.presentToast("Amount cannot be empty");
              return false;
            }
            else {
              this.doAdd(newData);
              this.retrieve();
              return true;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //Toast Message
  async presentToast(data) {
    const toast = await this.toastController.create({
      message: data,
      duration: 2000
    });
    toast.present();
  }

  //Add New Item
  doAdd(product) {
    let url = this.url + "/new";
    let productName = product.item.charAt(0).toUpperCase() + product.item.slice(1);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.httpClient.post(url, product).subscribe((res) => {
      this.retrieve();
      this.presentToast(productName + " success added");
    },(err) => {
      console.log(err);
    });
    console.log(product);
  };

  //Edit Item
  doUpdate(item) {

  };

  //Delete Item
  doDelete(item) {
    let id = item.id;
    let url = this.url + "/items/" + id;
    let itemName = item.item.charAt(0).toUpperCase() + item.item.slice(1);

    this.httpClient.delete(url).subscribe((res) => {
      this.retrieve();
      this.presentToast(itemName + " removed");
      console.log(res);
    },(err) => {
      console.log(err); 
    });
  };
}
