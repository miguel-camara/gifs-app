import { HttpClient } from '@angular/common/http';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environments/environment';
import { GiphyResponse } from '../interfaces/giphy.intefaces';
import { Gif } from '../interfaces/gif.interface';
import { GifMapper } from '../mapper/gif.mapper';
import { map, tap } from 'rxjs';

const GIF_KEY = 'gifs';

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


  constructor() {
    this.loadTrendingGifs();
  }

  private http = inject(HttpClient);

  loadTrendingGifs() {
    this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/trending`, {
      params: {
        api_key: environment.giphyApiKey,
        limit: 20,
      }

    }).subscribe((resp) => {
      const gifs = GifMapper.mapGiphyItemsToGifArray(resp.data);
      this.trendingGifs.set(gifs);

    })
  }

  searchGifs(query: string) {
    return this.http.get<GiphyResponse>(`${environment.giphyUrl}/gifs/search`, {
      params: {
        api_key: environment.giphyApiKey,
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
