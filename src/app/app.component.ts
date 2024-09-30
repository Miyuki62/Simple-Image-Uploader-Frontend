import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from './dark-mode.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  uploadedImageId: string | null = null; // Pour stocker l'ID de l'image téléchargée

  constructor(
    private darkModeService: DarkModeService,
    private router: Router
  ) {}

  ngOnInit() {
    this.darkModeService.darkMode$.subscribe();
  }

  onImageUploaded(imageId: string) {
    this.uploadedImageId = imageId; // Stocke l'ID de l'image téléchargée
    this.router.navigate(['/download', imageId]); // Navigation vers le composant de téléchargement
  }
}
