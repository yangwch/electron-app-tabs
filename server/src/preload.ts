const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  openTabPage: (
    url: string,
    layout: { left: number; top: number; width: number; height: number },
    group: string,
  ) => {
    console.log("openTabPage", url, layout, group);
    ipcRenderer.invoke("openTabPage", url, layout, group);
  },

  closeTabPage: (id: string) => {
    ipcRenderer.invoke("closeTabPage", id);
  },

  activeTabPage: (id: string) => {
    ipcRenderer.invoke("activeTabPage", id);
  },

  resizeTabPage: (layout: {
    left: number;
    top: number;
    width: number;
    height: number;
  }) => {
    ipcRenderer.invoke("resizeTabPage", layout);
  },
});
