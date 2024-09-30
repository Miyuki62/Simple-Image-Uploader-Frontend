import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeSubject: BehaviorSubject<boolean>; // Declare the property
  darkMode$; // Declare the observable property without initialization

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    // Initialize darkModeSubject in the constructor after fetching the stored value
    const initialMode = this.getStoredDarkMode();
    this.darkModeSubject = new BehaviorSubject<boolean>(initialMode); // Initialize the subject
    this.darkMode$ = this.darkModeSubject.asObservable(); // Initialize the observable after subject

    // Only update the body class in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.updateBodyClass(initialMode);
    }
  }

  toggleDarkMode() {
    const currentMode = this.darkModeSubject.value;
    const newMode = !currentMode;

    // Update the BehaviorSubject
    this.darkModeSubject.next(newMode);

    // Save the new state to localStorage if available
    this.saveToLocalStorage(newMode);

    // Update the body class based on the new mode in the browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.updateBodyClass(newMode);
    }
  }

  private updateBodyClass(isDarkMode: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  private getStoredDarkMode(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false; // Default value if localStorage is not available
  }

  private saveToLocalStorage(isDarkMode: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }
  }
}
