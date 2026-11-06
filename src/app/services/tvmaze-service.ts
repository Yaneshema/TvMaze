import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Show {
  id: number;
  name: string;
  genres: string[];
  status: string;
  premiered: string | null;
  ended: string | null;
  summary: string | null;
  image: {
    medium: string;
    original: string;
  } | null;
  rating: {
    average: number | null;
  };
  language: string;
  runtime: number | null;
  officialSite: string | null;
}

export interface Episode {
  id: number;
  name: string;
  season: number;
  number: number | null;
  airdate: string | null;
  runtime: number | null;
  summary: string | null;
  image: {
    medium: string;
    original: string;
  } | null;
}

export interface ShowSearchResult {
  score: number;
  show: Show;
}

@Injectable({
  providedIn: 'root'
})

export class TvmazeService {

  private apiUrl = 'https://api.tvmaze.com';

  constructor(private http: HttpClient) {}

  searchShows(query: string): Observable<ShowSearchResult[]> {
    return this.http.get<ShowSearchResult[]>(`${this.apiUrl}/search/shows?q=${encodeURIComponent(query)}`);
  }

  getShows(): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.apiUrl}/shows?page=0`);
  }

  getShowById(id: number): Observable<Show> {
    return this.http.get<Show>(`${this.apiUrl}/shows/${id}`);
  }

  getEpisodes(showId: number): Observable<Episode[]> {
    return this.http.get<Episode[]>(`${this.apiUrl}/shows/${showId}/episodes?specials=1`);
  }
}