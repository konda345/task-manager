import React, { useState } from 'react';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Search, ChefHat } from 'lucide-react';
import { useRecipes, useRecipeIngredients } from '../hooks/useRecipes';
import { Recipe } from '../types';

const RecipeList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data: recipes, isLoading, error } = useRecipes(debouncedSearch);


  const RecipeDetails: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const ingredients = useRecipeIngredients(recipe);

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={recipe.strMealThumb}
            alt={recipe.strMeal}
            className="w-full md:w-64 h-64 object-cover rounded-lg"
          />
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">Ingredients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {ingredients.map((ingredient, index) => (
                  <Badge key={index} variant="secondary" className="justify-start">
                    {ingredient}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-semibold mb-3">Instructions</h3>
          <div className="prose max-w-none">
            {recipe.strInstructions.split('\n').map((step, index) => (
              <p key={index} className="mb-2 text-sm leading-relaxed">
                {step.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading recipes: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <ChefHat className="w-8 h-8 mr-3" />
            Recipe Collection
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover and explore delicious recipes from around the world
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Loading recipes...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {!isLoading && recipes && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recipes ({recipes.length})</span>
              {debouncedSearch && (
                <Badge variant="outline">
                  Search: "{debouncedSearch}"
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recipes.length === 0 ? (
              <div className="text-center py-8">
                <ChefHat className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  No recipes found. Try searching for something else.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-20">Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-32">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recipes.map((recipe) => (
                    <TableRow key={recipe.idMeal}>
                      <TableCell>
                        <img
                          src={recipe.strMealThumb}
                          alt={recipe.strMeal}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <h4 className="font-medium">{recipe.strMeal}</h4>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {recipe.strInstructions.substring(0, 100)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          View Recipe
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recipe Details Dialog */}
      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <ChefHat className="w-5 h-5 mr-2" />
              {selectedRecipe?.strMeal}
            </DialogTitle>
          </DialogHeader>
          {selectedRecipe && <RecipeDetails recipe={selectedRecipe} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecipeList;