const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("api", {
    openTabPage: (url, layout, group) => {
        console.log("openTabPage", url, layout, group);
        ipcRenderer.invoke("openTabPage", url, layout, group);
    },
    closeTabPage: (id) => {
        ipcRenderer.invoke("closeTabPage", id);
    },
    activeTabPage: (id) => {
        ipcRenderer.invoke("activeTabPage", id);
    },
    resizeTabPage: (layout) => {
        ipcRenderer.invoke("resizeTabPage", layout);
    },
});
//# sourceMappingURL=preload.js.map