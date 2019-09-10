import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    // new Recipe(
    //   'test',
    //   'test',
    //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeXQM1IW8u5DGFfJs6dGg7zJKTt52WmVj_Uub2aYpoYJDDXUC',
    //   [
    //     new Ingredient('Meat', 1),
    //     new Ingredient('Fries', 20)
    //   ]
    //   ),
    // new Recipe(
    //   'anotherTest',
    //   'test',
    //   'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGeXQM1IW8u5DGFfJs6dGg7zJKTt52WmVj_Uub2aYpoYJDDXUC',
    //   [
    //     new Ingredient('wine', 1)
    //   ]
    // )
  ];

  constructor(private slService: ShoppingListService) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.emitChangedRecipes();
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.emitChangedRecipes();
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.emitChangedRecipes();
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.emitChangedRecipes();
  }

  emitChangedRecipes() {
    this.recipesChanged.next(this.recipes.slice());
  }
}