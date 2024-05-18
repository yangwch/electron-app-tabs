const { contextBridge } = require("electron");

contextBridge.exposeInMainWorld("tabsApi", {
  openTabPage: (
    url: string,
    layout: { left: number; top: number; width: number; height: number },
  ) => {
    console.log("openTabPage", url, layout)
  },
});
