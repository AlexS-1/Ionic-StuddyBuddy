import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { ToastController } from "@ionic/angular";
import { Router } from "@angular/router";
import { DbSqliteService } from "src/app/services/db-sqlite.service";

@Component({
  selector: "app-song-list",
  templateUrl: "./song-list.page.html",
  styleUrls: ["./song-list.page.scss"],
})
export class SongListPage implements OnInit {
  
  mainForm: FormGroup;
  Data: any[] = [];

  constructor(
    private db: DbSqliteService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router
  ) {}

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchSongs().subscribe((item) => {
          this.Data = item;
        });
      }
    });
    this.mainForm = this.formBuilder.group({
      artist: [""],
      song: [""],
    });
  }

  storeData() {
    this.db
      .addSong(this.mainForm.value.artist, this.mainForm.value.song)
      .then((res) => {
        this.mainForm.reset();
      });
  }

  deleteSong(id) {
    this.db.deleteSong(id).then(async (res) => {
      let toast = await this.toast.create({
        message: "Song deleted",
        duration: 2500,
      });
      toast.present();
    });
  }
}
