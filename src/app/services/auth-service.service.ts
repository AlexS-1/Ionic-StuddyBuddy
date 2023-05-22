
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DbFirebaseService } from './db-firebase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  constructor(
    private router: Router, 
    private firestore: AngularFirestore, 
    private backendDataService: DbFirebaseService) {

  }

  debugging = true

  db = this.firestore.firestore;

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
    let userToken = sessionStorage.getItem('logInToken');
    if (this.debugging) {
      console.log(userToken);
    }
    if(userToken != null){
      let retrUserMail = await this.retrieveUserMail(userToken);
      if (this.debugging) {
        console.log('mail: ', retrUserMail);
      }
      if (retrUserMail != null) {
        let uName = await this.backendDataService.getUserNameByMail(retrUserMail.toString());
        if (this.debugging) {
          console.log('uName: ' , uName);
        }
        if(uName != null){
          return uName;
        }
      }
    }
    return "";
  }
}

