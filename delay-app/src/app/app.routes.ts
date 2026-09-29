import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Config } from './pages/config/config';

export const routes: Routes = [
    { path: '', component: Homepage},
    { path: 'config', component: Config}
];
