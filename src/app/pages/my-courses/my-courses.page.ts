import { Component, OnInit } from "@angular/core";
import { Animal } from "../../models/animal.model";
import { AnimalService } from "../../services/animal.service";
import { DatabaseService } from "../../services/database.service";
import { Course } from "src/app/models/course";
import { DbFirebaseService } from "src/app/services/db-firebase.service";

@Component({
  selector: "app-my-courses-list",
  templateUrl: "./my-courses.page.html",
  styleUrls: ["./my-courses.page.scss"],
})
export class MyCoursesPage implements OnInit {
  courses: Course[] = [];
  
  //animals: Animal[] = [];
  //private animals$: Observable<Animal[]>;

  constructor(
    //private db: DatabaseService,
    //private animalService: AnimalService,
    private dbFS: DbFirebaseService,
  ) {}

  /* ngOnInit(): void {
    this.getAnimals();
    //this.animals$ = this.animalService.getAllAnimals();
  } */

  ngOnInit() {    
    /* this.db.getDatabaseState().subscribe((dbReady) => {
      if (dbReady) {
        this.getAnimals();
      }
    }); */

    //this.getAnimals();
  }

  /*getAnimals(): void {
    this.animalService.getAllAnimals().subscribe((animals) => {
      this.animals = animals;
    });
  }

  toggleFavorite(animal: Animal): void {
    animal.favorite = !animal.favorite;
    this.animalService.toggleFavorite(animal);
  }*/

  ionViewDidEnter() {
    this.getCourses();
  }


  async getCourses() {
    this.courses = await this.dbFS.getAllCourses();
  }
}
