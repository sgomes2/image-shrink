const { app, BrowserWindow, Menu } = require("electron");

const isDev = process.env.NODE_ENV !== "production" ? true : false;

const isMac = process.platform === "darwin" ? true : false;

let mainWindow;
let aboutWindow;

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Image Shrink",
    width: 800,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
  });

  mainWindow.loadFile(`${__dirname}/app/index.html`);
}

function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    title: "About Image Shrink",
    width: 300,
    height: 300,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: false,
  });

  aboutWindow.loadFile(`${__dirname}/app/about.html`);
}

app.on("ready", () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  mainWindow.on("ready", () => (mainWindow = null));
});

const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  { role: "fileMenu" },
  ...(!isMac
    ? [
        {
          label: app.name,
          submenu: [{ label: "About", click: createAboutWindow }],
        },
      ]
    : []),
  ...(isDev
    ? [
        {
          label: "Developer",
          submenu: [
            { role: "reload" },
            { role: "forcereload" },
            { type: "separator" },
            { role: "toggledevtools" },
          ],
        },
      ]
    : []),
];

app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with cmd + q
  if (!isMac) {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
