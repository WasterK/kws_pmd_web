import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Production Monitoring Display';
  isLoggedIn = false;

  constructor(private authService: AuthService) {};

  ngOnInit() {
    this.isLoggedIn = this.authService.getLoginStatus();
  }
}
