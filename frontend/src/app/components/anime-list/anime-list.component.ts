import { Component, OnInit } from '@angular/core';
import { Anime } from '../../interfaces/anime';
import { GenerateAnimeService } from '../../services/generate-anime.service';

@Component({
  selector: 'app-anime-list',
  templateUrl: './anime-list.component.html',
  styleUrls: ['./anime-list.component.css'],
})
export class AnimeListComponent implements OnInit {
  animeLoaded: Anime[] = [];
  animeList: Anime[] = [];
  animeCount: number = 1;
  availableGenres: string[] = [];
  selectedGenres: string[] = [];
  sortOrder: string = '';
  isLoading: boolean = false;

  constructor(private generateAnimeService: GenerateAnimeService) {}

  ngOnInit(): void {
    this.loadGenres();
  }

  loadGenres() {
    const genresSet = new Set<string>();
    this.animeList.forEach((anime) => {
      anime.genres.forEach((genre) => genresSet.add(genre));
    });
    this.availableGenres = Array.from(genresSet).sort();
  }

  searchAnime() {
    this.isLoading = true;
    this.generateAnimeService.getRandomAnime(this.animeCount).subscribe(
      (data) => {
        this.animeList = data;
        this.animeLoaded = data;
        this.loadGenres();
        console.log('Anime caricati:', this.animeList);
        this.applyFilters();
        this.isLoading = false;
      },
      (error) => {
        console.error('Errore durante il caricamento degli anime:', error);
        this.isLoading = false;
      }
    );
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
    let filteredList = [...this.animeLoaded];

    if (this.selectedGenres.length) {
      filteredList = filteredList.filter((anime) => anime.genres.some((genre) => this.selectedGenres.includes(genre)));
    }

    if (this.sortOrder) {
      filteredList.sort((a, b) => {
        switch (this.sortOrder) {
          case 'rating_asc':
            return +a.rating - +b.rating;
          case 'rating_desc':
            return +b.rating - +a.rating;
          case 'year_asc':
            return +a.year - +b.year;
          case 'year_desc':
            return +b.year - +a.year;
          default:
            return 0;
        }
      });
    }

    this.animeList = filteredList;
  }

  clearFilters() {
    this.animeList = [...this.animeLoaded];
    this.selectedGenres = [];
    this.sortOrder = '';
    this.applyFilters();
  }
}
