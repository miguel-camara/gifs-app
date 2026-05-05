
import { AfterViewInit, Component, ElementRef, inject, viewChild } from '@angular/core';
import { GifsService } from '@gifs/services/gifs.service';
import { ScrollStateService } from '@gifs/shared/scroll-state.service';

@Component({
  selector: 'app-trending-page',
  templateUrl: './trending-page.component.html',
})
export default class TrendingPageComponent implements AfterViewInit {

  scrollDivRef = viewChild<ElementRef>("groupDiv");
  scrollStateService = inject(ScrollStateService);

  gifs = inject(GifsService);

  ngAfterViewInit(): void {
    const scrollDiv = this.scrollDivRef()?.nativeElement

    if (!scrollDiv) return;

    scrollDiv.scrollTop = this.scrollStateService.trendingScrollState();
  }

  onScroll(e: Event) {
    const scrollDiv = this.scrollDivRef()?.nativeElement

    if (!scrollDiv) return;

    const scrollTop = scrollDiv.scrollTop;
    const clientHeight = scrollDiv.clientHeight;
    const scrollHeight = scrollDiv.scrollHeight;
    const scrollTotal = scrollTop + clientHeight + 300;
    const isAtBotto: boolean = scrollTotal >= scrollHeight;

    this.scrollStateService.trendingScrollState.set(scrollTop)

    if (isAtBotto) {
      this.gifs.loadTrendingGifs();
    }
  }
}
