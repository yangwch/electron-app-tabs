declare global {
  interface Window {
    openTabPage: (
      url: string,
      layout: { left: number; top: number; width: number; height: number },
    ) => void;
  }
}

export {};