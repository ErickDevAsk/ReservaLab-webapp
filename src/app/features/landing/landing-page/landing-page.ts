import { Component } from '@angular/core';
import { Navbar } from '../../../core/layout/navbar/navbar';
import { LabGrid } from '../../labs/lab-grid/lab-grid';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  imports: [Navbar, LabGrid, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage {
}
