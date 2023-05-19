import { Component, OnInit } from "@angular/core";
import { Platform } from "@ionic/angular";
import { DbService } from "src/app/services/db.service";

@Component({
  selector: "app-category",
  templateUrl: "./category.page.html",
  styleUrls: ["./category.page.scss"],
})
export class CategoryPage implements OnInit {
  
  categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  constructor(public database: DbService, public platform: Platform) {}

  ngOnInit() {
    this.getCategories();

    /* this.database.createDatabase().then(() => {
      // will call get categories
      this.getCategories();
    }); */
  }

  addCategory() {
    if (!this.categoryName.length) {
      alert("Enter category name");
      return;
    }

    if (this.editMode) {
      // edit category
      this.database
        .editCategory(this.categoryName, this.editId)
        .then((data) => {
          this.categoryName = "";
          (this.editMode = false), (this.editId = 0);
          alert(data);
          this.getCategories();
        });
    } else {
      // add category
      this.database.addCategory(this.categoryName).then((data) => {
        this.categoryName = "";
        alert(data);
        this.getCategories();
      });
    }
  }

  getCategories() {
    this.database.getCategories().then((data) => {
      this.categories = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          this.categories.push(data.rows.item(i));
        }
      }
    });
  }

  deleteCategory(id: number) {
    this.database.deleteCategory(id).then((data) => {
      alert(data);
      this.getCategories();
    });
  }

  editCategory(category: any) {
    this.editMode = true;
    this.categoryName = category.name;
    this.editId = category.id;
  }
}
