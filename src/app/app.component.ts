import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit {

  //constructor(private toast: ToastController) {}

  public selectedIndex = 0;
  public appPages = [
    {
      title: "Home",
      url: "/home",
      icon: "home",
    },
    {
      title: "My Courses",
      url: "/my-courses",
      icon: "list",
    },
    {
      title: "My Area",
      url: "/my-area",
      icon: "person",
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    //this.initializeApp();
  }

  /*initializeApp() {
    this.platform.ready().then(() => {
      this.database.createDatabase().then(() => {
        //this.statusBar.styleDefault();
        this.statusBar.hide();
        this.splashScreen.hide();
      });
    });
  }*/

  ngOnInit() {
    const path = window.location.pathname.split("folder/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
  }

  /* async ngOnInit() {
    let toast = await this.toast.create({
      message: "Creating database...",
      duration: 3000,
    });
    toast.present();
  } */
}
