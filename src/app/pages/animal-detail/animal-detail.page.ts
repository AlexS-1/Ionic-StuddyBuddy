import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AnimalService } from "../../services/animal.service";
import { Animal } from "../../models/animal.model";
import { DatabaseService } from "./../../services/database.service";

@Component({
  selector: "app-animal-detail",
  templateUrl: "./animal-detail.page.html",
  styleUrls: ["./animal-detail.page.scss"],
})
export class AnimalDetailPage implements OnInit {
  
  animal?: Animal;
  favorite = false;
  
  constructor(
    private route: ActivatedRoute,
    private animalService: AnimalService,
    private db: DatabaseService
  ) {}

  ngOnInit() {
    /* this.db.getDatabaseState().subscribe((dbReady) => {
      if (dbReady) {
        this.getAnimal();
      }
    }); */

    this.getAnimal();
  }

  getAnimal(): void {
    const id: string = this.route.snapshot.paramMap.get("id");
    if (id) {
      this.animalService
        .getAnimalById(id)
        .subscribe((animal) => {
          this.animal = animal;
          this.favorite = animal.favorite;
      });
    }
  }

  toggleFavorite(): void {
    if (this.animal) {
      this.animal.favorite = this.favorite;
      this.animalService.toggleFavorite(this.animal);
    }
  }
}
