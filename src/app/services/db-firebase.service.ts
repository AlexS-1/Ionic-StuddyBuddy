import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { DocumentData } from '@angular/fire/firestore';
import { User } from '../models/user';
import { Course } from '../models/course';


@Injectable({
  providedIn: 'root'
})

export class DbFirebaseService {

  constructor(private fS: AngularFirestore) {

  }

  db = this.fS.firestore;

//CREATE DATA IN FIRESTORE

  async addTest() {
    const date = {
      username: "user1",
      password: "tes"
    }
    this.db.collection('test').doc('id').set(date);
  }

  async addCourse(course: Course): Promise<string> {
  
    //Check if course already exists
    const courseObj = this.fS.collection('courses').doc(this.cyrb53(course.id.toString()).toString());

    //Create data
    const data: Course = {
      id: course.id,
      title: course.title,
      description: course.description,
      createdByUserID: course.createdByUserID
    }
  
    //Add data if it does not exist yet
    if(!courseObj.get()) {
      courseObj.set(data);
      return "Course added";
    }

    return "Course already exists";
  }

  // Receives the users data and enters it to the firebase realtime database
  // Enter new user only if it does not already exist
  // INFO: This function adds a default picture and an empty course list to the useres data
  async addUser(user: User) {
    let message = "";
    let allowRegistration = this.checkUserEmailExists(user.email);

    // Here: serach database for doc with matching user-id = this.cyrb53(this.username).toString() --> user_id
    const userDocument = this.db.collection('users').doc(this.cyrb53(user.username.toString()).toString());
    if ((await userDocument.get()).exists) {
      return "Username already exists"
    } else if(this.checkUserEmailExists(user.email)) {
      return "E-Mail already exists"
    } else {
      // Only add new user account if user is not already in the database and returen appropriate response
      const data = { 
        id: this.cyrb53(user.username.toString()), 
        username: user.username, 
        firstName: user.firstName,
        surname: user.surname, 
        email: user.email, 
        dateOfBirth: user.dateOfBirth, 
        password: user.password, 
        courses: user.courses, 
        profilePicture: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
      }
      // Creates a new doc with the userId as doc name
      this.db.collection('users').doc(data.id.toString()).set(data);
      message = "You successfully registered"
    }
    return message;
  }

//READ DATA IN FIRESTORE

  async getAllCourses() {
    const courseCollection = await this.db.collection('courses').get();
    const allCourses: Course[] = [];
    courseCollection.forEach((doc) => {
      const course: Course = {
        id: doc.data()['id'],
        title: doc.data()['title'],
        description: doc.data()['description'],
        createdByUserID: doc.data()['createdByUserID'],
        imageURL: doc.data()['imageURL']
      }
      allCourses.push(course);
    });
    return allCourses;
  }

  async getCourseById(id: string) {
    const courseObject = await this.db.collection('courses').doc(this.cyrb53(id.toString()).toString()).get();
    return courseObject;
  }

  async getUserData(username: String) {
    const userDoc = this.db.collection('users').doc(this.cyrb53(username.toString()).toString()).get();
    return userDoc
  }

  async getloggedInData(id: String| null): Promise<DocumentData|null>{
    if(id == null){
      return null;
    }
    const tokenDoc = await this.db.collection('loggedIn').doc(id.toString()).get()
    return tokenDoc;
  }

  async getUserNameByMail(mail: string): Promise<string | null>{
    //const userDocs = await getDocs(query(collection(this.db, 'users'), where('email', '==', mail)));
    let docUsername: string | null = null;
    /*userDocs.forEach((doc) => {
      if (doc.data()['email'] === mail) {
        docUsername = doc.data()['username'];
      }
    });*/
    (await this.db.collection('users').where('email', '==', mail).get().then()).forEach((doc) => {
      if (doc.get('email') === mail) {
        docUsername = doc.get('username');
      }
    });
    return docUsername;
  }

//UPDATE DATA IN FIRESTORE

  //Update the profile picture to a non-standard (called in my-area)
  async setProfilePicture(username: string, url: string) {
    const userID = this.cyrb53(username).toString();
    const userReference = this.db.collection('users').doc(userID);
    let userData = await this.getUserData(username);
    if (userData.exists) {
      const data: User = {
          id: userData.data()['id'] ,
          username: userData.data()['username'],
          firstName: userData.data()['firstName'],
          surname: userData.data()['surname'],
          email: userData.data()['email'],
          dateOfBirth: userData.data()['dateOfBirth'],
          password: userData.data()['password'],
          courses: userData.data()['courses'],
          profilePicture: url
      }
      await userReference.set(data);
    }
  }

  //Update names of user
  async updateUser(user: User) {
    this.db.collection('users').doc(user.id.toString()).set(user);
  }

  //Update array of courses for users
  async addToUsersCourses(username: string, courseID: number) {
    const userID = this.cyrb53(username).toString();
    const userReference = this.db.collection('users').doc(userID);
    let userData = await this.getUserData(username);
    if (userData.exists) {
        let userCourses: number[] = userData.data()['courses'];
        if (!userCourses.includes(courseID)) {
            userCourses.push(courseID);
        }
        const data: User = {
            id: userData.data()['id'] ,
            username: userData.data()['username'],
            firstName: userData.data()['firstName'],
            surname: userData.data()['surname'],
            email: userData.data()['email'],
            dateOfBirth: userData.data()['dateOfBirth'],
            password: userData.data()['password'],
            courses: userCourses,
            profilePicture: userData.data()['profilePicture']
        }
        await userReference.set(data);
    }
  }

  async removeFromUserCourses(username: string, courseID: number) {
    const userID = this.cyrb53(username).toString();
    const userReference = this.db.collection('users').doc(userID);
    let userData = await this.getUserData(username);
    if (userData.exists) {
        let userCourses: number[] = userData.data()['courses'];
        if (userCourses.includes(courseID)) {
          const index = userCourses.indexOf(courseID, 0);
          if (index > -1) {
             userCourses.splice(index, 1);
          }
        }
        const data: User = {
            id: userData.data()['id'] ,
            username: userData.data()['username'],
            firstName: userData.data()['firstName'],
            surname: userData.data()['surname'],
            email: userData.data()['email'],
            dateOfBirth: userData.data()['dateOfBirth'],
            password: userData.data()['password'],
            courses: userCourses,
            profilePicture: userData.data()['profilePicture']
        }
        await userReference.set(data);
    }
  }



//REMOVE DATA IN FIRESTORE
  // Remove user form logged in user
  async removeloggedInData(id: String| null): Promise<boolean>{
    if(id == null){
      return false;
    }
    //await deleteDoc(doc(this.db, 'loggedIn', id.toString()));
    this.db.collection('loggedIn').doc(id.toString()).delete();
    return true;
  }

//HELPER FUNCTIONS+
  checkUserEmailExists(userEmail: string): boolean {
    let emailExists: boolean = false;
    this.db.collection('users').where('email', '==', userEmail)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        emailExists = true;
      });
    })
    .catch((error) => {
      console.log("Error finding email: ", error);
    })
    .finally(() => {
      return emailExists
    })
    return emailExists;
  }

  // 53-Bit hash function from https://github.com/bryc/code/blob/master/jshash/experimental/cyrb53.js
  private cyrb53(str: string, seed = 0){
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  };
}
