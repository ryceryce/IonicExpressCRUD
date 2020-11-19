import { AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items',
  templateUrl: './items.page.html',
  styleUrls: ['./items.page.scss'],
})
export class ItemsPage implements OnInit {

url : string = "http://127.0.0.1:3000";  
items: Observable<any>;
data = {
  item : '',
  amount : ''
}

  constructor(
    private httpClient: HttpClient, 
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
          placeholder: '0',
          min: 0
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
            let item = newData.item.toLowerCase().trim();
            let amount = newData.amount.trim();

            if (item == null || item == '') {
              this.presentToast("Product name cannot be empty");
              return false;
            } else if(amount == null || amount == '' || amount < 0) {
              this.presentToast("Amount cannot be empty");
              return false;
            }
            else {
              console.log("data : '"+ item + "' " + amount);
              this.doAdd(item, amount);
              this.retrieve();
              return true;
            }
          }
        }
      ]
    });

    await alert.present();
  }

  //Edit Pop up
  async alertUpdate(item) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Edit Data',
      inputs: [
        {
          name: 'item',
          value: item.item,
          disabled: true
        },
        {
          name: 'amount',
          type: 'number',
          value: item.amount,
          min: 0
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
          handler: (editData) => {
            let name = editData.item;
            let amount = editData.amount.trim();
            let id = item.id;

            if (amount == null || amount == '' || amount < 0) {
              this.presentToast("Amount cannot be empty");
              return false;
            } else {
            this.doUpdate(id, name, amount);
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
  doAdd(item, amount) {
    let url = this.url + "/new";
    let productName = item.charAt(0).toUpperCase() + item.slice(1);
    this.data.item = item;
    this.data.amount = amount;

    this.httpClient.post(url, this.data).subscribe((res) => {
      this.retrieve();
      this.presentToast(productName + " successful added");
    },(err) => {
      console.log(err);
    });
  };

  //Edit Item
  doUpdate(id, name, amount) {
    let url = this.url + "/items/" + id;
    let productName = name.charAt(0).toUpperCase() + name.slice(1);
    this.data.item = name;
    this.data.amount = amount;

    this.httpClient.put(url, this.data).subscribe((res) => {
      this.retrieve();
      this.presentToast(productName + " successful changed");
    },(err) => {
      console.log(err);
    });
  };

  //Delete Item
  doDelete(item) {
    let id = item.id;
    let url = this.url + "/items/" + id;
    let itemName = item.item.charAt(0).toUpperCase() + item.item.slice(1);

    this.httpClient.delete(url).subscribe((res) => {
      this.retrieve();
      this.presentToast(itemName + " removed");
    },(err) => {
      console.log(err); 
    });
  };
}
