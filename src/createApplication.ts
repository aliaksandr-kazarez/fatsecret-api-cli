import { render } from 'ink';
import React from 'react';
import { Application } from './ui/index.js';


export interface Application {
  halt: () => Promise<void>;
}

export async function createApplication(): Promise<Application> {
  render(React.createElement(Application, { }), {
    stdout: process.stdout,
    stdin: process.stdin
  });

  return {
    halt: async () => {
      
    },
  };
} 