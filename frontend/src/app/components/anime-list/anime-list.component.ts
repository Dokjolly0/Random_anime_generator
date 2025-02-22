import { Component, OnInit } from '@angular/core';
import { Anime } from '../../interfaces/anime';
import { GenerateAnimeService } from '../../services/generate-anime.service';

@Component({
  selector: 'app-anime-list',
  templateUrl: './anime-list.component.html',
  styleUrls: ['./anime-list.component.css'],
})
export class AnimeListComponent implements OnInit {
  animeList: Anime[] = [];
  animeCount: number = 1;
  availableGenres: string[] = [];
  selectedGenres: string[] = []; // Array per i generi selezionati
  sortOrder: string = '';

  constructor(private generateAnimeService: GenerateAnimeService) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() {
    const genresSet = new Set<string>();

    // Ciclare tutti gli anime per raccogliere i generi
    this.animeList.forEach((anime) => {
      anime.genres.forEach((genre) => genresSet.add(genre));
    });

    // Convertire il Set in Array e ordinare alfabeticamente
    this.availableGenres = Array.from(genresSet).sort();
  }

  searchAnime() {
    this.generateAnimeService.getRandomAnime(this.animeCount).subscribe((data) => {
      this.animeList = data;
      this.loadGenres(); // Aggiorna la lista dei generi
      this.applyFilters();
    });
  }

  isGenreSelected(genre: string): boolean {
    return this.selectedGenres.includes(genre);
  }

  onGenreChange(genre: string, event: any) {
    if (event.target.checked) {
      this.selectedGenres.push(genre);
    } else {
      this.selectedGenres = this.selectedGenres.filter((g) => g !== genre);
    }
  }

  applyFilters() {
    let filteredList = [...this.animeList];

    // Filtro per genere: se sono selezionati dei generi, filtra in base a quelli
    if (this.selectedGenres.length) {
      filteredList = filteredList.filter((anime) => anime.genres.some((genre) => this.selectedGenres.includes(genre)));
    }

    // Ordinamento
    if (this.sortOrder) {
      filteredList.sort((a, b) => {
        switch (this.sortOrder) {
          case 'rating_asc':
            return +a.rating < +b.rating ? -1 : 1;
          case 'rating_desc':
            return +a.rating > +b.rating ? -1 : 1;
          case 'year_asc':
            return +a.year < +b.year ? -1 : 1;
          case 'year_desc':
            return +a.year > +b.year ? -1 : 1;
          default:
            return 0;
        }
      });
    }

    this.animeList = filteredList;
  }
}
