import { Router } from 'express';
import { FatSecretAPI } from '../services/FatSecretAPI.js';

const router = Router();

// Middleware to check authentication
const requireAuth = (req: any, res: any, next: any) => {
  if (!req.session.accessToken || !req.session.accessTokenSecret) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

// Search for foods
router.get('/foods/search', requireAuth, async (req: any, res: any) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const results = await fatSecretAPI.searchFoods(
      q,
      req.session.accessToken,
      req.session.accessTokenSecret
    );
    
    res.json({ foods: results });
  } catch (error) {
    console.error('Food search error:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Get food details
router.get('/foods/:foodId', requireAuth, async (req: any, res: any) => {
  try {
    const { foodId } = req.params;
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const food = await fatSecretAPI.getFoodDetails(
      foodId,
      req.session.accessToken,
      req.session.accessTokenSecret
    );
    
    res.json({ food });
  } catch (error) {
    console.error('Get food details error:', error);
    res.status(500).json({ error: 'Failed to get food details' });
  }
});

// Get diary entries for a specific date
router.get('/diary/:date', requireAuth, async (req: any, res: any) => {
  try {
    const { date } = req.params;
    
    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD' });
    }
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const entries = await fatSecretAPI.getDiaryEntries(
      date,
      req.session.accessToken,
      req.session.accessTokenSecret
    );
    
    res.json({ entries });
  } catch (error) {
    console.error('Get diary entries error:', error);
    res.status(500).json({ error: 'Failed to get diary entries' });
  }
});

// Get today's diary entries
router.get('/diary', requireAuth, async (req: any, res: any) => {
  try {
    const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const entries = await fatSecretAPI.getDiaryEntries(
      today,
      req.session.accessToken,
      req.session.accessTokenSecret
    );
    
    res.json({ entries, date: today });
  } catch (error) {
    console.error('Get today diary entries error:', error);
    res.status(500).json({ error: 'Failed to get today diary entries' });
  }
});

// Add food to diary
router.post('/diary', requireAuth, async (req: any, res: any) => {
  try {
    const { foodId, servingId, servingAmount, date } = req.body;
    
    if (!foodId || !servingId || !servingAmount) {
      return res.status(400).json({ 
        error: 'foodId, servingId, and servingAmount are required' 
      });
    }
    
    const entryDate = date || new Date().toISOString().split('T')[0];
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    await fatSecretAPI.addFoodToDiary(
      foodId,
      servingId,
      servingAmount,
      entryDate,
      req.session.accessToken,
      req.session.accessTokenSecret
    );
    
    res.json({ success: true, message: 'Food added to diary' });
  } catch (error) {
    console.error('Add food to diary error:', error);
    res.status(500).json({ error: 'Failed to add food to diary' });
  }
});

export { router as apiRoutes };