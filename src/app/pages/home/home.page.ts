import { Component, OnInit } from "@angular/core";

import { Animal } from "../../models/animal.model";
import { AnimalService } from "../../services/animal.service";
import { DatabaseService } from "./../../services/database.service";
//import { ToastController } from '@ionic/angular';

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  
  animals: Animal[] = [];
  //animals?: Observable<Animal[]>;

  constructor(
    private db: DatabaseService,
    private animalService: AnimalService
  ) //private toast: ToastController
  {}

  ngOnInit() {
    this.getAnimals();

    /* this.db.getDatabaseState().subscribe( (dbReady) => {

      if (dbReady) {
        //this.animals = this.animalService.getFavorites();
        this.getAnimals();
        this.title = 'Favorites';
      }
    }); */
  }

  getAnimals(): void {
    this.animalService.getFavorites().subscribe((animals) => {
      this.animals = animals;
    });
  }

  toggleFavorite(animal: Animal): void {
    this.animalService.toggleFavorite(animal);
  }
}
