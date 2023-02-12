//IMPORTACIONES DE MODULOS;
const { app, BrowserWindow, ipcMain } = require( "electron" );
const path = require( "path" );
const url = require( "url" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );
const convert = require( "xml-js" );

//DECLARACIONES DE VARIABLES
let appWin;
const RUTE__COMPLETE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5`;
const RUTE__PROFILE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default`;

//FUNCION DE VENTANA PRINCIPAL
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

//PREPARAR LA VENTANA PRINCIPAL
app.on( "ready", createWindow );

//ACCIONES PARA CERRAR LA VENTANA PRINCIPAL
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

//COMUNICACIÓN ENTRE PROCESOS
//--------------------------------------------
ipcMain.on( 'openIt', ( event, args ) => openIt() );
ipcMain.on( 'openAvaya', ( event, args ) => openAvaya() );
ipcMain.on( 'checkAvayaInstall', ( event, args ) => checkAvayaInstall( event, args ) );
ipcMain.on( 'getDataOsExcludeAvaya', ( event, args ) => getDataOsExcludeAvaya( event, args ) );
ipcMain.on( 'getDataOsAvaya', ( event, args ) => getDataOsAvaya( event, args ) );


//FUNCIONES INTERNAS
//------------------------------

//ABRIR VENTANA NUEVA DE IT SUPPORT
let openIt = () => {
    let modal = new BrowserWindow( { parent: appWin, modal: true, show: false, x: 400, y: 100, resizable: false, title: 'Avaya Help', webPreferences: { contextIsolation: false, nodeIntegration: true } } );
    modal.title = 'Avaya Help',
    modal.setIcon( 'src/assets/favicon.png' );
    modal.loadURL( `file://${ __dirname }/dist/index.html#/It` );
    modal.once( "ready-to-show", () => modal.show() );
    modal.setMenu( null );
    //modal.webContents.openDevTools();
};
//ABRIR VENTANA NUEVA DE CONFIGURACIÓN DE AVAYA
let openAvaya = () => {
    let modal = new BrowserWindow( { parent: appWin, modal: true, show: false, x: 400, y: 100, resizable: false, title: 'Avaya Help', webPreferences: { contextIsolation: false, nodeIntegration: true } } );
    modal.setIcon( 'src/assets/favicon.png' );
    modal.loadURL( `file://${ __dirname }/dist/index.html#/Avaya` );
    modal.once( "ready-to-show", () => modal.show() );
    modal.setMenu( null );
    //modal.webContents.openDevTools();
};
//VERIFICAR SI AVAYA ESTÁ INSTALADO
let checkAvayaInstall = ( event, args ) => {
    if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya` ) ) {
        if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent` ) ) {
            if( fs.existsSync( RUTE__COMPLETE ) ) {
                event.sender.send( 'checkAvayaInstall', { data: 'ok' } );
            }
        }
    }else {
        event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
    }
};
//OBTENER DATOS: HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS
let getDataOsExcludeAvaya = ( event, args ) => {
    exec( 'wmic bios get serialnumber', ( error, stdout, stderr ) => {
        if( error || stderr ) event.sender.send( 'getDataOsExcludeAvaya', { data: [ os.hostname(), 'error', os.userInfo().username ] } );
        else event.sender.send( 'getDataOsExcludeAvaya', { data: [ os.hostname(), stdout, os.userInfo().username ] } );
    });
};
//OBTENER DATOS: EXTENSION Y LOGIN DE AVAYA
let getDataOsAvaya = ( event, args ) => {
    fs.readFile( `${RUTE__PROFILE}/Settings.xml`, ( error, data ) => {
        if( error ) event.sender.send( 'getDataOsAvaya', 'error' );
        else {
            const result = convert.xml2js( data, { compact: true, attributesKey: '$' } );

            const ext = result.Settings.Login.Telephony.User.$.Station; // extension
            const log = result.Settings.Login.Agent.$.Login; // login

            event.sender.send( 'getDataOsAvaya', { data: [ ext, log ] } );
        }
    });
};