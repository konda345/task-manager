import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Recipe, RecipeResponse } from '../types';

const fetchRecipes = async (search?: string): Promise<Recipe[]> => {
  let url = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
  
  if (search && search.trim()) {
    url += encodeURIComponent(search.trim());
  } else {
    url += 'chicken';
  }
  
  const response = await axios.get<RecipeResponse>(url);
  return response.data.meals || [];
};

export const useRecipes = (search?: string) => {
  return useQuery({
    queryKey: ['recipes', search],
    queryFn: () => fetchRecipes(search),
    staleTime: 1000 * 60 * 10,
  });
};

export const useRecipeIngredients = (recipe: Recipe): string[] => {
  const ingredients: string[] = [];
  
  for (let i = 1; i <= 20; i++) {
    const ingredient = recipe[`strIngredient${i}`];
    const measure = recipe[`strMeasure${i}`];
    
    if (ingredient && ingredient.trim()) {
      const fullIngredient = measure && measure.trim() 
        ? `${measure.trim()} ${ingredient.trim()}`
        : ingredient.trim();
      ingredients.push(fullIngredient);
    }
  }
  
  return ingredients;
};