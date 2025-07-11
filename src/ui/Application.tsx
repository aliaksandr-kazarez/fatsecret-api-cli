import { Router } from './Router.js';
import { ServiceProvider } from './ServiceProvider.js';

export interface ApplicationProps { }

export function Application({ }: ApplicationProps) {
  // Expose updateState function globally
  return (
    <ServiceProvider service={{}}>
      <Router />
    </ServiceProvider>
  );
}

