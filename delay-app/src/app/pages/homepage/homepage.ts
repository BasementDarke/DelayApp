import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './homepage.css',
})
export class Homepage {
  private router = inject(Router)

  onClick(){
    this.router.navigateByUrl("/config")
  }
}
