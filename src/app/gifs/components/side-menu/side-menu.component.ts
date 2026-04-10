import { Component } from '@angular/core';
import { SideMenuHeaderComponent } from './side-menu-header/side-menu-header.component';
import { SideMenuOptionComponent } from './side-menu-option/side-menu-option.component';

@Component({
  selector: 'side-menu',
  imports: [SideMenuHeaderComponent, SideMenuOptionComponent],
  templateUrl: './side-menu.component.html',
})
export class SideMenuComponent { }
