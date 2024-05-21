const { app, BrowserWindow, BaseWindow, WebContentsView, ipcMain, } = require("electron");
const path = require("node:path");
const contentViews = new Map();
let mainWindow = null;
const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    win.loadURL("http://localhost:5555");
    mainWindow = win;
    // const win = new BaseWindow({ width: 800, height: 400 })
    // const view1 = new WebContentsView()
    // win.contentView.addChildView(view1)
    // view1.webContents.loadURL('http://localhost:5555')
    // view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })
    // const view2 = new WebContentsView()
    // win.contentView.addChildView(view2)
    // view2.webContents.loadURL('http://localhost:5555/page')
    // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
};
const setContentViewsVisible = (group) => {
    contentViews.forEach((view, key) => {
        if (key !== group) {
            view.setVisible(key === group);
        }
        else {
            view.setVisible(true);
        }
    });
};
const openTabPage = async (url, layout, group) => {
    console.log("openTabPage on main", url, layout, group);
    if (!mainWindow) {
        return;
    }
    if (contentViews.has(group)) {
        const view = contentViews.get(group);
        console.log(view, view.webContents);
        setContentViewsVisible(group);
        if (view.webContents.getURL() !== url) {
            view.webContents.loadURL(url);
        }
        return;
    }
    const view = new WebContentsView();
    view.webContents.loadURL(url);
    view.setBounds({
        x: layout.left,
        y: layout.top,
        width: layout.width,
        height: layout.height,
    });
    mainWindow.contentView.addChildView(view);
    contentViews.set(group, view);
    setContentViewsVisible(group);
};
ipcMain.handle("openTabPage", async (event, url, layout, group) => {
    await openTabPage(url, layout, group);
});
ipcMain.handle("closeTabPage", async (event, group) => {
    if (contentViews.has(group)) {
        const view = contentViews.get(group);
        // view.setVisible(false);
        mainWindow.contentView.removeChildView(view);
        contentViews.delete(group);
    }
});
ipcMain.handle("activeTabPage", (event, group) => {
    setContentViewsVisible(group);
});
ipcMain.handle("resizeTabPage", (event, layout) => {
    contentViews.forEach(view => {
        view.setBounds({
            x: layout.left,
            y: layout.top,
            width: layout.width,
            height: layout.height,
        });
    });
});
app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
//# sourceMappingURL=main.js.map