import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { AuthService } from "src/app/services/auth-service.service";

@Component({
  selector: "app-my-area",
  templateUrl: "./my-area.page.html",
  styleUrls: ["./my-area.page.scss"],
})
export class MyAreaPage implements OnInit {
  
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

  constructor(private dbFS: DbFirebaseService, private authService: AuthService) {

  }

  ngOnInit() {
    this.getUser();
  }

  async getUser() {
    this.user.username = await this.authService.getCurrentUserName();
    
    const user = await this.dbFS.getUserData(this.user.username);
    if (user.exists) {
      this.user.firstName = user.data()['firstName'];
      this.user.surname = user.data()['surname'];
      this.user.email = user.data()['email'];
      this.user.dateOfBirth = user.data()['dateOfBirth'];
      this.user.profilePicture = user.data()['profilePicture'];
    }
  }

}
