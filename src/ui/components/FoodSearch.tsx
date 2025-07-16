import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import { FatSecretService } from '../../services/index.js';
import { Food, FoodDetails } from '../../types/fatsecret.js';

interface FoodSearchProps {
  service: FatSecretService;
  onSelectFood: (food: Food, details?: FoodDetails) => void;
  onBack: () => void;
}

export function FoodSearch({ service }: FoodSearchProps): React.JSX.Element {
  const [searchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Food[]>([]);
  const [selectedFood] = useState<Food | null>(null);
  const [foodDetails] = useState<FoodDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<'search' | 'results' | 'details'>('search');

  useEffect(() => {
    // Simulated typeahead search with debouncing
    if (searchQuery.length >= 2) {
      const timeoutId = setTimeout(() => {
        performSearch();
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setMode('search');
      return undefined;
    }
  }, [searchQuery]);

  const performSearch = async () => {
    if (searchQuery.length < 2) return;

    setLoading(true);
    try {
      const response = await service.searchFoods(searchQuery, 10);
      const foods = response.foods?.food || [];
      setSearchResults(foods);
      setSelectedIndex(0);
      setMode('results');
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // const selectFood = async (food: Food) => {
  //   setSelectedFood(food);
  //   setLoading(true);
  //   try {
  //     const details = await service.getFoodDetails(food.food_id);
  //     setFoodDetails(details);
  //     setMode('details');
  //   } catch (error) {
  //     console.error('Failed to get food details:', error);
  //     // Continue without details
  //     setMode('details');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // TODO: Implement keyboard navigation for interactive search
  // Search functionality will be enhanced with navigation in a future iteration

  const renderNutritionInfo = (serving: any) => {
    return (
      <Box flexDirection="column" marginLeft={2}>
        <Text>🔥 Calories: {serving.calories}</Text>
        <Text>🥩 Protein: {serving.protein}g</Text>
        <Text>🌾 Carbs: {serving.carbohydrate}g</Text>
        <Text>🥑 Fat: {serving.fat}g</Text>
        {serving.fiber && <Text>🌾 Fiber: {serving.fiber}g</Text>}
        {serving.sugar && <Text>🍯 Sugar: {serving.sugar}g</Text>}
        {serving.sodium && <Text>🧂 Sodium: {serving.sodium}mg</Text>}
      </Box>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        🔍 Food Search
      </Text>
      <Newline />

      {mode === 'search' && (
        <Box flexDirection="column">
          <Text>Type to search for foods (minimum 2 characters):</Text>
          <Text color="cyan">Search: {searchQuery}_</Text>
          <Newline />
          <Text color="gray">Start typing to see results...</Text>
          <Newline />
          <Text color="red">Press ESC to go back</Text>
        </Box>
      )}

      {mode === 'results' && (
        <Box flexDirection="column">
          <Text>Search: {searchQuery}</Text>
          <Text color="green">Found {searchResults.length} results:</Text>
          <Newline />
          
          {loading ? (
            <Text color="yellow">⏳ Searching...</Text>
          ) : (
            <Box flexDirection="row">
              {/* Search Results */}
              <Box flexDirection="column" width="50%">
                <Text color="cyan" bold>🍎 Food Items</Text>
                                 {searchResults.map((food, index) => (
                   <Text 
                     key={food.food_id}
                     color={index === selectedIndex ? 'black' : 'white'}
                     {...(index === selectedIndex && { backgroundColor: 'green' })}
                   >
                     {index === selectedIndex ? '► ' : '  '}
                     {food.food_name}
                     {food.brand_name && ` (${food.brand_name})`}
                   </Text>
                 ))}
                <Newline />
                <Text color="gray">Use ↑↓ to navigate, Enter to select</Text>
              </Box>

              {/* Quick Preview */}
              <Box flexDirection="column" width="50%" marginLeft={2}>
                {searchResults[selectedIndex] && (
                  <>
                    <Text color="cyan" bold>📋 Quick Info</Text>
                    <Text>{searchResults[selectedIndex].food_name}</Text>
                    {searchResults[selectedIndex].brand_name && (
                      <Text color="dim">Brand: {searchResults[selectedIndex].brand_name}</Text>
                    )}
                    <Text color="dim">Type: {searchResults[selectedIndex].food_type}</Text>
                    <Newline />
                    <Text color="green">Press Enter for detailed nutrition info</Text>
                  </>
                )}
              </Box>
            </Box>
          )}
        </Box>
      )}

      {mode === 'details' && selectedFood && (
        <Box flexDirection="column">
          <Text color="green" bold>
            📊 Nutrition Details: {selectedFood.food_name}
          </Text>
          {selectedFood.brand_name && (
            <Text color="dim">Brand: {selectedFood.brand_name}</Text>
          )}
          <Newline />

          {loading ? (
            <Text color="yellow">⏳ Loading nutrition details...</Text>
          ) : foodDetails ? (
            <Box flexDirection="column">
              <Text color="cyan" bold>🍽️ Serving Options:</Text>
              <Newline />
              
              {foodDetails.servings.serving.slice(0, 3).map((serving, index) => (
                <Box key={serving.serving_id} flexDirection="column" marginBottom={1}>
                  <Text color="yellow" bold>
                    Serving {index + 1}: {serving.serving_description}
                  </Text>
                  {renderNutritionInfo(serving)}
                  <Newline />
                </Box>
              ))}

              <Box flexDirection="column">
                <Text color="blue" bold>Actions:</Text>
                <Text color="green">Press Enter to add this food to your diary</Text>
                <Text color="yellow">Press ESC to go back to search results</Text>
              </Box>
            </Box>
          ) : (
            <Box flexDirection="column">
              <Text color="red">Unable to load detailed nutrition information</Text>
              <Text color="green">Press Enter to add this food anyway</Text>
              <Text color="yellow">Press ESC to go back</Text>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}