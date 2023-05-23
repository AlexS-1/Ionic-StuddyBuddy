import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/services/auth-service.service";
import { DbSqliteService } from "src/app/services/db-sqlite.service";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.page.html",
  styleUrls: ["./log-in.page.scss"],
})
export class LogInPage {
  email: string = "";
  password: string = "";

  message = ""

  constructor(
    private authService: AuthService,
    private dbSQL: DbSqliteService
    ) {}

  debugging = true


  async onSubmit() {
    const isValid = await this.authService.signInWithMailAndPwFSAuth(this.email, this.password);
    if (this.debugging) {
      console.log("onSubmit() function called"); // for debugging
      console.log("email value:", this.email); // for debugging
      console.log("password value:", this.password); // for debugging *
      console.log("isValid", isValid);
    }
    if (isValid) {
      // perform login
      this.message = "Succesfully logged in"
      this.dbSQL.syncSQLDatabase();
      if (this.debugging) {
        console.log("perform log-in");  // For DEBUGGGING
      }
    } else {
      // display error message
      this.message = "The password or mail is invalid"
      if (this.debugging) {
        console.log("invalid log-in data"); // For DEBUGGGING 
      }
    }
  }
}
