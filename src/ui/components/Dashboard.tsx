import React, { useState, useEffect } from 'react';
import { Box, Text, Newline } from 'ink';
import { FatSecretService } from '../../services/index.js';
import { DiaryDay, NutritionGoals } from '../../types/fatsecret.js';

interface DashboardProps {
  service: FatSecretService;
  onAddFood: () => void;
  onBack: () => void;
}

export function Dashboard({ service }: DashboardProps): React.JSX.Element {
  const [diary, setDiary] = useState<DiaryDay | null>(null);
  const [goals, setGoals] = useState<NutritionGoals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [diaryData, nutritionGoals] = await Promise.all([
        service.getTodaysDiary(),
        Promise.resolve(service.getNutritionGoals())
      ]);
      
      setDiary(diaryData);
      setGoals(nutritionGoals);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateInt: number): string => {
    const dateStr = dateInt.toString();
    const year = dateStr.slice(0, 4);
    const month = dateStr.slice(4, 6);
    const day = dateStr.slice(6, 8);
    return `${month}/${day}/${year}`;
  };

  const calculateProgress = (current: number, goal: number): number => {
    return Math.round((current / goal) * 100);
  };

  const renderProgressBar = (current: number, goal: number, width: number = 20): string => {
    const progress = Math.min(current / goal, 1);
    const filled = Math.round(progress * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  if (loading) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color="yellow">⏳ Loading dashboard...</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text color="blue" bold>
        📊 Food Diary Dashboard
      </Text>
      <Newline />

      {diary && (
        <>
          <Text color="green" bold>
            📅 Today - {formatDate(diary.date_int)}
          </Text>
          <Newline />

          {/* Nutrition Summary */}
          {goals && diary.nutritional_totals && (
            <Box flexDirection="column">
              <Text color="cyan" bold>🎯 Nutrition Goals Progress</Text>
              <Newline />
              
              <Box flexDirection="column" marginLeft={2}>
                <Text>
                  🔥 Calories: {diary.nutritional_totals.calories} / {goals.calories} 
                  ({calculateProgress(diary.nutritional_totals.calories, goals.calories)}%)
                </Text>
                <Text color="dim">
                  {renderProgressBar(diary.nutritional_totals.calories, goals.calories)}
                </Text>
                
                <Text>
                  🥩 Protein: {diary.nutritional_totals.protein}g / {goals.protein}g 
                  ({calculateProgress(diary.nutritional_totals.protein, goals.protein)}%)
                </Text>
                <Text color="dim">
                  {renderProgressBar(diary.nutritional_totals.protein, goals.protein)}
                </Text>
                
                <Text>
                  🌾 Carbs: {diary.nutritional_totals.carbohydrate}g / {goals.carbs}g 
                  ({calculateProgress(diary.nutritional_totals.carbohydrate, goals.carbs)}%)
                </Text>
                <Text color="dim">
                  {renderProgressBar(diary.nutritional_totals.carbohydrate, goals.carbs)}
                </Text>
                
                <Text>
                  🥑 Fat: {diary.nutritional_totals.fat}g / {goals.fat}g 
                  ({calculateProgress(diary.nutritional_totals.fat, goals.fat)}%)
                </Text>
                <Text color="dim">
                  {renderProgressBar(diary.nutritional_totals.fat, goals.fat)}
                </Text>
              </Box>
              <Newline />
            </Box>
          )}

          {/* Food Entries */}
          <Text color="cyan" bold>🍽️ Today's Meals</Text>
          <Newline />
          
          {diary.food_entries && diary.food_entries.food_entry.length > 0 ? (
            <Box flexDirection="column" marginLeft={2}>
              {diary.food_entries.food_entry.map((entry, index) => (
                <Text key={index}>
                  • {entry.food_entry_name} ({entry.number_of_units} serving) - {entry.meal}
                </Text>
              ))}
            </Box>
          ) : (
            <Box flexDirection="column" marginLeft={2}>
              <Text color="dim">No food entries for today</Text>
              <Text color="green">Add your first meal to get started! 🍎</Text>
            </Box>
          )}
          <Newline />
        </>
      )}

      <Box flexDirection="column">
        <Text color="blue" bold>🍎 Quick Actions</Text>
        <Newline />
        <Text color="green">Press A to Add Food</Text>
        <Text color="yellow">Press R to Refresh</Text>
        <Text color="red">Press ESC to go back</Text>
      </Box>
    </Box>
  );
}