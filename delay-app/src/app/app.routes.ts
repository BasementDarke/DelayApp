import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Config } from './pages/config/config';
import { Search } from './pages/search/search';

export const routes: Routes = [
    { path: '', component: Homepage},
    { path: 'config', component: Config},
    { path: 'search', component: Search}
];
