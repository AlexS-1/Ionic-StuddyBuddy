import { Component, OnInit } from "@angular/core";
import { Animal } from "../../models/animal.model";
import { CourseService } from "../../services/course.service";
import { DatabaseService } from "../../services/database.service";
import { Course } from "src/app/models/course";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { DbSqliteService } from "src/app/services/db-sqlite.service";
import { AuthService } from "src/app/services/auth-service.service";

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
    //private courseService: CourseService,
    private auth: AuthService,
    private dbFS: DbFirebaseService,
    //private dbSQL: DbSqliteService
  ) {
  }

  /* ngOnInit(): void {
    this.getAnimals();
    //this.animals$ = this.animalService.getAllAnimals();
  } */

  ngOnInit() {    
    this.getCourses();
    /*this.dbSQL.getDatabaseState().subscribe((dbReady) => {
      if (dbReady) {
        this.getCourses();
      }
    }); 
    this.getCourses();*/
  }

  async getCourses() {
    /*this.courseService.getAllCourses().subscribe((courses) => {
      this.courses = courses;
    });*/
    const username = await this.auth.getCurrentUserName();
    const userDocument = await this.dbFS.getUserData(username);
    let usersCourses = [];
    if (userDocument.exists) {
      usersCourses = userDocument.data()['courses'];
    }
    for (let i = 0; i < usersCourses.length; i++) {
      const courseDocument = await this.dbFS.getCourseById(usersCourses[i])
      if (courseDocument.exists) {
        const course: Course = {
          id: courseDocument.data()['id'],
          title: courseDocument.data()['title'],
          description: courseDocument.data()['description'],
          createdByUserID: courseDocument.data()['createdByUserID'],
          imageURL: courseDocument.data()['imageURL']
        }
        this.courses.push(course);
      }
    }
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
