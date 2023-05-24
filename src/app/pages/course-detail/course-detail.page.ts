import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { Course } from "src/app/models/course";
import { AuthService } from "src/app/services/auth-service.service";
import { AuthGuardService } from "src/app/services/auth-guard.service";

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
  currentCourseID = 0;
  
  constructor(
    private route: ActivatedRoute,
    private dbFS: DbFirebaseService,
    private auth: AuthService,
    private authGuard: AuthGuardService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getCourse();
    this.checkFavorite();
  }

  async getCourse() {
    const id: string = this.route.snapshot.paramMap.get("id");
    this.currentCourseID = Number(id);
    if (id) {
      const doccoumentData = await this.dbFS.getCourseById(id);
        this.course.id = doccoumentData.data()['id'];
        this.course.title = doccoumentData.data()['title'];
        this.course.description = doccoumentData.data()['description'];
        this.course.createdByUserID = doccoumentData.data()['createdByUserID'];
    }
  }

  async checkFavorite() { 
    const loggedIn = await this.auth.isLoggedIn()
    if (loggedIn) {
      const username = await this.auth.getCurrentUserName();
      const userData = await this.dbFS.getUserData(username);
      if (userData.exists) {
        const loggedInUserCourses: number[] = userData.data()['courses']
        if (loggedInUserCourses.includes(this.currentCourseID)) {
          this.favorite = true;
        } else {
          this.favorite = false;
        }
      }
    }
  }

  async toggleFavorite() {
    if (await this.auth.isLoggedInFSAuth()) {
      const username = await this.auth.getCurrentUserName();
      if (this.favorite) {
        this.dbFS.addToUsersCourses(username, this.currentCourseID);
      } else {
        this.dbFS.removeFromUserCourses(username, this.currentCourseID);
      }
    } else {
      console.log("logged out")
      this.router.navigateByUrl('/log-in')
    }
  }
}
