import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subscription, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CardComponent } from '../../other/card-component/card-component';
import { TvmazeService, Show } from '../../services/tvmaze-service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent],
  templateUrl: './home-component.html',
  styleUrl: './home-component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  query = '';
  shows: Show[] = [];

  loading = false;
  error = '';

  private searchSubscription?: Subscription;
  private requestId = 0;

  constructor(
    private tvmazeService: TvmazeService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadInitialShows();
  }

  loadInitialShows(): void {
    const currentRequest = ++this.requestId;

    this.searchSubscription?.unsubscribe();

    this.loading = true;
    this.error = '';

    this.searchSubscription = this.tvmazeService.getShows().subscribe({
      next: (shows: Show[]) => {
        if (currentRequest !== this.requestId) return;

        this.shows = [...shows];
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        if (currentRequest !== this.requestId) return;

        console.error(error);

        this.error = 'Failed to load shows.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  search(): void {
    const searchQuery = this.query.trim();
    const currentRequest = ++this.requestId;

    this.searchSubscription?.unsubscribe();

    this.loading = true;
    this.error = '';

    let request: Observable<Show[]>;

    if (searchQuery.length > 0) {
      request = this.tvmazeService.searchShows(searchQuery).pipe(
        map(results => results.map(result => result.show))
      );
    } else {
      request = this.tvmazeService.getShows();
    }

    this.searchSubscription = request.subscribe({
      next: (shows: Show[]) => {
        if (currentRequest !== this.requestId) return;

        this.shows = [...shows];
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error: unknown) => {
        if (currentRequest !== this.requestId) return;

        console.error(error);

        this.error = 'Failed to load shows.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}