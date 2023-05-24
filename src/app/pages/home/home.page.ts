import { Component, OnInit } from "@angular/core";
import { Course } from "src/app/models/course";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
//import { DbSqliteService } from "src/app/services/db-sqlite.service";
//import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  
  courses: Course[] = [];
  //animals?: Observable<Animal[]>;

  constructor(private dbFS: DbFirebaseService) {

  }
  
  ngOnInit() {
    this.getCourses();
  }

  ionViewDidEnter() {
    this.getCourses();
  }

  async getCourses() {
    this.courses = await this.dbFS.getAllCourses();
  }

}

