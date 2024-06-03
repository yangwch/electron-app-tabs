const {
  app,
  BrowserWindow,
  BaseWindow,
  WebContentsView,
  ipcMain,
} = require("electron");
const { isDev } = require('./utils/isDev')

const path = require("node:path");

const contentViews = new Map<string, any>();
let mainWindow: any = null;
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  if (isDev) {
    win.webContents.loadURL("http://localhost:5555");
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.webContents.loadFile("./dist/index.html");
  }
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
const setContentViewsVisible = (group: string) => {
  contentViews.forEach((view, key) => {
    if (key !== group) {
      view.setVisible(key === group);
    } else {
      view.setVisible(true);
    }
  });
};

const openTabPage = async (
  url: string,
  layout: { left: number; top: number; width: number; height: number },
  group: string,
) => {
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
ipcMain.handle(
  "openTabPage",
  async (
    event: any,
    url: string,
    layout: { left: number; top: number; width: number; height: number },
    group: string,
  ) => {
    await openTabPage(url, layout, group);
  },
);

ipcMain.handle("closeTabPage", async (event: any, group: string) => {
  if (contentViews.has(group)) {
    const view = contentViews.get(group);
    // view.setVisible(false);
    mainWindow.contentView.removeChildView(view);
    contentViews.delete(group);
  }
});

ipcMain.handle("activeTabPage", (event: any, group: string) => {
  setContentViewsVisible(group);
});

ipcMain.handle(
  "resizeTabPage",
  (
    event: any,
    layout: { left: number; top: number; width: number; height: number },
  ) => {
    contentViews.forEach(view => {
      view.setBounds({
        x: layout.left,
        y: layout.top,
        width: layout.width,
        height: layout.height,
      });
    });
  },
);

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
