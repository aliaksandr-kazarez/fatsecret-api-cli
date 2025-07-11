import { Router } from 'express';
import { FatSecretAPI } from '../services/FatSecretAPI.js';

const router = Router();

// Step 1: Initiate OAuth flow
router.get('/login', async (req, res) => {
  try {
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const tokens = await fatSecretAPI.getRequestToken();
    
    // Store request token in session
    req.session.requestToken = tokens.oauthToken;
    req.session.requestTokenSecret = tokens.oauthTokenSecret;
    
    // Redirect to FatSecret authorization URL
    const authUrl = `https://www.fatsecret.com/oauth/authorize?oauth_token=${tokens.oauthToken}`;
    res.redirect(authUrl);
  } catch (error) {
    console.error('OAuth login error:', error);
    res.status(500).json({ error: 'Failed to initiate OAuth flow' });
  }
});

// Step 2: Handle OAuth callback
router.get('/callback', async (req, res) => {
  try {
    const { oauth_token, oauth_verifier } = req.query;
    
    if (!oauth_token || !oauth_verifier) {
      return res.status(400).json({ error: 'Missing OAuth parameters' });
    }
    
    if (!req.session.requestToken || !req.session.requestTokenSecret) {
      return res.status(400).json({ error: 'Missing request token in session' });
    }
    
    const fatSecretAPI = req.fatSecretAPI as FatSecretAPI;
    const accessTokens = await fatSecretAPI.getAccessToken(
      req.session.requestToken,
      req.session.requestTokenSecret,
      oauth_verifier as string
    );
    
    // Store access tokens in session
    req.session.accessToken = accessTokens.oauthToken;
    req.session.accessTokenSecret = accessTokens.oauthTokenSecret;
    
    // Clear request tokens
    delete req.session.requestToken;
    delete req.session.requestTokenSecret;
    
    // Redirect to main app
    res.redirect('/');
  } catch (error) {
    console.error('OAuth callback error:', error);
    res.status(500).json({ error: 'Failed to complete OAuth flow' });
  }
});

// Check authentication status
router.get('/status', (req, res) => {
  const isAuthenticated = !!(req.session.accessToken && req.session.accessTokenSecret);
  res.json({ authenticated: isAuthenticated });
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ error: 'Failed to logout' });
    }
    res.json({ success: true });
  });
});

export { router as authRoutes };