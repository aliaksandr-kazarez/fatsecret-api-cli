import React from 'react';
import { Box, Text, Newline } from 'ink';
import { FatSecretService } from '../../services/index.js';
import { Food, FoodDetails } from '../../types/fatsecret.js';

interface AddToDiaryProps {
  service: FatSecretService;
  food: Food;
  foodDetails?: FoodDetails;
  onAdded: () => void;
  onCancel: () => void;
}

export function AddToDiary({ 
  service, 
  food, 
  foodDetails, 
  onAdded
}: AddToDiaryProps): React.JSX.Element {
  const selectedServing = foodDetails?.servings.serving[0] || null;
  const servingAmount = 1;
  const selectedMeal = 'lunch';

  // TODO: Implement keyboard navigation for interactive flow
  // For now, showing a simplified confirmation screen and auto-adding to diary

  React.useEffect(() => {
    // Auto-add to diary for demo purposes
    const addToDiary = async () => {
      try {
        await service.addFoodToDiary(
          food.food_id,
          selectedServing?.serving_id || '0',
          servingAmount,
          selectedMeal
        );
        setTimeout(() => onAdded(), 2000); // Show for 2 seconds then proceed
      } catch (error) {
        console.error('Failed to add food to diary:', error);
        setTimeout(() => onAdded(), 2000);
      }
    };
    addToDiary();
  }, [service, food.food_id, selectedServing?.serving_id, servingAmount, selectedMeal, onAdded]);

  const calculateNutrition = () => {
    if (!selectedServing) return null;
    
    return {
      calories: Math.round(parseFloat(selectedServing.calories) * servingAmount),
      protein: Math.round(parseFloat(selectedServing.protein) * servingAmount * 10) / 10,
      carbs: Math.round(parseFloat(selectedServing.carbohydrate) * servingAmount * 10) / 10,
      fat: Math.round(parseFloat(selectedServing.fat) * servingAmount * 10) / 10,
    };
  };

  const nutrition = calculateNutrition();

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        ➕ Add to Food Diary
      </Text>
      <Newline />

      <Text color="green" bold>
        {food.food_name}
        {food.brand_name && ` (${food.brand_name})`}
      </Text>
      <Newline />

            {/* Simplified confirmation screen - interactive features will be added later */}
      <Box flexDirection="column">
        <Text color="cyan" bold>Food Selected for Addition:</Text>
        <Newline />
        
        <Text color="green" bold>Summary:</Text>
        <Text>Food: {food.food_name}</Text>
        <Text>Serving: {selectedServing?.serving_description || 'Standard serving'}</Text>
        <Text>Amount: {servingAmount} serving{servingAmount !== 1 ? 's' : ''}</Text>
        <Text>Meal: {selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)}</Text>
        <Newline />
        
        {nutrition && (
          <Box flexDirection="column">
            <Text color="yellow" bold>Total Nutrition:</Text>
            <Text>🔥 Calories: {nutrition.calories}</Text>
            <Text>🥩 Protein: {nutrition.protein}g</Text>
            <Text>🌾 Carbs: {nutrition.carbs}g</Text>
            <Text>🥑 Fat: {nutrition.fat}g</Text>
          </Box>
        )}
        <Newline />
        
        <Box flexDirection="column">
          <Text color="green" bold>Adding to diary... (automatic for demo)</Text>
          <Text color="blue">Full interactive version coming soon!</Text>
        </Box>
      </Box>

      <Newline />
      <Text color="green">This food will be added to your diary automatically for demonstration.</Text>
      <Text color="blue">In the full version, you would be able to select serving sizes, amounts, and meals.</Text>
    </Box>
  );
}