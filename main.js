//IMPORTACIONES DE MODULOS;
const { app, BrowserWindow, ipcMain, dialog } = require( "electron" );
const isDev = require( "electron-is-dev" );
const { autoUpdater } = require( "electron-updater" );
const path = require( "path" );
const url = require( "url" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );
const xmljs = require( "xml-js" );
const xml2js = require( "xml2js" );

let count = 0;

autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

//DECLARACIONES DE VARIABLES
let appWin;
let appPrelaod;
let modalOpenIt;
let modalOpenAvaya;
let modalOpenTrouble1;
const RUTE__COMPLETE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5`;
const RUTE__PROFILE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default`;
const RUTE__PROFILE__SETTINGS = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default/Settings.xml`;
const PASS__AVAYA = 'NErKSOxs6svv3KKQseDwh9gjGisvxFdwdXLxQY0YhX24YISBVzNt432Zyl3g5AKVKtfe82PvqRhG2urEM+pHKVYEZTy3f2Cw==';

//FUNCION DE VENTANA PRINCIPAL Y VENTANA PRELOAD
createWindow = () => {
    //autoUpdater.checkForUpdates();
    appWin = new BrowserWindow(
        { 
            width: 800, 
            height: 600,
            resizable: false,
            center: true, 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            show: false
        }
    );
    appPrelaod = new BrowserWindow(
        {
            width: 600, 
            height: 400,
            resizable: false,
            center: true,
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            frame: false,
            transparent: true,
            alwaysOnTop: true
        }
    );
    if(isDev) {
        appWin.setIcon( 'src/assets/favicon.png' );
        appPrelaod.setIcon( 'src/assets/favicon.png' );
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
    }
    appWin.loadURL( `file://${ __dirname }/dist/index.html` );
    appPrelaod.loadURL( `file://${ __dirname }/dist/index.html#/Preload` );
    appWin.setMenu( null );
    /*if(isDev) {
        appWin.webContents.openDevTools( { mode: "detach" } );
        appPrelaod.webContents.openDevTools( { mode: "detach" } );
    }*/
    appWin.once( "ready-to-show", () => {
        //checks();
    });

    setTimeout( () => {
        appPrelaod.close();
        appWin.show();
    }, 3000);

    appWin.on( "closed", () => appWin = null );
    appPrelaod.on( "closed", () => appPrelaod = null );
};

//PREPARAR LA VENTANA PRINCIPAL Y LA VENTANA PRELOAD
app.whenReady().then( () => createWindow() );

//ACCIONES PARA CERRAR LA APLICACIÓN
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

//COMUNICACIÓN ENTRE PROCESOS
//--------------------------------------------
ipcMain.on( 'openIt', ( event, args ) => openIt() );
ipcMain.on( 'openAvaya', ( event, args ) => openAvaya() );
ipcMain.on( 'openTrouble1', ( event, args ) => openTrouble1( event, args ) );
ipcMain.on( 'checkAvayaInstall', ( event, args ) => checkAvayaInstall( event, args ) );
ipcMain.on( 'getDataOsExcludeAvaya', ( event, args ) => getDataOsExcludeAvaya( event, args ) );
ipcMain.on( 'getDataOsAvaya', ( event, args ) => getDataOsAvaya( event, args ) );
ipcMain.on( 'trouble1', ( event, args ) => trouble1( event, args ) );
ipcMain.on( 'trouble2', ( event, args ) => trouble2( event, args ) );
ipcMain.on( 'pruebaTask', ( event, args ) => pruebaTask( event, args ) );


//FUNCIONES INTERNAS
//------------------------------

