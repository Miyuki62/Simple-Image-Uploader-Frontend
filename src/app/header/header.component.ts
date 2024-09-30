import { Component } from '@angular/core';
import { DarkModeService } from '../dark-mode.service'; // Importez le service

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  darkmod: boolean = false;

  constructor(private darkModeService: DarkModeService) {
    this.darkModeService.darkMode$.subscribe((isDarkMode) => {
      this.darkmod = isDarkMode;
    });
  }

  toggleDarkMode() {
    this.darkModeService.toggleDarkMode();
  }
}

// app.component dark mode
// if (container) {
//   container.style.background = '#212936';
// }
// if (dragarea) {
//   dragarea.style.border = '2px dashed #4D5562';
// }
// if (dragheadertext) {
//   dragheadertext.style.color = '#F9FAFBCC';
// }
// if (dragsupport) {
//   dragsupport.style.color = '#F9FAFBCC';
// }
// this.darkmod = true;
