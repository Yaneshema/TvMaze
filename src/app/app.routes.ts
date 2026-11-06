import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home-component/home-component';
import { DetailsComponent } from './pages/details-component/details-component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'details/:id', component: DetailsComponent},
  {path: '**', redirectTo: ''}
];