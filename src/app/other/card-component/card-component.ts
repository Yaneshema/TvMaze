
import { Component, Input, OnChanges, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Show } from '../../services/tvmaze-service';


@Component({
  selector: 'app-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './card-component.html',
  styleUrl: './card-component.css'
})

export class CardComponent implements OnChanges {
  @Input() shows: Show[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['shows']) {
      this.cdr.detectChanges();
    }
  }
}
