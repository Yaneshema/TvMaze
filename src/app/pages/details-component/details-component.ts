import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

import { Subscription, of, forkJoin } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import { TvmazeService, Show, Episode } from '../../services/tvmaze-service';

interface EpisodeSeason {
  season: number;
  episodes: Episode[];
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './details-component.html',
  styleUrl: './details-component.css'
})
export class DetailsComponent implements OnInit, OnDestroy {

  show: Show | null = null;
  episodes: Episode[] = [];
  seasons: EpisodeSeason[] = [];

  loading = true;
  episodesLoading = true;
  error = '';
  episodesError = '';

  private subscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private tvmazeService: TvmazeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.route.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));

        this.show = null;
        this.episodes = [];
        this.seasons = [];

        this.loading = true;
        this.episodesLoading = true;

        this.error = '';
        this.episodesError = '';

        if (!Number.isInteger(id) || id <= 0) {
          this.loading = false;
          this.episodesLoading = false;
          this.error = 'Invalid show ID.';

          return of(null);
        }

        return forkJoin({
          show: this.tvmazeService.getShowById(id).pipe(
            catchError(error => {
              console.error('Show request failed:', error);
              this.error = 'Failed to load show details.';
              return of(null);
            })
          ),

          episodes: this.tvmazeService.getEpisodes(id).pipe(
            catchError(error => {
              console.error('Episodes request failed:', error);
              this.episodesError = 'Failed to load episodes.';
              return of([]);
            })
          )
        });
      })
    ).subscribe(result => {
      if (result) {
        this.show = result.show;
        this.episodes = result.episodes;

        this.groupEpisodesBySeason();

        this.loading = false;
        this.episodesLoading = false;
      }

      this.cdr.detectChanges();
    });
  }

  groupEpisodesBySeason(): void {
    const grouped = new Map<number, Episode[]>();

    for (const episode of this.episodes) {
      if (!grouped.has(episode.season)) {
        grouped.set(episode.season, []);
      }

      grouped.get(episode.season)!.push(episode);
    }

    this.seasons = Array.from(grouped.entries())
      .map(([season, episodes]) => ({
        season,
        episodes
      }))
      .sort((a, b) => a.season - b.season);
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}