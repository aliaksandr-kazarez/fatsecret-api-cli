import axios, { AxiosInstance } from 'axios';
import { 
  FatSecretConfig, 
  AccessTokenResponse, 
  FoodSearchResponse, 
  FoodDetails,
  DiaryDay,
  NutritionGoals 
} from '../types/fatsecret.js';

export class FatSecretService {
  private config: FatSecretConfig;
  private apiClient: AxiosInstance;
  
  constructor(config: FatSecretConfig) {
    this.config = config;
    this.apiClient = axios.create({
      baseURL: 'https://platform.fatsecret.com/rest/server.api',
      timeout: 10000,
    });
  }

  /**
   * Get OAuth2 access token using client credentials
   */
  async authenticate(): Promise<void> {
    try {
      const credentials = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
      
      const response = await axios.post('https://oauth.fatsecret.com/connect/token', 
        'grant_type=client_credentials&scope=basic',
        {
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      const tokenData: AccessTokenResponse = response.data;
      this.config.accessToken = tokenData.access_token;
      this.config.tokenType = tokenData.token_type;
      this.config.expiresIn = tokenData.expires_in;
      this.config.tokenExpiresAt = Date.now() + (tokenData.expires_in * 1000);

      // Update API client with auth header
      this.apiClient.defaults.headers.common['Authorization'] = `${tokenData.token_type} ${tokenData.access_token}`;
      
    } catch (error) {
      throw new Error(`Authentication failed: ${error}`);
    }
  }

  /**
   * Check if token is expired and refresh if necessary
   */
  private async ensureValidToken(): Promise<void> {
    if (!this.config.accessToken || !this.config.tokenExpiresAt) {
      await this.authenticate();
      return;
    }

    // Check if token expires in the next 5 minutes
    if (Date.now() > (this.config.tokenExpiresAt - 300000)) {
      await this.authenticate();
    }
  }

  /**
   * Search for foods
   */
  async searchFoods(query: string, maxResults: number = 20): Promise<FoodSearchResponse> {
    await this.ensureValidToken();
    
    try {
      const response = await this.apiClient.post('', null, {
        params: {
          method: 'foods.search',
          search_expression: query,
          max_results: maxResults,
          format: 'json'
        }
      });

      return response.data;
    } catch (error) {
      throw new Error(`Food search failed: ${error}`);
    }
  }

  /**
   * Get detailed information about a specific food
   */
  async getFoodDetails(foodId: string): Promise<FoodDetails> {
    await this.ensureValidToken();
    
    try {
      const response = await this.apiClient.post('', null, {
        params: {
          method: 'food.get.v4',
          food_id: foodId,
          format: 'json'
        }
      });

      return response.data.food;
    } catch (error) {
      throw new Error(`Failed to get food details: ${error}`);
    }
  }

  /**
   * Get autocomplete suggestions (requires Premier subscription)
   */
  async getAutocompleteSuggestions(query: string): Promise<string[]> {
    await this.ensureValidToken();
    
    try {
      const response = await this.apiClient.post('', null, {
        params: {
          method: 'foods.autocomplete',
          expression: query,
          format: 'json'
        }
      });

      return response.data.suggestions?.suggestion || [];
    } catch (error) {
      // Fallback to regular search if autocomplete is not available
      const searchResponse = await this.searchFoods(query, 10);
      return searchResponse.foods?.food?.map(food => food.food_name) || [];
    }
  }

  /**
   * Create a profile for a user (for food diary functionality)
   * Note: This requires 3-legged OAuth, which is more complex for CLI
   * For now, we'll simulate local storage
   */
  async createLocalProfile(userId: string): Promise<void> {
    // This would normally require 3-legged OAuth
    // For CLI purposes, we'll store data locally
    console.log(`Creating local profile for user: ${userId}`);
  }

  /**
   * Get today's diary entries (simulated for basic OAuth)
   */
  async getTodaysDiary(): Promise<DiaryDay> {
    const today = new Date();
    const dateInt = parseInt(today.getFullYear().toString() + 
                            (today.getMonth() + 1).toString().padStart(2, '0') + 
                            today.getDate().toString().padStart(2, '0'));

    // For basic OAuth2, we can't access user profiles
    // This would require 3-legged OAuth for real user data
    return {
      date_int: dateInt,
      food_entries: { food_entry: [] },
      nutritional_totals: {
        calories: 0,
        carbohydrate: 0,
        protein: 0,
        fat: 0
      }
    };
  }

  /**
   * Add food entry to diary (simulated for basic OAuth)
   */
  async addFoodToDiary(
    foodId: string, 
    servingId: string, 
    numberOfUnits: number, 
    meal: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ): Promise<void> {
    // This would require 3-legged OAuth for real implementation
    console.log(`Adding food ${foodId} to ${meal} (${numberOfUnits} servings)`);
    
    // For demonstration, we'll store this locally or just log it
    const entry = {
      food_id: foodId,
      serving_id: servingId,
      number_of_units: numberOfUnits.toString(),
      meal: meal,
      timestamp: new Date().toISOString()
    };

    // In a real app, this would be sent to the API with user auth
    console.log('Food entry added:', entry);
  }

  /**
   * Get nutrition goals (default values for demo)
   */
  getNutritionGoals(): NutritionGoals {
    return {
      calories: 2000,
      protein: 150, // grams
      carbs: 250,   // grams
      fat: 65       // grams
    };
  }

  /**
   * Check if service is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.config.accessToken && 
           !!this.config.tokenExpiresAt && 
           Date.now() < this.config.tokenExpiresAt;
  }
}