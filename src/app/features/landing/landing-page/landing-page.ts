import { Component } from '@angular/core';
import { Navbar } from '../../../core/layout/navbar/navbar';
import { LabGrid } from '../../labs/lab-grid/lab-grid';

@Component({
  selector: 'app-landing-page',
  imports: [Navbar, LabGrid],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {

}
