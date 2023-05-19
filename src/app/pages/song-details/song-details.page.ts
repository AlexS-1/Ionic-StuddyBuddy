import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DbSqliteService } from "src/app/services/db-sqlite.service";

@Component({
  selector: "app-song-details",
  templateUrl: "./song-details.page.html",
  styleUrls: ["./song-details.page.scss"],
})
export class SongDetailsPage implements OnInit {
  
  editForm: FormGroup;
  id: any;

  constructor(
    private db: DbSqliteService,
    private router: Router,
    public formBuilder: FormBuilder,
    private actRoute: ActivatedRoute
  ) {
    this.id = this.actRoute.snapshot.paramMap.get("id");
    this.db.getSong(this.id).then((res) => {
      this.editForm.setValue({
        artist_name: res["artist_name"],
        song_name: res["song_name"],
      });
    });
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      artist_name: [""],
      song_name: [""],
    });
  }

  saveForm() {
    this.db.updateSong(this.id, this.editForm.value).then((res) => {
      console.log(res);
      this.router.navigate(["/home"]);
    });
  }
}
