import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar';

@Component({
  selector: 'app-admin-layout',
  imports: [SidebarComponent, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss',
})
export class AdminLayout {

}
