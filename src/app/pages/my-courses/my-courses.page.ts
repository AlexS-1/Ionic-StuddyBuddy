import { Component, OnInit } from "@angular/core";
import { Animal } from "../../models/animal.model";
import { AnimalService } from "../../services/animal.service";
import { DatabaseService } from "../../services/database.service";

@Component({
  selector: "app-my-courses-list",
  templateUrl: "./my-courses.page.html",
  styleUrls: ["./my-courses.page.scss"],
})
export class MyCoursesPage implements OnInit {
  
  animals: Animal[] = [];
  //private animals$: Observable<Animal[]>;

  constructor(
    private db: DatabaseService,
    private animalService: AnimalService
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

    this.getAnimals();
  }

  getAnimals(): void {
    this.animalService.getAllAnimals().subscribe((animals) => {
      this.animals = animals;
    });
  }

  toggleFavorite(animal: Animal): void {
    animal.favorite = !animal.favorite;
    this.animalService.toggleFavorite(animal);
  }
}
