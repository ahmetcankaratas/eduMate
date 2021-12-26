import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tanitim',
  templateUrl: './tanitim.page.html',
  styleUrls: ['./tanitim.page.scss'],
})
export class TanitimPage implements OnInit {

  constructor(private router: Router) { }

  navigate(){
    this.router.navigate(['/detail'])
  }
  
  ngOnInit() {
  }

}
