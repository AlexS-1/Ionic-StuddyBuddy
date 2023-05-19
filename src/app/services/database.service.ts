import { Platform } from "@ionic/angular";
import { Injectable } from "@angular/core";
import { SQLitePorter } from "@ionic-native/sqlite-porter/ngx";
import { HttpClient } from "@angular/common/http";
import { SQLite, SQLiteObject } from "@ionic-native/sqlite/ngx";
import { BehaviorSubject, Observable } from "rxjs";

export interface Dev {
  id: number;
  name: string;
  //skills: string[];
  skills: string;
  img: string;
}

export interface Product {
  id: number;
  name: string;
  creator: number;
}

@Injectable({
  providedIn: "root",
})
export class DatabaseService {
  private database?: SQLiteObject;
  private dbReady = new BehaviorSubject<boolean>(false);

  developers = new BehaviorSubject<Dev[]>([]);
  products = new BehaviorSubject<Product[]>([]);

  constructor(
    private platform: Platform,
    private sqlitePorter: SQLitePorter,
    private sqlite: SQLite,
    private http: HttpClient
  ) {
    this.createDatabase();

    /* this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'developers.db',
        location: 'default'
      })
      .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
      });
    }); */
  }

  createDatabase() {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: "developers.db",
          location: "default",
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.seedDatabase();
        });
    });
  }

  seedDatabase() {
    this.http
      .get("assets/seed.sql", { responseType: "text" })
      .subscribe((sql) => {
        this.sqlitePorter
          .importSqlToDb(this.database, sql)
          .then((_) => {
            this.loadDevelopers();
            this.loadProducts();
            this.dbReady.next(true);
          })
          .catch((e) => console.error(e));
      });
  }

  getDatabaseState() {
    return this.dbReady.asObservable();
  }

  getDevs(): Observable<Dev[]> {
    return this.developers.asObservable();
  }

  getProducts(): Observable<any[]> {
    return this.products.asObservable();
  }

  loadDevelopers() {
    return this.database!.executeSql(
      "SELECT * FROM developer", []
    ).then((data) => {
        let developers: Dev[] = [];

        if (data.rows.length > 0) {
          for (var i = 0; i < data.rows.length; i++) {
            /* let skills = [];
            if (data.rows.item(i).skills != "") {
              skills = JSON.parse(data.rows.item(i).skills);
            } */

            developers.push({
              id: data.rows.item(i).id,
              name: data.rows.item(i).name,
              //skills: skills,
              skills: data.rows.item(i).skills,
              img: data.rows.item(i).img,
            });
          }
        }
        this.developers.next(JSON.parse(JSON.stringify(developers)));
      }
    );
  }

  /* addDeveloper(name: string, skills: string[], img: string) {
    let data = [name, JSON.stringify(skills), img];
    return this.database!.executeSql(
      "INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)",
      data
    ).then((data) => {
      this.loadDevelopers();
    });
  } */

  addDeveloper(name: string, skills: string, img: string) {
    let data = [name, skills, img];
    return this.database!.executeSql(
      "INSERT INTO developer (name, skills, img) VALUES (?, ?, ?)",
      data
    ).then((_) => {
      this.loadDevelopers();
    });
  }

  getDeveloper(id: number): Promise<Dev> {
    return this.database!.executeSql(
      "SELECT * FROM developer WHERE id = ?", 
      [id,]
    ).then((data) => {
      /* let skills: string[] = [];
      if (data.rows.item(0).skills != "") {
        skills = JSON.parse(data.rows.item(0).skills);
      } */

      return {
        id: data.rows.item(0).id,
        name: data.rows.item(0).name,
        //skills: skills,
        skills: data.rows.item(0).skills,
        img: data.rows.item(0).img,
      };
    });
  }

  deleteDeveloper(id: number) {
    return this.database!.executeSql(
      "DELETE FROM developer WHERE id = ?", 
      [id,]
    ).then((_) => {
      this.loadDevelopers();
      this.loadProducts();
    });
  }

  updateDeveloper(dev: Dev) {
    let data = [dev.name, JSON.stringify(dev.skills), dev.img];
    return this.database!.executeSql(
      `UPDATE developer SET name = ?, skills = ?, img = ? WHERE id = ${dev.id}`,
      data
    ).then((data) => {
      this.loadDevelopers();
    });
  }

  loadProducts() {
    let query = "SELECT product.name, product.id, developer.name AS creator FROM product JOIN developer ON developer.id = product.creatorId";
    return this.database!.executeSql(query, []).then((data) => {
      let products: Product[] = [];
      if (data.rows.length > 0) {
        for (var i = 0; i < data.rows.length; i++) {
          products.push({
            name: data.rows.item(i).name,
            id: data.rows.item(i).id,
            creator: data.rows.item(i).creator,
          });
        }
      }
      this.products.next(JSON.parse(JSON.stringify(products)));
    });
  }

  addProduct(name: string, creator: number) {
    let data = [name, creator];
    return this.database!.executeSql(
      "INSERT INTO product (name, creatorId) VALUES (?, ?)",
      data
    ).then((data) => {
      this.loadProducts();
    });
  }
}
