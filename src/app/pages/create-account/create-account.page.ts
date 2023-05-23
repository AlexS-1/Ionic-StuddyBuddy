import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth-service.service';
import { DbFirebaseService } from 'src/app/services/db-firebase.service';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.page.html',
  styleUrls: ['./create-account.page.scss'],
})
export class CreateAccountPage implements OnInit {
  
  //Input from form
  firstName = 'Ale';
  surname = 'Sch';
  username = 'alesch';
  dateOfBirth = '2001-03-13';
  email = 'ale.sch.1@web.de';
  password = 'StuddyBuddy@1';
  repeatedPassword = 'StuddyBuddy@1';

  //Output to form
  message = '';

  //Other variables
  passwordValidity = false;

  constructor(
    private dbFS: DbFirebaseService,
    private fsAuth: AuthService
    ) {

  }

  ngOnInit() {

  }

  checkValidityPassword (password: any) {
    this.message = "The password must match the following criteria: ";
    if(!this.password.match(".*\\d.*"))
      this.message += '\n- at least one number';
    if(!this.password.match(".*[a-z].*"))
      this.message += '\n- at least a lowercase letter';
    if(!this.password.match(".*[A-Z].*"))
      this.message += '\n- at least an uppercase letter';
    if(!this.password.match("(?=.*[@$!%*?&])"))
      this.message += '\n- at least a special character such as: @$!%*?&';
    if ((!(/^(.{8,32})$/.test(this.password)))) {
      this.message += '\n- the password must between 8 and 32 characters'
    }
   }

   checkMatchingPasswords(password: any) {
    if (this.password == this.repeatedPassword) {
      this.passwordValidity = true;
      this.message = ''
    } else {
      this.passwordValidity = false;
      this.message = 'Please enter matching passwords'
    }
  }

  async onSubmit() {
    const user: User = {
      username: this.username,
      firstName: this.firstName,
      surname: this.surname,
      dateOfBirth: this.dateOfBirth,
      email: this.email,
      password: this.password,
      profilePicture: "",
      id: "",
      courses: []
    }
    // call fs auth api, and hand over to legacy procedure (addUser to db)
    this.message = await this.fsAuth.createNewUserFSAuth(user);
  }

}
