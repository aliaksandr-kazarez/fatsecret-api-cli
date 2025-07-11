import { FatSecretAPI } from '../services/FatSecretAPI.js';

declare global {
  namespace Express {
    interface Request {
      fatSecretAPI: FatSecretAPI;
      session: {
        requestToken?: string;
        requestTokenSecret?: string;
        accessToken?: string;
        accessTokenSecret?: string;
        destroy: (callback: (err: any) => void) => void;
      };
    }
  }
}

export {};