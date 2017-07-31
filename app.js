/*
*   All product names, logos, and brands are property of their respective owners.
*   All company, product and service names used in this project are for identification purposes only.
*   Use of these names, logos, and brands does not imply endorsement.
*
*
*   Copyright 2017 MilanG-Ne <https://github.com/MilanG-Ne>
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at:
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
*/

const electron = require('electron');
const { app, BrowserWindow, globalShortcut } = electron;

const path = require('path');
const url = require('url');

const isOnline = require('is-online');

let loadWindow;
let mainWindow;

function createWindow() {
  loadWindow = new BrowserWindow({
    width: 250,
    height: 130,
    minWidth: 250,
    minHeight: 130,
    icon: path.join(__dirname, 'icons/drawtop.png'),
    frame: false,
    show: false
  });

  loadWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'load.html'),
    protocol: 'file:',
    slashes: true
  }));

  loadWindow.setMenu(null);
  loadWindow.isFocused(true);

  loadWindow.once('ready-to-show', () => loadWindow.show());

  isOnline().then(online => {
    if (online) { openMainWindow() }
    else { openHelpWindow() };
  });

  function openMainWindow() {
    const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
      width: width - 50,
      height: height - 50,
      minWidth: width - 50,
      minHeight: height - 50,
      icon: path.join(__dirname, 'icons/drawtop.png'),
      webPreferences: {
        sandbox: true,
        nodeIntegration: false
      },
      show: false
    });

    mainWindow.loadURL('https://www.draw.io/index.html?https=1&offline=0&mode=device&storage=device&splash=1&db=0&gapi=0&od=0&gh=0&browser=0&picker=0&analytics=0');
    mainWindow.setMenu(null);
    mainWindow.isFocused(true);

    globalShortcut.register('F11', () => {
      if (!mainWindow.isFullScreen()) {
        mainWindow.setFullScreen(true);
      } else {
        mainWindow.setFullScreen(false);
      };
    });

    mainWindow.once('ready-to-show', () => { loadWindow.close(); mainWindow.show(); });
    mainWindow.on('closed', () => { loadWindow = null; mainWindow = null; });
  };

  function openHelpWindow() {
    helpWindow = new BrowserWindow({
      width: 250,
      height: 130,
      minWidth: 250,
      minHeight: 130,
      icon: path.join(__dirname, 'icons/drawtop.png'),
      frame: false,
      show: false
    });

    helpWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'notLoaded.html'),
      protocol: 'file:',
      slashes: true
    }));

    helpWindow.setMenu(null);
    helpWindow.isFocused(true);

    globalShortcut.register('Escape', () => {
      helpWindow.close();
    });

    helpWindow.once('ready-to-show', () => { loadWindow.close(); helpWindow.show(); });
    helpWindow.on('closed', () => { loadWindow = null; helpWindow = null; });
  };

};

app.on('ready', createWindow);
app.on('will-quit', () => { globalShortcut.unregisterAll() });
app.on('window-all-closed', () => { if (process.platform !== 'darwin') { app.quit() } });
app.on('activate', () => { if (mainWindow === null) { createWindow() } });
