import { Injectable } from '@angular/core';
import { Anime } from '../interfaces/anime';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GenerateAnimeService {
  private apiUrl = environment.apiUrl + '/generate-anime';

  constructor(private http: HttpClient) {}

  getRandomAnime(count: number): Observable<Anime[]> {
    return this.http.get<Anime[]>(`${this.apiUrl}/${count}`);
  }
}
