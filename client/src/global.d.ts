declare global {
  interface Window {
    api: {
      openTabPage: (
        url: string,
        layout: { left: number; top: number; width: number; height: number },
        group: string,
      ) => void;

      closeTabPage: (group: string) => void;

      activeTabPage: (group: string) => void;

      resizeTabPage: (layout: {
        left: number;
        top: number;
        width: number;
        height: number;
      }) => void;
    };
  }
}

export {};
