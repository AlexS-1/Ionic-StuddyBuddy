import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { Course } from "../models/course";
import { error } from "console";

@Injectable({
  providedIn: "root",
})
export class CourseService {

  private coursesCollection: AngularFirestoreCollection<Course>;

  constructor(private afs: AngularFirestore) {
    this.coursesCollection = afs.collection<Course>("courses");
  }

  getAllCourses() {
    return this.coursesCollection.valueChanges({ idField: "id" });
  }

  getCourseById(courseID: string) {
    return this.afs.doc<Course>(`courses/${courseID}`).valueChanges();
  }

  toggleFavorite(course: Course) {
    //animal.favorite = !animal.favorite;
    this.afs.doc<Course>(`courses/${course.id.toString()}`).update(course);
  }

  /*getFavorites() {
    return this.afs
      .collection<Course>("users", (ref) => ref.where("favorite", "==", true))
      .valueChanges({ idField: "id" });

    /*
    return this.afs
      .collection<Animal>('animals', ref => ref.where('isFavorite', '==', true))
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as Animal;
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      );
  }*/

}
