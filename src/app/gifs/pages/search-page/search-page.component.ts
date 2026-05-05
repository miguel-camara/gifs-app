import { Component, inject, signal } from '@angular/core';
import { GifsListComponent } from '@gifs/components/gifs-list/gifs-list.component';
import { Gif } from '@gifs/interfaces/gif.interface';
import { GifsService } from '@gifs/services/gifs.service';


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
