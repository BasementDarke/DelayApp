import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css',
})
export class Homepage {
  private router = inject(Router)

  onClick(){
    console.log("Configure")
    this.router.navigateByUrl("/config")
  }
}
