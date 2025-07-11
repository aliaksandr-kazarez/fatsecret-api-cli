import axios, { AxiosResponse } from 'axios';
import crypto from 'crypto-js';

interface FatSecretConfig {
  consumerKey: string;
  consumerSecret: string;
}

interface OAuthTokens {
  oauthToken: string;
  oauthTokenSecret: string;
}

interface FoodSearchResult {
  food_id: string;
  food_name: string;
  food_description: string;
  brand_name?: string;
}

interface FoodSearchResponse {
  foods: {
    food: FoodSearchResult[];
  };
}

interface FoodEntry {
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

export class FatSecretAPI {
  private baseURL = 'https://platform.fatsecret.com/rest/server.api';
  private consumerKey: string;
  private consumerSecret: string;

  constructor(config: FatSecretConfig) {
    this.consumerKey = config.consumerKey;
    this.consumerSecret = config.consumerSecret;
  }

  private generateOAuthSignature(
    method: string,
    url: string,
    parameters: Record<string, string>,
    tokenSecret: string = ''
  ): string {
    const sortedParams = Object.keys(parameters)
      .sort()
      .map(key => `${key}=${encodeURIComponent(parameters[key])}`)
      .join('&');

    const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(this.consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
    
    return crypto.HmacSHA1(baseString, signingKey).toString(crypto.enc.Base64);
  }

  private generateNonce(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private generateTimestamp(): string {
    return Math.floor(Date.now() / 1000).toString();
  }

  // Step 1: Get request token
  async getRequestToken(): Promise<OAuthTokens> {
    const timestamp = this.generateTimestamp();
    const nonce = this.generateNonce();
    
    const parameters: Record<string, string> = {
      oauth_consumer_key: this.consumerKey,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
      oauth_callback: 'http://localhost:3000/auth/callback'
    };

    const signature = this.generateOAuthSignature('GET', this.baseURL, parameters);
    parameters['oauth_signature'] = signature;

    const queryString = Object.keys(parameters)
      .map(key => `${key}=${encodeURIComponent(parameters[key])}`)
      .join('&');

    try {
      const response = await axios.get(`${this.baseURL}?${queryString}`);
      const responseData = new URLSearchParams(response.data);
      
      return {
        oauthToken: responseData.get('oauth_token') || '',
        oauthTokenSecret: responseData.get('oauth_token_secret') || ''
      };
    } catch (error) {
      throw new Error('Failed to get request token');
    }
  }

  // Step 2: Get access token
  async getAccessToken(requestToken: string, requestTokenSecret: string, verifier: string): Promise<OAuthTokens> {
    const timestamp = this.generateTimestamp();
    const nonce = this.generateNonce();
    
    const parameters: Record<string, string> = {
      oauth_consumer_key: this.consumerKey,
      oauth_token: requestToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0',
      oauth_verifier: verifier
    };

    const signature = this.generateOAuthSignature('GET', this.baseURL, parameters, requestTokenSecret);
    parameters['oauth_signature'] = signature;

    const queryString = Object.keys(parameters)
      .map(key => `${key}=${encodeURIComponent(parameters[key])}`)
      .join('&');

    try {
      const response = await axios.get(`${this.baseURL}?${queryString}`);
      const responseData = new URLSearchParams(response.data);
      
      return {
        oauthToken: responseData.get('oauth_token') || '',
        oauthTokenSecret: responseData.get('oauth_token_secret') || ''
      };
    } catch (error) {
      throw new Error('Failed to get access token');
    }
  }

  // Make authenticated API call
  private async makeAuthenticatedCall(
    method: string,
    params: Record<string, string>,
    oauthToken: string,
    oauthTokenSecret: string
  ): Promise<any> {
    const timestamp = this.generateTimestamp();
    const nonce = this.generateNonce();
    
    const parameters: Record<string, string> = {
      ...params,
      oauth_consumer_key: this.consumerKey,
      oauth_token: oauthToken,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_nonce: nonce,
      oauth_version: '1.0'
    };

    const signature = this.generateOAuthSignature('GET', this.baseURL, parameters, oauthTokenSecret);
    parameters['oauth_signature'] = signature;

    const queryString = Object.keys(parameters)
      .map(key => `${key}=${encodeURIComponent(parameters[key])}`)
      .join('&');

    try {
      const response = await axios.get(`${this.baseURL}?${queryString}`);
      return response.data;
    } catch (error) {
      throw new Error(`API call failed: ${(error as Error).message}`);
    }
  }

  // Search for foods
  async searchFoods(query: string, oauthToken: string, oauthTokenSecret: string): Promise<FoodSearchResult[]> {
    const params = {
      method: 'foods.search',
      search_expression: query,
      format: 'json'
    };

    try {
      const response = await this.makeAuthenticatedCall('GET', params, oauthToken, oauthTokenSecret);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (data.foods && data.foods.food) {
        return Array.isArray(data.foods.food) ? data.foods.food : [data.foods.food];
      }
      return [];
    } catch (error) {
      throw new Error(`Food search failed: ${(error as Error).message}`);
    }
  }

  // Get food details
  async getFoodDetails(foodId: string, oauthToken: string, oauthTokenSecret: string): Promise<FoodEntry> {
    const params = {
      method: 'food.get',
      food_id: foodId,
      format: 'json'
    };

    try {
      const response = await this.makeAuthenticatedCall('GET', params, oauthToken, oauthTokenSecret);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      return data.food;
    } catch (error) {
      throw new Error(`Failed to get food details: ${(error as Error).message}`);
    }
  }

  // Get today's diary entries
  async getDiaryEntries(date: string, oauthToken: string, oauthTokenSecret: string): Promise<DiaryEntry[]> {
    const params = {
      method: 'food_entries.get',
      date: date,
      format: 'json'
    };

    try {
      const response = await this.makeAuthenticatedCall('GET', params, oauthToken, oauthTokenSecret);
      const data = typeof response === 'string' ? JSON.parse(response) : response;
      
      if (data.food_entries && data.food_entries.food_entry) {
        return Array.isArray(data.food_entries.food_entry) 
          ? data.food_entries.food_entry 
          : [data.food_entries.food_entry];
      }
      return [];
    } catch (error) {
      throw new Error(`Failed to get diary entries: ${(error as Error).message}`);
    }
  }

  // Add food to diary
  async addFoodToDiary(
    foodId: string,
    servingId: string,
    servingAmount: string,
    date: string,
    oauthToken: string,
    oauthTokenSecret: string
  ): Promise<void> {
    const params = {
      method: 'food_entry.create',
      food_id: foodId,
      serving_id: servingId,
      serving_amount: servingAmount,
      date: date,
      format: 'json'
    };

    try {
      await this.makeAuthenticatedCall('GET', params, oauthToken, oauthTokenSecret);
    } catch (error) {
      throw new Error(`Failed to add food to diary: ${(error as Error).message}`);
    }
  }
}