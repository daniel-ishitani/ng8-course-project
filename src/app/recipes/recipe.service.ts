import { EventEmitter, Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable()
export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'test',
      'test',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeXQM1IW8u5DGFfJs6dGg7zJKTt52WmVj_Uub2aYpoYJDDXUC',
      [
        new Ingredient('Meat', 1),
        new Ingredient('Fries', 20)
      ]
     ),
    new Recipe(
      'anotherTest',
      'test',
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeXQM1IW8u5DGFfJs6dGg7zJKTt52WmVj_Uub2aYpoYJDDXUC',
      [
        new Ingredient('wine', 1)
      ]
    )
  ];

  constructor(private slService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }
}