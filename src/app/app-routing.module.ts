import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LaunchDetailComponent } from './launch-detail/launch-detail.component';
import { LaunchesComponent } from './launches/launches.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'launches' },
  { path: 'launches', component: LaunchesComponent },
  { path: 'launch/:id', component: LaunchDetailComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
