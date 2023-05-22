import { Component, OnInit } from "@angular/core";
import { DbFirebaseService } from "src/app/services/db-firebase.service";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.page.html",
  styleUrls: ["./log-in.page.scss"],
})
export class LogInPage implements OnInit {
  
  categoryName: string = "";
  categories: any = [];
  editMode: boolean = false;
  editId: number = 0;

  constructor(public dbFS: DbFirebaseService) {}

  ngOnInit() {}
}
