import { Component, OnInit } from "@angular/core";
import { Animal } from "../../models/animal.model";
import { CourseService } from "../../services/course.service";
import { DatabaseService } from "../../services/database.service";
import { Course } from "src/app/models/course";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { DbSqliteService } from "src/app/services/db-sqlite.service";

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
    private courseService: CourseService,
    //private dbFS: DbFirebaseService,
    private dbSQL: DbSqliteService
  ) {
  }

  /* ngOnInit(): void {
    this.getAnimals();
    //this.animals$ = this.animalService.getAllAnimals();
  } */

  ngOnInit() {    
    this.dbSQL.getDatabaseState().subscribe((dbReady) => {
      if (dbReady) {
        this.getCourses();
      }
    }); 
    this.getCourses();
  }

  getCourses(): void {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
    });
    console.log("Courses: ", this.courses)
  }

  /*toggleFavorite(course: Course): void {
    course.favorite = !animal.favorite;
    this.courseService.toggleFavorite(course);
  }

  /*ionViewDidEnter() {
    this.getCourses();
  }

  async getCourses() {
    this.courses = await this.dbSQL.getCourses();
  }*/
}
