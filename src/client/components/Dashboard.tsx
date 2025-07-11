import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface DiaryEntry {
  food_entry_id: string;
  food_id: string;
  food_name: string;
  serving_description: string;
  number_of_units: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
}

interface NutritionStats {
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export const Dashboard: React.FC = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [stats, setStats] = useState<NutritionStats>({
    totalCalories: 0,
    totalCarbs: 0,
    totalProtein: 0,
    totalFat: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/diary');
      const diaryEntries = response.data.entries || [];
      setEntries(diaryEntries);
      calculateStats(diaryEntries);
    } catch (error) {
      setError('Failed to load diary entries');
      console.error('Error fetching diary entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (entries: DiaryEntry[]) => {
    const stats = entries.reduce((acc, entry) => {
      acc.totalCalories += parseFloat(entry.calories) || 0;
      acc.totalCarbs += parseFloat(entry.carbohydrate) || 0;
      acc.totalProtein += parseFloat(entry.protein) || 0;
      acc.totalFat += parseFloat(entry.fat) || 0;
      return acc;
    }, {
      totalCalories: 0,
      totalCarbs: 0,
      totalProtein: 0,
      totalFat: 0
    });
    setStats(stats);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading your diary...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div style={{ color: '#f44336', marginBottom: '1rem' }}>{error}</div>
        <button 
          onClick={fetchDiaryEntries}
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>
        📅 {formatDate(new Date())}
      </h2>

      {/* Nutrition Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🔥 Calories</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#e91e63' }}>
            {Math.round(stats.totalCalories)}
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🍞 Carbs</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#ff9800' }}>
            {Math.round(stats.totalCarbs)}g
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🥩 Protein</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#4caf50' }}>
            {Math.round(stats.totalProtein)}g
          </p>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>🥑 Fat</h3>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#2196f3' }}>
            {Math.round(stats.totalFat)}g
          </p>
        </div>
      </div>

      {/* Food Entries */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}>
        <h3 style={{ 
          margin: 0,
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderBottom: '1px solid #e9ecef'
        }}>
          🍽️ Today's Food Entries
        </h3>
        
        {entries.length === 0 ? (
          <div style={{ 
            padding: '2rem',
            textAlign: 'center',
            color: '#666'
          }}>
            <p>No food entries for today yet.</p>
            <p>Click "Add Food" to start tracking your meals!</p>
          </div>
        ) : (
          <div style={{ padding: '1rem' }}>
            {entries.map((entry) => (
              <div 
                key={entry.food_entry_id}
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #e9ecef',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
                    {entry.food_name}
                  </h4>
                  <p style={{ margin: 0, color: '#666', fontSize: '0.9rem' }}>
                    {entry.serving_description} × {entry.number_of_units}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.9rem',
                  color: '#666'
                }}>
                  <span>{Math.round(parseFloat(entry.calories))} cal</span>
                  <span>{Math.round(parseFloat(entry.carbohydrate))}g carbs</span>
                  <span>{Math.round(parseFloat(entry.protein))}g protein</span>
                  <span>{Math.round(parseFloat(entry.fat))}g fat</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};