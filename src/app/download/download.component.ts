import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { DarkModeService } from '../dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
})
export class DownloadComponent implements OnInit {
  imageId: string | null = null; // Récupéré seulement à partir de l'URL
  imageUrl: string | null = null; // Contiendra l'URL de l'image
  errorMessage: string | null = null; // Gère les messages d'erreur
  copySuccessMessage: string | null = null;
  darkmod: boolean = false; // Définit l'état du mode sombre

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private darkModeService: DarkModeService
  ) {}

  ngOnInit() {
    // Souscrire aux changements de mode sombre
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.darkmod = isDarkMode;
    });
    // Obtenez l'imageId à partir des paramètres de route
    this.route.paramMap.subscribe((params) => {
      this.imageId = params.get('imageId'); // Récupère l'imageId depuis l'URL
      if (this.imageId) {
        this.fetchImage(this.imageId); // Récupérer l'image si une imageId est présente
      } else {
        this.handleFallback(); // Gestion de fallback si aucune imageId n'est trouvée
      }
    });
  }

  // Récupère les données de l'image en fonction de l'imageId
  fetchImage(imageId: string) {
    const apiUrl = `${environment.apiUrl}/download/${imageId}`; // Remplacez par votre endpoint API
    this.http.get<{ image: { url: string } }>(apiUrl).subscribe({
      next: (response) => {
        this.imageUrl = response.image.url; // Définit l'URL de l'image depuis la réponse
      },
      error: (error) => {
        console.error("Erreur lors de la récupération de l'image :", error);
        this.errorMessage =
          "Impossible de récupérer l'image. Veuillez réessayer plus tard."; // Gère l'erreur
      },
    });
  }

  // Gère la logique de fallback lorsqu'aucune imageId n'est trouvée
  handleFallback() {
    this.errorMessage =
      "Aucun ID d'image fourni. Veuillez d'abord télécharger une image."; // Définit un message d'erreur
  }
  downloadImage() {
    if (this.imageUrl) {
      this.http.get(this.imageUrl, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.setAttribute('download', 'image.png'); // Customize filename if needed
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url); // Clean up after download
        },
        error: (error) => {
          console.error('Error downloading image:', error);
          this.errorMessage =
            'Failed to download image. Please try again later.';
        },
      });
    }
  }

  copyWebsiteUrl() {
    const websiteUrl = window.location.href;
    navigator.clipboard.writeText(websiteUrl).then(
      () => {
        this.copySuccessMessage = 'Website URL copied to clipboard!';
        setTimeout(() => (this.copySuccessMessage = null), 3000); // Remove the message after 3 seconds
      },
      (err) => {
        console.error('Failed to copy URL: ', err);
      }
    );
  }
}
