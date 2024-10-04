declare global {
  interface NodeModule {
    hot?: {
      accept(dependencies?: string | string[], callback?: (updatedModule?: any) => void): void;
    };
  }
}

export {};
