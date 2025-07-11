// implement react context provider for services
import React, { createContext, useContext } from "react";

export interface ServiceProvider {
}

export const ServiceContext = createContext<ServiceProvider | null>(null);

export function ServiceProvider({ children, service }: { children: React.ReactNode, service: ServiceProvider }): React.ReactNode {
  return <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>;
}
