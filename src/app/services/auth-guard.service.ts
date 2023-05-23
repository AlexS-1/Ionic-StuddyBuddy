import { Injectable } from '@angular/core';
import { AuthService } from './auth-service.service';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private authService: AuthService, private router: Router) {}

  debugging = false;

  // Check wherether a user has the required role to access a route
  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    if ((await this.authService.isLoggedInFSAuth())) {
      if(this.debugging){
        console.log("canActivate: ", true);
      }
      return true;      // State logged in
    }else{
      // redirect to the login page if not logged in
      if(this.debugging){
        console.log("canActivate: ", false);
      }
      this.router.navigate(['/log-in']);
      return false;     // State logged out
    }
  }
}
