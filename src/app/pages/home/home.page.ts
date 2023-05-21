import { Component, OnInit } from "@angular/core";

import { Animal } from "../../models/animal.model";
import { AnimalService } from "../../services/animal.service";
import { DatabaseService } from "./../../services/database.service";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { Course } from "src/app/models/course";
//import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  
  courses: Course[] = [];
  course: Course;
  //animals?: Observable<Animal[]>;

  constructor(
    private db: DatabaseService,
    private dbFS: DbFirebaseService,
    private animalService: AnimalService,
  ) {

  }
  ngOnInit(): void {
    this.getCourses();
  }

  ionViewDidEnter() {
    this.getCourses();
    /* this.db.getDatabaseState().subscribe( (dbReady) => {

      if (dbReady) {
        //this.animals = this.animalService.getFavorites();
        this.getAnimals();
        this.title = 'Favorites';
      }
    }); */
  }

  async getCourses() {
    this.courses = await this.dbFS.getAllCourses();
  }

}

