import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SiteService } from '../services/site.service';  


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  
  username = ''; 
  isAddSiteFormVisible = false; 

  sites: any[] = [];

  newSite = {
    name: '',
    location: '',
    status: 'active'
  };

  constructor(
    public authService: AuthService, 
    private router: Router,
    private siteService: SiteService 
  ) {}

  ngOnInit() {
    this.checkTokenValidity();
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout().subscribe( 
      () => {
        this.authService.isLoggedIn = false;
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error('Error logging out:', error); 
      });
  }

  showAddSiteForm() {
    this.isAddSiteFormVisible = true;
  }


  cancelAddSite() {
    this.isAddSiteFormVisible = false;
    this.resetNewSiteForm();
  }


  resetNewSiteForm() {
    this.newSite = { name: '', location: '', status: 'active'};
  }


  submitNewSite() {
    this.siteService.addSite(this.newSite).subscribe(
      (response) => {
        this.sites.push({name: this.newSite.name, location: this.newSite.location}); 
        this.cancelAddSite();
      },
      (error) => {
        console.error('Error adding new site', error);
      }
    );
  }

  loadSites() {
    this.siteService.getSites().subscribe(
      (response: { sites: any[] }) => { 
        this.sites = response.sites;    
      },
      (error) => {
        console.error('Error loading sites:', error);
      }
    );
  }


  viewSite(siteId: number) {
    console.log('View site:', siteId);
    this.router.navigate([`/view-site/${siteId}`]);  
  }

  checkTokenValidity() {
    this.authService.getTokenExpirationDate().subscribe(
      (response) => {
        let errorMsg = response[0]
        let status = response[1]
        if (status === 200) {
          this.authService.isLoggedIn = true;
          this.loadSites()
        } else if (status === 401) {
          this.authService.isLoggedIn = false;
        }
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        if (error.status === 401 && error.error?.error === 'token_expired') {
          console.error('Token expired. Logging out...');
          this.router.navigate(['/login']);
        } else {
          console.error('Error checking token validity:', error);
        }
      });
    }

  deleteSite(siteId: number) {
    this.siteService.deleteSite(siteId).subscribe(
      (response) => {
        this.sites = this.sites.filter((site) => site.site_id !== siteId);
        console.log('Deleted site:', siteId);
      },
      (error) => {
        console.error('Error deleting site', error);
      }
    );
  }
}
