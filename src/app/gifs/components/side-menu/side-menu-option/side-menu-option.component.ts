import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";

interface MenuOption {
  icon: string;
  label: string;
  router: string;
  subLabel: string;
}

@Component({
  selector: 'side-menu-option',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-menu-option.component.html',
})
export class SideMenuOptionComponent {
  menuOption: MenuOption[] = [
    {
      icon: 'fa-solid fa-chart-line',
      label: 'Trending',
      router: '/dashboard/trending',
      subLabel: 'Gifs Populares'
    },
    {
      icon: 'fa-solid fa-magnifying-glass',
      label: 'Buscarcar',
      router: '/dashboard/search',
      subLabel: 'Buscar Gifs'
    }
  ]
}
