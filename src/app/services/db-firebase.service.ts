import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from 'firebase';
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

//READ DATA IN FIRESTORE

  async getAllCourses() {
    const courseCollection = await this.db.collection('courses').get();
    const allCourses: Course[] = [];
    courseCollection.forEach((doc) => {
      const course: Course = {
        id: doc.data()['id'],
        title: doc.data()['title'],
        description: doc.data()['description'],
        createdByUserID: doc.data()['createdByUserID']
      }
      allCourses.push(course);
    });
    return allCourses;
  }

  async getCourseById(id: string) {
    const courseObject = await this.db.collection('courses').doc(this.cyrb53(id.toString()).toString()).get();
    return courseObject;
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
