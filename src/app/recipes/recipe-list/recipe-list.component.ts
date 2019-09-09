import { Component, OnInit } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [
    new Recipe('test', 'test', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeXQM1IW8u5DGFfJs6dGg7zJKTt52WmVj_Uub2aYpoYJDDXUC')
  ];

  constructor() { }

  ngOnInit() {
  }

}
