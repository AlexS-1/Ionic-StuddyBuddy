import { Component, OnInit } from "@angular/core";
import { Course } from "src/app/models/course";
import { DbSqliteService } from "src/app/services/db-sqlite.service";
//import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  
  courses: Course[] = [];
  //animals?: Observable<Animal[]>;

  constructor(
    private dbSQL: DbSqliteService,
  ) {

  }
  ngOnInit(): void {
    this.dbSQL.syncSQLDatabase();
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
    this.dbSQL.fetchCourses().subscribe(courses => this.courses = courses);
    console.log(this.courses);
  }

}

