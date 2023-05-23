import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { AuthService } from "src/app/services/auth-service.service";
import { Router } from "@angular/router";
import * as firebase from "firebase";

@Component({
  selector: "app-my-area",
  templateUrl: "./my-area.page.html",
  styleUrls: ["./my-area.page.scss"],
})
export class MyAreaPage implements OnInit {
  
  //Input from form
  firstName: string = "";
  surname: string = ""

  user: User = {
    id: '',
    username: '',
    firstName: '',
    surname: '',
    email: '',
    dateOfBirth: '',
    password: '',
    courses: [],
    profilePicture: ''
  };

  constructor(private dbFS: DbFirebaseService, private authService: AuthService, private router: Router) {

  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.user.username = await this.authService.getCurrentUserName();
    
    const user = await this.dbFS.getUserData(this.user.username);
    if (user.exists) {
      this.user.id = user.data()['id'];
      this.user.username = user.data()['username'];
      this.user.firstName = user.data()['firstName'];
      this.user.surname = user.data()['surname'];
      this.user.email = user.data()['email'];
      this.user.dateOfBirth = user.data()['dateOfBirth'];
      this.user.password = user.data()['password'];
      this.user.courses = user.data()['courses'];
      this.user.profilePicture = user.data()['profilePicture'];
    }
    this.firstName = this.user.firstName;
    this.surname = this.user.surname;
  }

  updateUserInformation() {
    this.user.firstName = this.firstName;
    this.user.surname = this.surname;
    this.dbFS.updateUser(this.user)
  }

  logout() {
    this.authService.logout()
    this.router.navigateByUrl('/home')
  }

}
