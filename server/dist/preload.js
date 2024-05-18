const { contextBridge } = require("electron");
contextBridge.exposeInMainWorld("tabsApi", {
    openTabPage: (url, layout) => {
        console.log("openTabPage", url, layout);
    },
});
//# sourceMappingURL=preload.js.map