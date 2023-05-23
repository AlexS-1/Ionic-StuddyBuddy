import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { DbFirebaseService } from './db-firebase.service';
import * as firebase from 'firebase';
import { User } from '../models/user';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private router: Router, 
    private firestore: AngularFirestore, 
    private backendDataService: DbFirebaseService,
    private afAuth: AngularFireAuth
    ) {
      /* Saving user data in localstorage when 
    logged in and setting up null when logged out */
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

  debugging = true;

  // Firebase Firestore
  db = this.firestore.firestore;

  // Firebase Auth
  auth = firebase.auth();
  userData: any; // Save logged in user data

  // Valifation function to be called by login function
  // Returns the first match for email+password pair in user data array
  private async validateCredentials(email: string, password: string): Promise<boolean> {
    let userFound = false;
    var query = this.db.collection('users')
      .where('email' , '==', email)
      .where('password' , '==', password);
    const querySnapshot = (await query.get().then()).forEach((doc) => {
      if(doc.exists){
        userFound = true;
      }
    });
    /*querySnapshot.forEach((doc) => {
      if(doc.exists()){
        userFound = true;
      }
    });*/
    return userFound;
  }


  ///////////////////////
  /// Log-In handling ///
  ///////////////////////

  async login(email: string, password: string) : Promise<boolean>{
    // check credentials with database
    let succssfulLookup = await this.validateCredentials(email, password);

    if (this.debugging) {
      console.log('lookup state', succssfulLookup);         // for debugging
    } 
    // TODO: Implement login logic and set role in local storage
    let successfulState = false;

    // On success enter login state in "loggedIn" collection and return docId as token,center email + time
    let data = {
      email,
      timestamp: Date.now()
    }
  
    if(succssfulLookup){
      let token = sessionStorage.getItem('logInToken');
      const tokenDoc = await this.backendDataService.getloggedInData(token);
      if(tokenDoc != null){
        if(!tokenDoc['exists']()){
          let newEntryDoc = await this.db.collection('loggedIn').add(data);
          // Add doc ID to session storage to be able to retrieve login state
          sessionStorage.setItem('logInToken', newEntryDoc.id);                 
        }else{
          /*  No verification at this point that email or timestamp is valid
              ToDo: implement checkup
          */
         if (this.debugging) {
          console.log('Token exists');
         }
        }
        successfulState = true; 
      }else{
        let newEntryDoc = await this.db.collection('loggedIn').add(data);
        // Add doc ID to session storage to be able to retrieve login state
        sessionStorage.setItem('logInToken', newEntryDoc.id);                
        successfulState = true;
      }  
    }
    if(succssfulLookup && successfulState){
      if (this.debugging) {
        console.log("Successfully logged in")
      }
      this.router.navigate(['/home']);
    }else{
      if (this.debugging) {
        console.log("Log in failed in auth-service.ts, logIn()")  // for debugging
      }
    }
    return succssfulLookup && successfulState;
  }

  // Function to perfrorm logout and clear session storage
  // Sets login state to false, removes user role
  logout() : boolean{
    this.backendDataService.removeloggedInData(sessionStorage.getItem('logInToken'));
    sessionStorage.removeItem('logInToken');
    return true;
  }

  // Getter for login status, logged in = true
  async isLoggedIn() : Promise<boolean>{
    let token = sessionStorage.getItem('logInToken');
    const tokenDoc = await this.backendDataService.getloggedInData(token);
    if(tokenDoc != null){
      if (tokenDoc['id'] === token) {
        return true;
      }
    }
    return false;
  }

  // Getter for login status, logged in = true
  async retrieveUserMail(token: String) : Promise<String| null>{
    const tokenDoc = await this.backendDataService.getloggedInData(token);
    if (this.debugging) {
      console.log('tokenDoc: ', tokenDoc);
    }
    if(tokenDoc != null){
      return tokenDoc['data']()['email'];
    }
    if (this.debugging) {
      console.log('returning null');      // for debugging
    }
    return null;
  }

  // Returns "" on failure
  async getCurrentUserName(): Promise<string>{
    let mail = this.afAuth.auth.currentUser.email;
    if(this.debugging){
      console.log("getcurrentUserName mail:", mail);
    }
    if (mail != null) {
      let uName = await this.backendDataService.getUserNameByMail(mail);
      if (this.debugging) {
        console.log('uName: ' , uName);
      }
      if(uName != null){
        return uName;
      }
    }
    return "";
  }

  /////////////////////
  /// FIREBASE AUTH ///
  /////////////////////

  async createNewUserFSAuth(user: User) {
    // Add a new user to firestore Auth
    let userMail = user.email; 
    let userPw = user.password;
    return await firebase.auth().createUserWithEmailAndPassword(userMail, userPw)
    .then(async (result) => {
        // Add the user to firestore (incl. passoword)
        return await this.backendDataService.addUser(user);
      })
      .catch((error) => {
        window.alert(error.message);
        return "Could not add User: Firebase Auth Erorr"
      });
  }

  async signInWithMailAndPwFSAuth(userMail: string, userPw: string) {
    //let returnStatement = false;
    return await this.afAuth.auth.signInWithEmailAndPassword(userMail, userPw)
    .then((result) => {
      this.afAuth.authState.subscribe((user) => {
        if (user) {
          if(this.debugging){
          console.log("signed in auth")
        }
        //returnStatement = true;
        }else{
          // Case result.user is null
          //returnStatement = false;
        }
      });
      return result;;
    })
    .catch((error) => {
      window.alert(error.message);
      if(this.debugging){
        console.log("not signed in auth")
      }
      //return false;
    });
  }

  // Maybe not needed???
  async onAuthStateChangedFSAuth(user: firebase.User) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        var uid = user.uid;
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }

  // Sign out
  async signOutFSAuth() {
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['home']);
  }

  // Getter for login status from firebase Auth, reurns subscription to isVeryfied property
  async isLoggedInFSAuth(){
    return this.afAuth.auth.currentUser;
  }
}

