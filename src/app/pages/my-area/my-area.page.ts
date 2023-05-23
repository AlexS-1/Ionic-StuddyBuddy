import { Component, OnInit, Type } from "@angular/core";
import { User } from "src/app/models/user";
import { DbFirebaseService } from "src/app/services/db-firebase.service";
import { AuthService } from "src/app/services/auth-service.service";
import { Router } from "@angular/router";
import { AngularFireStorage } from "@angular/fire/storage";
import * as firebase from "firebase/app";

@Component({
  selector: "app-my-area",
  templateUrl: "./my-area.page.html",
  styleUrls: ["./my-area.page.scss"],
})
export class MyAreaPage implements OnInit {
  
  //Input from form
  firstName: string = "";
  surname: string = ""
  blob: Blob = new Blob();



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

  constructor(
    private dbFS: DbFirebaseService, 
    private authService: AuthService, 
    private router: Router,
    private fS: AngularFireStorage) {

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
    this.authService.signOutFSAuth();
    this.router.navigateByUrl('/home')
  }

  loadImageFromDevice(event) {

    const file = event.target.files[0];
  
    const reader = new FileReader();
  
    reader.readAsArrayBuffer(file);
  
    reader.onload = () => {
  
      // get the blob of the image:
      this.blob = new Blob([new Uint8Array((reader.result as ArrayBuffer))], {type : 'image/jpg'});
    };
  
    reader.onerror = (error) => {
  
      //handle errors
  
    };
  };

  uploadImage() {
    //Upload image to firebase storage
    this.fS.upload(`uploads/${this.user.username}`, this.blob);

    //Get URL once upload is finished
    const storageRef = firebase.storage().ref('uploads');
    storageRef.listAll().then((result) => {
      result.items.forEach(async ref => {
        if (ref.name.split(".")[0] == this.user.username) {
          this.user.profilePicture = await ref.getDownloadURL();
        }
      })
    })
    this.updateUserInformation();
  }

}
