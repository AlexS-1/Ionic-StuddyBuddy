import { DatabaseService, Dev, Product } from './../../services/database.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
//import { Observable } from 'rxjs';

@Component({
  selector: 'app-developers',
  templateUrl: './developers.page.html',
  styleUrls: ['./developers.page.scss'],
})
export class DevelopersPage implements OnInit {


  //developers?: Observable<Dev[]>;
  //products?: Observable<Product[]>;
  products: Product[] = [];
  developers: Dev[] = [];

  // developer?: Dev  = null;
  // product?: Product = null;

  developer: Dev  = {
    id: 0,
    name: '',
    //skills: [],
    skills: '',
    img: ''
  };

  product: Product = {
    id: 0,
    name: '',
    creator: 0,
  };

  selectedView = 'devs';
  devSkills = '';

  constructor(
    private db: DatabaseService,
    private toast: ToastController
  ) { }

  ngOnInit() {
    this.getDevelopers();
    this.getProducts();
  }

  // ngOnInit() {
  //   this.db.getDatabaseState().subscribe(dbReady => {
  //     if (dbReady) {

  //       this.getDevelopers();
  //       this.getProducts();

  //       // this.developers = this.db.getDevs();
  //       // this.products = this.db.getProducts();

  //       /* this.db.getDevs().subscribe(devs => {
  //         this.developers = devs;
  //       })
        
  //       //this.products = this.db.getProducts();
  //       this.db.getProducts().subscribe(products => {
  //         this.products = products;
  //       }) */
  //     }
  //   });
  // }

  getDevelopers() {
    this.db.getDevs().subscribe(devs => {
      this.developers = devs;
    })
  }

  getProducts() {
    this.db.getProducts().subscribe(products => {
      this.products = products;
    })
  }

  /* getDevSkills(dev: Dev): string {
    return JSON.stringify(dev.skills);
  } */

  addDeveloper() {
    if(!this.developer) return;

    /* //let skills = this.developer['skills'].split(',');
    //let skills = this.developer.skills.split(',');
    let skills = this.devSkills.split(',');
    skills = skills.map(skill => skill.trim());

    this.db.addDeveloper(this.developer.name, skills, this.developer.img).then(_ => {
      this.developer = null;
    }); */

    /* this.db.addDeveloper(this.developer['name'], skills, this.developer['img'])
    .then(_ => {
      this.developer = null;
    }); */

    this.db.addDeveloper(
      this.developer.name, this.developer.skills, this.developer.img
    ).then( (_) => {
      this.developer = null;
      //this.getDevelopers();

      /*let toast = await this.toast.create({
        message: 'Developer created',
        duration: 3000
      });
      toast.present(); */
    });
  }

  addProduct() {
    if(!this.product) return;

    /* this.db.addProduct(this.product['name'], this.product['creator'])
    .then(_ => {
      this.product = null;
    }); */

    this.db.addProduct(this.product.name, this.product.creator).then( (_) => {
      this.product = null;
      //this.getProducts();

      /* let toast = await this.toast.create({
        message: 'Product created',
        duration: 3000
      });
      toast.present(); */
      
    });
  }

}
