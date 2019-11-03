// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const path = require('path')
const {ElectronWindowBase} = require("./public/mainWidget/electronWindow.js");
const {File} = require("./public/file/file.js");
// 引入ipc交互模块
const ipc = require("electron").ipcMain;
// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let testWindow 

function createWindow () {
  // Create the browser window.
  let jsarray = [];
  let jquery = (new File("./public/js/pourIntoJs.js")).getFileData();
  // 写入jquery
  jsarray.push(jquery);

  // let go = (new File("./bet.js")).getFileData();
  // jsarray.push(go);

  testWindow = new ElectronWindowBase({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      webSecurity: false
    }
  },[],null);
  testWindow.loadFile("index.html");



  mainWindow = new ElectronWindowBase({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration:true,
      webSecurity: false
    }
  },jsarray,null);

  // and load the index.html of the app.
  mainWindow.loadURL("https://www.635-288.com")

  ipc.on("message",(event,reply)=>{
    mainWindow.getWindowWidget().webContents.executeJavaScript(reply);
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
 
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