//ABRIR VENTANA NUEVA DE IT SUPPORT
let openIt = () => {
    modalOpenIt = new BrowserWindow( 
        { 
            parent: appWin, 
            modal: true, 
            show: false, 
            x: 400, 
            y: 100, 
            resizable: false,
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            } 
        } 
    );
    
    if(isDev) modalOpenIt.setIcon( 'src/assets/favicon.png' );
    else modalOpenIt.setIcon( 'resources/app/src/assets/favicon.png' );
    
    modalOpenIt.loadURL( `file://${ __dirname }/dist/index.html#/It` );
    modalOpenIt.once( "ready-to-show", () => modalOpenIt.show() );
    modalOpenIt.setMenu( null );
    //modal.webContents.openDevTools();
};
//ABRIR VENTANA NUEVA DE CONFIGURACIÓN DE AVAYA
let openAvaya = () => {
    modalOpenAvaya = new BrowserWindow( 
        { 
            parent: appWin, 
            modal: true, 
            show: false, 
            x: 400, 
            y: 100, 
            resizable: false,
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            } 
        } 
    );

    if(isDev) modalOpenAvaya.setIcon( 'src/assets/favicon.png' );
    else modalOpenAvaya.setIcon( 'resources/app/src/assets/favicon.png' );

    modalOpenAvaya.loadURL( `file://${ __dirname }/dist/index.html#/Avaya` );
    if(isDev) modalOpenAvaya.webContents.openDevTools( { mode: "detach" } );
    modalOpenAvaya.once( "ready-to-show", () => modalOpenAvaya.show() );
    modalOpenAvaya.setMenu( null );
    //modalmodalOpenAvaya.webContents.openDevTools();
};
//ABRIR VENTANA NUEVA DE trouble1
let openTrouble1 = () => {
    modalOpenTrouble1 = new BrowserWindow( 
        { 
            parent: modalOpenAvaya, 
            modal: true, 
            show: false, 
            x: 400, 
            y: 150, 
            resizable: false,
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            } 
        } 
    );

    if(isDev) modalOpenTrouble1.setIcon( 'src/assets/favicon.png' );
    else modalOpenTrouble1.setIcon( 'resources/app/src/assets/favicon.png' );

    modalOpenTrouble1.loadURL( `file://${ __dirname }/dist/index.html#/Trouble1` );
    modalOpenTrouble1.once( "ready-to-show", () => modalOpenTrouble1.show() );
    modalOpenTrouble1.setMenu( null );
    //modalOpenTrouble1.webContents.openDevTools();
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
            const result = xmljs.xml2js( data, { compact: true, attributesKey: '$' } );

            const ext = result.Settings.Login.Telephony.User.$.Station; // extension
            const log = result.Settings.Login.Agent.$.Login; // login

            event.sender.send( 'getDataOsAvaya', { data: [ ext, log ] } );
        }
    });
};
//PROBLEMA: AVAYA NO INICIA SESIÓN
let trouble1 = ( event, args ) => {
    //ELIMINAR Settings.xml ORIGINAL;
    fs.unlink( RUTE__PROFILE__SETTINGS, ( error ) => {
        if( error ) event.sender.send( 'trouble1', { data: 'notDeleteOriginalXML' } );
        else {
            //COPIAR Settings PLANTILLA AL ORIGINAL
            fs.copyFile( 'src/assets/Settings.xml', `${RUTE__PROFILE}/Settings.xml`, ( error ) => {
                if( error ) event.sender.send( 'trouble1', { data: 'notCopySettingsFile' } );
                else {
                    //LEER Settings ORIGINAL Y MODIFICAR
                    fs.readFile( RUTE__PROFILE__SETTINGS, ( errorRead, data ) => {
                        if( errorRead ) event.sender.send( 'trouble1', { data: 'notRead' } );
                        else {
                            xml2js.parseString( data, ( errorJson, result ) => {
                                if( errorJson ) event.sender.send( 'trouble1', { data: 'notJson' } );
                                else {
                                    let json = result;
                                    json.Settings.Login[0].Telephony[0].User[0].$.Station = args[0];
                                    json.Settings.Login[0].Agent[0].$.Login = args[1];
                                    const builder = new xml2js.Builder();
                                    const xml = builder.buildObject( json );
                                    fs.writeFile( `${RUTE__PROFILE}/Settings.xml`, xml, ( error ) => {
                                        if( error ) event.sender.send( 'trouble1', { data: 'notModify' } );
                                        else {
                                            event.sender.send( 'trouble1', { data: 'ok' } );
                                            setTimeout( () => {
                                                modalOpenTrouble1.close();
                                            }, 1500);
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};
//PROBLEMA: AVAYA NO INICIA SESIÓN AUTOMÁTICAMENTE
let trouble2 = ( event, args ) => {
    fs.readFile( RUTE__PROFILE__SETTINGS, ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'trouble2', { data: 'notRead' } );
        else {
            xml2js.parseString( data, ( errorJson, result ) => {
                if( errorJson ) event.sender.send( 'trouble2', { data: 'notJson' } );
                else {
                    let json = result;
                    json.Settings.Login[0].Telephony[0].User[0].$.AutoLogin = 'true';
                    json.Settings.Login[0].Agent[0].$.AutoLogin = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__SETTINGS, xml, ( errorWrite ) => {
                        if( errorWrite ) event.sender.send( 'trouble2', { data: 'notModify' } );
                        else {
                            event.sender.send( 'trouble2', { data: 'ok' } );
                        }
                    });
                    // TODO: MODIFICAR INICIO AUTOMÁTICO XMl
                }
            });
        }
    });
};
//PRUEBAS CON TASKKILL
let pruebaTask = ( event, args ) => {
    exec( 'taskkill /im QosServM.exe', ( error, stdout, stderr ) => {
        if( error ) event.sender.send( 'pruebaTask', { data: error } );
        else if( stderr ) event.sender.send( 'pruebaTask', { data: stderr } );
        else event.sender.send( 'pruebaTask', { data: stdout } );
    });
};

//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'setVersion', ( event, args ) => event.sender.send( 'setVersion', { data: app.getVersion() } ) );



//EVENTOS DE ACTUALIZACIONES AUTOMÁTICAS
let checks = () => {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on( 'update-available', ( info ) => {
        appWin.webContents.send( 'update_available' );
    });
    autoUpdater.on( 'update-not-available', () => {
        appWin.webContents.send( 'update_not_available' );
    });
    autoUpdater.on( 'download-progress', ( progressObj ) => {
        appWin.webContents.send( 'download_progress', Math.trunc( progressObj.percent ) );
    });
    autoUpdater.on( 'update-downloaded', () => {
        appWin.webContents.send( 'update_downloaded' );
    });
    autoUpdater.on( 'error', ( error ) => {
        appWin.webContents.send( 'error_update' );
    });
};