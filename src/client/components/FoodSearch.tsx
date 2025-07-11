import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

interface FoodSearchResult {
  food_id: string;
  food_name: string;
  food_description: string;
  brand_name?: string;
}

interface FoodDetails {
  food_id: string;
  food_name: string;
  serving_description: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
}

interface FoodSearchProps {
  onFoodAdded: () => void;
}

export const FoodSearch: React.FC<FoodSearchProps> = ({ onFoodAdded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [servingAmount, setServingAmount] = useState('1');
  const [isAddingFood, setIsAddingFood] = useState(false);

  const debounce = useCallback((func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  }, []);

  const searchFoods = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/foods/search?q=${encodeURIComponent(query)}`);
      setSearchResults(response.data.foods || []);
    } catch (error) {
      setError('Failed to search foods');
      console.error('Food search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback(debounce(searchFoods, 300), [searchFoods]);

  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleFoodSelect = async (food: FoodSearchResult) => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/foods/${food.food_id}`);
      setSelectedFood(response.data.food);
    } catch (error) {
      setError('Failed to load food details');
      console.error('Food details error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    try {
      setIsAddingFood(true);
      setError(null);
      
      await api.post('/api/diary', {
        foodId: selectedFood.food_id,
        servingId: '1', // Default serving ID
        servingAmount: servingAmount,
        date: new Date().toISOString().split('T')[0]
      });

      onFoodAdded();
    } catch (error) {
      setError('Failed to add food to diary');
      console.error('Add food error:', error);
    } finally {
      setIsAddingFood(false);
    }
  };

  const calculateNutrition = (food: FoodDetails, amount: string) => {
    const multiplier = parseFloat(amount) || 1;
    return {
      calories: Math.round((parseFloat(food.calories) || 0) * multiplier),
      carbs: Math.round((parseFloat(food.carbohydrate) || 0) * multiplier),
      protein: Math.round((parseFloat(food.protein) || 0) * multiplier),
      fat: Math.round((parseFloat(food.fat) || 0) * multiplier)
    };
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        🔍 Add Food to Your Diary
      </h2>

      {/* Search Input */}
      <div style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search for foods (e.g., 'apple', 'chicken breast', 'pizza')..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.1rem',
            border: '2px solid #ddd',
            borderRadius: '8px',
            outline: 'none',
            transition: 'border-color 0.3s'
          }}
        />
      </div>

      {error && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#c62828',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        {/* Search Results */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1rem' }}>Search Results</h3>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxHeight: '600px',
            overflow: 'auto'
          }}>
            {loading && searchQuery.length >= 2 ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                Loading foods...
              </div>
            ) : searchResults.length === 0 && searchQuery.length >= 2 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                No foods found. Try a different search term.
              </div>
            ) : searchQuery.length < 2 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                Enter at least 2 characters to search for foods.
              </div>
            ) : (
              <div>
                {searchResults.map((food) => (
                  <div
                    key={food.food_id}
                    onClick={() => handleFoodSelect(food)}
                    style={{
                      padding: '1rem',
                      borderBottom: '1px solid #eee',
                      cursor: 'pointer',
                      backgroundColor: selectedFood?.food_id === food.food_id ? '#e3f2fd' : 'white',
                      transition: 'background-color 0.3s'
                    }}
                  >
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                      {food.food_name}
                    </h4>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                      {food.food_description}
                    </p>
                    {food.brand_name && (
                      <p style={{ margin: '0.25rem 0 0 0', color: '#999', fontSize: '0.8rem' }}>
                        Brand: {food.brand_name}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Nutrition Facts */}
        <div style={{ flex: 1 }}>
          <h3 style={{ marginBottom: '1rem' }}>Nutrition Facts</h3>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            padding: '1.5rem'
          }}>
            {selectedFood ? (
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>
                  {selectedFood.food_name}
                </h4>
                
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                    Serving Amount:
                  </label>
                  <input
                    type="number"
                    value={servingAmount}
                    onChange={(e) => setServingAmount(e.target.value)}
                    min="0.1"
                    step="0.1"
                    style={{
                      width: '100px',
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      marginRight: '0.5rem'
                    }}
                  />
                  <span style={{ color: '#666' }}>
                    × {selectedFood.serving_description}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  {(() => {
                    const nutrition = calculateNutrition(selectedFood, servingAmount);
                    return (
                      <div>
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          marginBottom: '0.5rem',
                          paddingBottom: '0.5rem',
                          borderBottom: '2px solid #333'
                        }}>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Calories</span>
                          <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {nutrition.calories}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Carbohydrates</span>
                          <span>{nutrition.carbs}g</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Protein</span>
                          <span>{nutrition.protein}g</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <span>Fat</span>
                          <span>{nutrition.fat}g</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <button
                  onClick={handleAddFood}
                  disabled={isAddingFood}
                  style={{
                    width: '100%',
                    backgroundColor: isAddingFood ? '#ccc' : '#4CAF50',
                    color: 'white',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '4px',
                    fontSize: '1rem',
                    cursor: isAddingFood ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  {isAddingFood ? 'Adding...' : 'Add to Diary'}
                </button>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#666', padding: '2rem' }}>
                <p>Select a food from the search results to view nutrition facts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};