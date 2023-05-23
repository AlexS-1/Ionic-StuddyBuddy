import { Injectable } from "@angular/core";
import { Platform } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { DbFirebaseService } from "./db-firebase.service";
import { AuthService } from "./auth-service.service";
import { User } from "../models/user";
import { Course } from "../models/course";

export class Song {
  id: number;
  artist_name: string;
  song_name: string;
}

@Injectable({
  providedIn: "root",
})
export class DbSqliteService {

  debugging = false;

  private storage: SQLiteObject;
  public courseList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private http: HttpClient,
    private sqlPorter: SQLitePorter,
    private dbFS: DbFirebaseService,
    private auth: AuthService
  ) {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: "positronx_db.db",
          location: "default",
        })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getFakeData();
        });
    });
  }

  getDatabaseState() {
    return this.isDbReady.asObservable();
  }

  //Method called when user is loggedIn to sync local database with firestore from website
  async syncSQLDatabase() {
    //Get user's courses
    const username = await this.auth.getCurrentUserName();
    const userDocument = await this.dbFS.getUserData(username);
    let userCourseIDs: number[] = [];
    if (userDocument.exists) {
      userCourseIDs = userDocument.data()['courses']
    }

    //Get course data for user's courses
    let userCourses: Course[] = []
    for (let i = 0; i < userCourseIDs.length; i++) {
      const courseDocument = await this.dbFS.getCourseById(userCourseIDs[i].toString())
      //TODO courseDocument does not exist
      if (courseDocument.exists) {
        let course: Course = {
          id: courseDocument.data()['id'],
          title: courseDocument.data()['title'],
          description: courseDocument.data()['description'],
          createdByUserID: courseDocument.data()['createdByUserID'],
          imageURL: courseDocument.data()['imageURL']
        }
        userCourses.push(course);
      }
    }

    let allCourses: Course[] = [];
    allCourses = await this.dbFS.getAllCourses();
    let allUserCourses: [Course, boolean][];
    let matching: boolean = false
    let element: [Course, boolean];

    allCourses.forEach((course) => {
      for (let i = 0; i < userCourses.length; i++) {
        if (course.id == userCourses[i].id) {
          matching = true;
        }
      }
      element = [course, matching]
      console.log(element)
      console.log(allUserCourses.push(element));
      matching = false;
    });

    console.log("allUserCourses");

    allUserCourses.forEach((element) => {
      console.log("IAMHERE")
      this.addCourse(element[0], element[1]);
    });

  }

  // Add a course to the SQLite DB
  async addCourse(course: Course, favorite: boolean) {
    let data = [course.id, course.title, course.description, course.createdByUserID, course.imageURL, ];
    if (this.debugging) {
      console.log("addCourse, data: ", data)
    }
    return this.storage
      .executeSql(
        "INSERT INTO songtable (id, title, courseDescription, createdByUserID, imagURL, favourite) VALUES (?, ?, ?, ?, ?, ?)",
        data
      )
      .then((res) => {
        this.getSongs();
      });
  }

  // Get list
  async getCourses() {
    let temp = this.storage
      .executeSql("SELECT * FROM favCourses", [])
      .then((res) => {
        let items: Course[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              id: res.rows.item(i).id,
              title: res.rows.item(i).title,
              description: res.rows.item(i).courseDescription,
              createdByUserID: res.rows.item(i).createdByUserID,
              imageURL: res.rows.item(i).imageURL
            });
          }
        }
        this.courseList.next(items);
      });
    return temp;
  }
  
  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchCourses(): Observable<Course[]> {
    return this.courseList.asObservable();
  }

  // Render fake data
  getFakeData() {
    this.http
      .get("assets/dump.sql", { responseType: "text" })
      .subscribe((data) => {
        this.sqlPorter
          .importSqlToDb(this.storage, data)
          .then((_) => {
            this.getSongs();
            this.isDbReady.next(true);
          })
          .catch((error) => console.error(error));
      });
  }

  // Get list
  getSongs() {
    return this.storage
      .executeSql("SELECT * FROM songtable", [])
      .then((res) => {
        let items: Song[] = [];
        if (res.rows.length > 0) {
          for (var i = 0; i < res.rows.length; i++) {
            items.push({
              id: res.rows.item(i).id,
              artist_name: res.rows.item(i).artist_name,
              song_name: res.rows.item(i).song_name,
            });
          }
        }
        this.courseList.next(items);
      });
  }

  // Add
  addSong(artist_name, song_name) {
    let data = [artist_name, song_name];
    return this.storage
      .executeSql(
        "INSERT INTO songtable (artist_name, song_name) VALUES (?, ?)",
        data
      )
      .then((res) => {
        this.getSongs();
      });
  }

  // Get single object
  getSong(id): Promise<Song> {
    return this.storage
      .executeSql("SELECT * FROM songtable WHERE id = ?", [id])
      .then((res) => {
        return {
          id: res.rows.item(0).id,
          artist_name: res.rows.item(0).artist_name,
          song_name: res.rows.item(0).song_name,
        };
      });
  }

  // Update
  updateSong(id, song: Song) {
    let data = [song.artist_name, song.song_name];
    return this.storage
      .executeSql(
        `UPDATE songtable SET artist_name = ?, song_name = ? WHERE id = ${id}`,
        data
      )
      .then((data) => {
        this.getSongs();
      });
  }

  // Delete
  deleteSong(id) {
    return this.storage
      .executeSql("DELETE FROM songtable WHERE id = ?", [id])
      .then((_) => {
        this.getSongs();
      });
  }
}
