import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { GifsListComponent } from '@gifs/components/gifs-list/gifs-list.component';
import { GifsService } from '@gifs/services/gifs.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-gif-history.component',
  imports: [GifsListComponent],
  templateUrl: './gif-history.component.html',
})
export default class GifHistoryComponent {

  gifService = inject(GifsService)

  query = toSignal(inject(ActivatedRoute).params.pipe(map(params => params['query'])))

  gifsByKey = computed(() => this.gifService.getHistoryGifs(this.query()))
}
