import { Component, OnInit } from "@angular/core";
import { Course } from "src/app/models/course";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { AuthService } from "src/app/services/auth-service.service";

@Component({
  selector: "app-my-courses-list",
  templateUrl: "./my-courses.page.html",
  styleUrls: ["./my-courses.page.scss"],
})
export class MyCoursesPage implements OnInit {
  courses: Course[] = [];

  constructor(
    private auth: AuthService,
    private dbFS: DbFirebaseService,
    //private dbSQL: DbSqliteService
  ) {
  }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.courses = []
    this.getCourses();
  }

  async getCourses() {
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
}
