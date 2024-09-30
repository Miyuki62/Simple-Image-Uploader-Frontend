import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Router } from '@angular/router';
import { DarkModeService } from '../dark-mode.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnInit {
  file: File | null = null; // Stockage du fichier sélectionné
  isUploading: boolean = false; // Indicateur de statut d'upload
  isDragging: boolean = false; // Indicateur de drag & drop
  errorMessage: string | null = null; // Message d'erreur en cas de problème
  darkmod: boolean = false; // Indicateur du mode sombre
  uploadProgress: number = 0; // Progression de l'upload
  uploadComplete: boolean = false; // Statut de complétion de l'upload

  @ViewChild('fileInput', { static: true }) fileInput!: ElementRef; // Référence à l'input fichier

  constructor(
    private http: HttpClient,
    private darkModeService: DarkModeService,
    private router: Router
  ) {}

  ngOnInit() {
    // Souscrire aux changements de mode sombre
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.darkmod = isDarkMode;
    });
  }

  // Gestion des événements de drag over
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  // Gestion des événements de drag leave
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  // Gestion de l'événement de drop
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length === 1) {
      this.validateFile(files[0]);
    } else {
      this.errorMessage = 'Please drop only one file at a time.';
    }
  }

  // Sélection d'un fichier via l'input file
  onSelect(event: any) {
    const file = event.target.files?.[0] || null;
    if (file) {
      this.validateFile(file);
    }
  }

  // Validation du fichier avant l'upload
  validateFile(file: File) {
    this.resetState();

    // Vérifier le type de fichier
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      this.errorMessage =
        'Invalid file type. Please upload a JPG, PNG, or GIF.';
      return;
    }

    // Vérifier la taille du fichier (limite à 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      this.errorMessage =
        'File size exceeds 2MB limit. Please select a smaller file.';
      return;
    }

    this.file = file;
    this.uploadFile();
  }

  // Réinitialisation de l'état du composant
  resetState() {
    this.uploadProgress = 0;
    this.uploadComplete = false;
    this.errorMessage = null;
  }

  // Méthode pour uploader le fichier
  uploadFile() {
    if (!this.file) {
      this.errorMessage = 'No file selected';
      return;
    }

    this.isUploading = true;
    const formData = new FormData();
    formData.append('file', this.file);

    this.http
      .post(`${environment.apiUrl}/upload`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            this.uploadProgress = Math.round(
              (100 * event.loaded) / event.total
            );
          } else if (event.type === HttpEventType.Response) {
            this.isUploading = false;
            const imageId = event.body?.imageId;
            if (imageId) {
              this.navigateToImage(imageId);
            }
          }
        },
        error: () => {
          this.errorMessage = 'Upload failed. Please try again.';
          this.isUploading = false;
        },
      });
  }

  // Navigation après upload réussi
  navigateToImage(imageId: string) {
    this.router.navigate(['/download', imageId]);
  }
}
