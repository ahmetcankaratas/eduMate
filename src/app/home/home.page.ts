import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AlertController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  items: Observable<any[]>;
  gun: string;

  constructor(
    public firestore: AngularFirestore,
    public alertController: AlertController,
    public toastController: ToastController
  ) {
    //this.items = firestore.collection('EtkinlikListesi', sira => sira.orderBy('tarih','desc')).snapshotChanges();
    //console.log(this.items);
    //Uygulama açıldığında otomatik bugünün tarihi gelsin,
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    this.gun = dd + '-' + mm + '-' + yyyy;
    //Bugünün Etkinliklerini getirelim
    let gunler = [];
    gunler.push(this.convertDB(this.convertString(this.gun, 0)));
    //console.log(gunler)
    //Database
    this.items = this.firestore
      .collection('EtkinlikListesi', (ref) => ref.where('tarih', 'in', gunler))
      .snapshotChanges();
  }

  //Gün-Ay-Yıl sıralaması için fonksiyon
  toDate(dateStr) {
    var parts = dateStr.split('-');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  //Sonraki Gün fonksiyonu
  sonrakiGun(gun) {
    //Gun Ekle
    var date = this.toDate(gun);
    date.setDate(date.getDate() + 1);
    //console.log(date)
    //DB'ye kaydetmek için uygun format çevirimi
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    this.gun = dd + '-' + mm + '-' + yyyy;

    // Tek bir tarih için sorgu döndürme -> referans
    // let parts = this.gun.split("-")
    //let date2 = parts[2] + "-" + parts[1] +"-"+parts[0];
    //console.log(date2)
    //this.items = this.firestore.collection('EtkinlikListesi', ref => ref.where('tarih',"==",date2)).snapshotChanges();
    //return date;

    let gunler = [];
    gunler.push(this.convertDB(this.convertString(this.gun, 0)));
    //console.log(gunler)
    //Database
    this.items = this.firestore
      .collection('EtkinlikListesi', (ref) => ref.where('tarih', 'in', gunler))
      .snapshotChanges();
  }

  oncekiGun(gun) {
    //Gun Çıkar
    var date = this.toDate(gun);
    date.setDate(date.getDate() - 1);
    //console.log(date)
    //Önceki günü önyüzde göster
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0');
    var yyyy = date.getFullYear();
    this.gun = dd + '-' + mm + '-' + yyyy;

    //Eski Tekrarlar için DB'de filtre ekleyelim
    let gunler = [];
    gunler.push(this.convertDB(this.convertString(this.gun, 0)));
    //console.log(gunler)
    //Database
    this.items = this.firestore
      .collection('EtkinlikListesi', (ref) => ref.where('tarih', 'in', gunler))
      .snapshotChanges();
  }

  //DB veri çağırımı için uygun format
  convertDB(val) {
    let parts = val.split('-');
    return parts[2] + '-' + parts[1] + '-' + parts[0];
  }

  //Tarihi Metne çevirelim
  convertString(dt, cal) {
    var date = this.toDate(dt);
    date.setDate(date.getDate() - cal);
    console.log(date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
  }

  async presentAlertPrompt() {
    const alert = await this.alertController.create({
      header: 'Etkinlik ekle',
      inputs: [
        {
          name: 'konu',
          type: 'text',
          value: '',
          placeholder: 'Konuyu Giriniz',
        },
        {
          name: 'tarih',
          type: 'date',
          value: '',
          placeholder: 'Tarihi Seçiniz',
        },
        {
          name: 'saat',
          type: 'text',
          value: '',
          placeholder: 'Saati Giriniz',
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Ekle',
          handler: (sonuc) => {
            let kayit = {
              konu: sonuc.konu,
              tarih: sonuc.tarih,
              saat: sonuc.saat,
            };

            this.firestore.collection('EtkinlikListesi').add(kayit);
            this.presentToast('Etkinlik Eklendi !');
          },
        },
      ],
    });

    await alert.present();
  }

  async duzenle(itemId, item) {
    const alert = await this.alertController.create({
      header: 'Etkinlik Düzenle',
      inputs: [
        {
          name: 'konu',
          type: 'text',
          value: item.konu,
          placeholder: 'Etkinlik Giriniz',
        },
        {
          name: 'tarih',
          type: 'date',
          value: item.tarih,
          placeholder: 'Tarih Giriniz',
        },
        {
          name: 'saat',
          type: 'text',
          value: item.saat,
          placeholder: 'Saat Giriniz',
        },
      ],
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          },
        },
        {
          text: 'Düzenle',
          handler: (sonuc) => {
            let kayit = {
              konu: sonuc.konu,
              tarih: sonuc.tarih,
              saat: sonuc.saat,
            };

            if (
              sonuc.konu !== '' &&
              sonuc.tarih !== '' &&
              sonuc.saat !== '' &&
              (sonuc.konu !== item.konu ||
                sonuc.tarih !== item.tarih ||
                sonuc.saat !== item.saat)
            ) {
              this.firestore.doc('EtkinlikListesi/' + itemId).update(kayit);
              this.presentToast('Etkinlik Güncellendi !');
            } else {
              console.log('değişiklik yok');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlertConfirm(id) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Etkinlik Sil',
      message: 'Bu etkinliği silmek istiyor musunuz?',
      buttons: [
        {
          text: 'Vazgeç',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Sil',
          handler: () => {
            this.firestore.doc('EtkinlikListesi/' + id).delete();
            this.presentToast('Etkinlik Silindi !');
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(mesaj) {
    const toast = await this.toastController.create({
      message: mesaj,
      color: 'light',
      position: 'bottom',
      duration: 2000,
    });
    toast.present();
  }
}
