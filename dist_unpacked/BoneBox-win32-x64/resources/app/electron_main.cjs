const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

// Configure logging for auto-updater
log.transports.file.level = "debug";
autoUpdater.logger = log;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'website/icon_32.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    },
    title: "BoneBox"
  });

  // Load the app: from GitHub Pages for the best experience, or from file as fallback
  const version = app.getVersion();
  const prodUrl = 'https://bonesisuseful.github.io/bone-box/';
  
  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:3000/bone-box/').catch(() => {
      // Fallback if dev server is not running
      mainWindow.loadURL(prodUrl);
    });
  } else {
    // Loaded live site in the app, but fallback locally if no internet
    mainWindow.loadURL(prodUrl).catch(() => {
      mainWindow.loadFile(path.join(__dirname, 'index.html'), { query: { v: version } });
    });
  }

  ipcMain.handle('get-app-version', () => version);

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  // Remove the menu bar
  mainWindow.setMenuBarVisibility(false);
}

// Register custom protocol
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('bonebox', process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient('bonebox');
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();

      // Find the protocol link in commandLine
      const url = commandLine.find((arg) => arg.startsWith('bonebox://'));
      if (url) {
        handleDeepLink(url);
      }
    }
  });

  app.on('ready', () => {
    createWindow();

    // Check if app was opened with a protocol link (Windows/Linux)
    const url = process.argv.find(arg => arg.startsWith('bonebox://'));
    if (url) {
      // Handle it after window is ready
      setTimeout(() => handleDeepLink(url), 1000);
    }

    // Check for updates after a short delay
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 3000);
  });
}

function handleDeepLink(url) {
  const code = url.replace('bonebox://join/', '').split('?')[0];
  if (code && mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (window.boneboxParty) {
        window.boneboxParty.join("${code}");
      } else {
        // Retry if party.js isn't ready
        setTimeout(() => {
           if (window.boneboxParty) window.boneboxParty.join("${code}");
        }, 2000);
      }
    `);
  }
}

app.on('open-url', (event, url) => {
  event.preventDefault();
  handleDeepLink(url);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Auto-updater events
autoUpdater.on('update-available', (info) => {
  log.info('Update available. Version:', info.version);
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`console.log('Update available: v${info.version}. Downloading in background...')`);
  }
});

autoUpdater.on('update-downloaded', (info) => {
  log.info('Update downloaded. Version:', info.version);
  if (mainWindow) {
    mainWindow.webContents.executeJavaScript(`
      if (confirm('A new version of BoneBox (v${info.version}) is ready! Would you like to restart and install it now?')) {
        window.close(); // This will trigger the install on quit
      }
    `);
  }
});

autoUpdater.on('before-quit-for-update', () => {
  log.info('App is quitting for update...');
});

autoUpdater.on('error', (err) => {
  log.error('Error in auto-updater: ' + err);
});
