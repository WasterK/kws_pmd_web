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
  
  isLoggedIn = false; 
  username = ''; 
  isAddSiteFormVisible = false; 

  sites: any[] = [];

  newSite = {
    name: '',
    location: ''
  };

  constructor(
    private authService: AuthService, 
    private router: Router,
    private siteService: SiteService 
  ) {}

  ngOnInit() {
    
    this.isLoggedIn = this.authService.getLoginStatus();
    if (this.isLoggedIn) {
      
    }
    this.loadSites();  
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); 
    this.isLoggedIn = false;
  }

  showAddSiteForm() {
    this.isAddSiteFormVisible = true;
  }


  cancelAddSite() {
    this.isAddSiteFormVisible = false;
    this.resetNewSiteForm();
  }


  resetNewSiteForm() {
    this.newSite = { name: '', location: '' };
  }


  submitNewSite() {
    this.siteService.addSite(this.newSite).subscribe(
      (response) => {
        this.sites.push(response); 
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


  deleteSite(siteId: number) {
    this.siteService.deleteSite(siteId).subscribe(
      () => {
        this.sites = this.sites.filter((site) => site.id !== siteId);
        console.log('Deleted site:', siteId);
      },
      (error) => {
        console.error('Error deleting site', error);
      }
    );
  }
}
