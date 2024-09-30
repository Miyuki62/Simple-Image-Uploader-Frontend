import { Component, OnInit } from '@angular/core';
import { DarkModeService } from '../dark-mode.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  loading: boolean = false; // Controls visibility of loader
  darkmod: boolean = false;

  constructor(private darkModeService: DarkModeService) {}

  ngOnInit() {
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.darkmod = isDarkMode; // Mettez à jour l'état du mode sombre
    });
  }

  // Method to show loader
  startLoading() {
    this.loading = true;
  }

  // Method to hide loader
  stopLoading() {
    this.loading = false;
  }
}
