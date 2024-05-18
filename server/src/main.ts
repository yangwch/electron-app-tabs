const { app, BrowserWindow, BaseWindow, WebContentsView } = require('electron')

const path = require('node:path')

const createWindow = () => {

  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL('http://localhost:5555')
  // const win = new BaseWindow({ width: 800, height: 400 })

  // const view1 = new WebContentsView()
  // win.contentView.addChildView(view1)
  // view1.webContents.loadURL('http://localhost:5555')
  // view1.setBounds({ x: 0, y: 0, width: 400, height: 400 })

  // const view2 = new WebContentsView()
  // win.contentView.addChildView(view2)
  // view2.webContents.loadURL('http://localhost:5555/page')
  // view2.setBounds({ x: 400, y: 0, width: 400, height: 400 })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})