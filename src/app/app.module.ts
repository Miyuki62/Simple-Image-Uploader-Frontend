import { NgModule } from '@angular/core';
import {
  BrowserModule,
  provideClientHydration,
} from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoaderComponent } from './loader/loader.component';
import { DownloadComponent } from './download/download.component';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, LoaderComponent, DownloadComponent, UploadComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [provideClientHydration(), provideHttpClient(withFetch())],
  bootstrap: [AppComponent],
})
export class AppModule {}
