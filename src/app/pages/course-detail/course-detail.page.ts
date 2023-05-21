import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DatabaseService } from "../../services/database.service";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { Course } from "src/app/models/course";

@Component({
  selector: "app-course-detail",
  templateUrl: "./course-detail.page.html",
  styleUrls: ["./course-detail.page.scss"],
})
export class CourseDetailPage implements OnInit {
  
  course: Course = {
    id: 0,
    title: "",
    description: "",
    createdByUserID: 0
  }
  favorite = false;
  
  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private dbFS: DbFirebaseService
  ) {}

  ngOnInit() {
    this.getCourse();
  }

  async getCourse() {
    const id: string = this.route.snapshot.paramMap.get("id");

    console.log("course-title: ", this.course.title)
    if (id) {
      const doccoumentData = await this.dbFS.getCourseById(id);
        this.course.id = doccoumentData.data()['id'];
        this.course.title = doccoumentData.data()['title'];
        this.course.description = doccoumentData.data()['description'];
        this.course.createdByUserID = doccoumentData.data()['createdByUserID'];
        console.log("course-title: ", this.course.title)
    }
  }

  /*toggleFavorite(): void {
    if (this.animal) {
      this.animal.favorite = this.favorite;
      this.animalService.toggleFavorite(this.animal);
    }
  }*/
}
