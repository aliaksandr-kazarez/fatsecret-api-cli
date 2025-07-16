export interface FatSecretConfig {
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  tokenType?: string;
  expiresIn?: number;
  tokenExpiresAt?: number;
}

export interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export interface Food {
  food_id: string;
  food_name: string;
  food_type: string;
  brand_name?: string;
  food_description: string;
  food_url: string;
}

export interface FoodSearchResponse {
  foods: {
    food: Food[];
    max_results: string;
    page_number: string;
    total_results: string;
  };
}

export interface NutritionInfo {
  calories: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
}

export interface FoodDetails {
  food_id: string;
  food_name: string;
  brand_name?: string;
  food_type: string;
  food_description: string;
  food_url: string;
  servings: {
    serving: Serving[];
  };
}

export interface Serving {
  serving_id: string;
  serving_description: string;
  serving_url: string;
  metric_serving_amount: string;
  metric_serving_unit: string;
  number_of_units: string;
  measurement_description: string;
  calories: string;
  carbohydrate: string;
  protein: string;
  fat: string;
  saturated_fat?: string;
  polyunsaturated_fat?: string;
  monounsaturated_fat?: string;
  cholesterol?: string;
  sodium?: string;
  potassium?: string;
  fiber?: string;
  sugar?: string;
  vitamin_a?: string;
  vitamin_c?: string;
  calcium?: string;
  iron?: string;
}

export interface DiaryEntry {
  food_entry_id: string;
  food_id: string;
  food_entry_name: string;
  serving_id: string;
  number_of_units: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date_int: number;
}

export interface DiaryDay {
  date_int: number;
  food_entries?: {
    food_entry: DiaryEntry[];
  };
  nutritional_totals?: NutritionInfo;
}

export interface NutritionGoals {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface UserProfile {
  user_id: string;
  oauth_token: string;
  oauth_token_secret: string;
}