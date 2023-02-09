const { app, BrowserWindow, ipcMain } = require( "electron" );
const path = require( "path" );
const url = require( "url" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );

let appWin;

//let menu = [{ label: 'Archivo', submenu: [{ label: 'Recargar', click() { reloadWindow() }}]}];

createWindow = () => {

    appWin = new BrowserWindow({ width: 800, height: 600, title: 'Avaya Help', resizable: false, center: true, webPreferences: { contextIsolation: false, nodeIntegration: true } });
    appWin.setIcon( 'src/assets/favicon.png' );
    appWin.loadURL( url.format({ pathname: path.join( __dirname, '/dist/index.html' ), protocol: 'file', slashes: true }));
    appWin.setMenu( null );
    appWin.on( "closed", () => appWin = null );
    //appWin.webContents.openDevTools();

    /*let menuPrincipal = Menu.buildFromTemplate( menu );
    appWin.setMenu( menuPrincipal );*/
}
app.on( "ready", createWindow );
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

//Comunicación entre procesos
//--------------------------------------------

ipcMain.on( 'openIt', ( event, args ) => openIt() );
ipcMain.on( 'openAvaya', ( event, args ) => openAvaya() );
ipcMain.on( 'checkAvayaInstall', ( event, args ) => checkAvayaInstall( event, args ) );
ipcMain.on( 'getDataOs', ( event, args ) => getDataOs( event, args ) );

/* Nueva ventana modal
------------------------------
*/
let openIt = () => {
    let modal = new BrowserWindow( { parent: appWin, modal: true, show: false, x: 400, y: 100, resizable: false, title: 'Avaya Help', webPreferences: { contextIsolation: false, nodeIntegration: true } } );
    modal.title = 'Avaya Help',
    modal.setIcon( 'src/assets/favicon.png' );
    modal.loadURL( `file://${ __dirname }/dist/index.html#/It` );
    modal.once( "ready-to-show", () => modal.show() );
    modal.setMenu( null );
    //modal.webContents.openDevTools();
};
let openAvaya = () => {
    let modal = new BrowserWindow( { parent: appWin, modal: true, show: false, x: 400, y: 100, resizable: false, title: 'Avaya Help', webPreferences: { contextIsolation: false, nodeIntegration: true } } );
    modal.setIcon( 'src/assets/favicon.png' );
    modal.loadURL( `file://${ __dirname }/dist/index.html#/Avaya` );
    modal.once( "ready-to-show", () => modal.show() );
    modal.setMenu( null );
    //modal.webContents.openDevTools();
};
/*
    Verificación de instalación de Avaya
    -----------------------------------
*/
let checkAvayaInstall = ( event, args ) => {
    if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya` ) ) {
        if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent` ) ) {
            if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5` ) ) {
                event.sender.send( 'checkAvayaInstall', { data: 'ok' } );
            }
        }
    }else {
        event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
    }
};
/*
    recopilación de datos OS
    -----------------------------------
*/
let getDataOs = ( event, args ) => {
    exec( 'wmic bios get serialnumber', ( error, stdout, stderr ) => {
        if( error ) event.sender.send( 'getDataOs', { data: [ os.hostname(), 'error', os.userInfo().username ] } );
        else if( stderr ) event.sender.send( 'getDataOs', { data: [ os.hostname(), 'error', os.userInfo().username ] } );
        else event.sender.send( 'getDataOs', { data: [ os.hostname(), stdout, os.userInfo().username ] } );
    });
};