import { Component, computed, inject, signal } from '@angular/core';
import { GifsListComponent } from "../../components/gifs-list/gifs-list.component";
import { GifsService } from '../../services/gifs.service';
import { Gif } from '../../interfaces/gif.interface';
import { GifMapper } from '../../mapper/gif.mapper';

@Component({
  selector: 'app-search-page',
  imports: [GifsListComponent],
  templateUrl: './search-page.component.html',
})
export default class SearchPageComponent {

  gifs = signal<Gif[]>([]);

  gifService = inject(GifsService)

  onSearch(query: string): void {

    this.gifService.searchGifs(query)
      .subscribe((resp) => {
        this.gifs.set(resp);

      })

  }

}
