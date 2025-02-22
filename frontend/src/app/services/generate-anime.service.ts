import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GenerateAnimeService {
  private apiUrl = 'http://localhost:3000/api/generate-anime';

  constructor(private http: HttpClient) {}

  getRandomAnime(count: number): Observable<Anime[]> {
    return this.http.get<Anime[]>(`${this.apiUrl}/${count}`);
  }
}
