import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { Gif } from '@gifs/interfaces/gif.interface';
import { GiphyResponse } from '@gifs/interfaces/giphy.intefaces';
import { GifMapper } from '@gifs/mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = environment.gifKey;

const loadFromLocalStorage = () => {
  const gifLoadFromLocalStorage = localStorage.getItem(GIF_KEY) ?? '[]';
  const gifs = JSON.parse(gifLoadFromLocalStorage);

  return gifs;
}

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  saveGifsLocalStorage = effect(() => {
    const historyString = JSON.stringify(this.searchHistory());
    localStorage.setItem(GIF_KEY, historyString);
  })

  trendingGifs = signal<Gif[]>([]);
  searchHistory = signal<Record<string, Gif[]>>(loadFromLocalStorage());

  searchHistoryKeys = computed(() => Object.keys(this.searchHistory())
  );

  trendingGifGroup = computed<Gif[][]>(() => {
    const group = [];
    for (let i = 0; i < this.trendingGifs().length; i += 3) {
      group.push(this.trendingGifs().slice(i, i + 3));

    }
    return group;
  })


  constructor() {
    this.loadTrendingGifs();
  }

  private http = inject(HttpClient);
  private trendingPage = signal(0);
  trendingGifsLoading = signal(false);

  loadTrendingGifs() {

    if (this.trendingGifsLoading()) return;

    this.trendingGifsLoading.set(true);

    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: GIF_KEY,
        limit: 20,
        offset: this.trendingPage() * 20,
      }

    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.update(currenGifs => [...currenGifs, ...gifs]);
      this.trendingGifsLoading.set(false);
      this.trendingPage.update(val => val + 1);
    })
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: GIF_KEY,
        limit: 20,
        q: query
      }
    }).pipe(
      map(({ data }) => data),
      map((items) => GifMapper.mapGiphyItemsToGifArray(items)),
      tap(items => {
        this.searchHistory.update((history) => ({
          ...history,
          [query.toLocaleLowerCase()]: items
        }))
      })
    );
  }

  getHistoryGifs(query: string): Gif[] {
    return this.searchHistory()[query] ?? [];
  }
}
