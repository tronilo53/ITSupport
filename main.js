/* -----------IMPORTACIONES DE MÓDULOS----------- */

const { app, BrowserWindow, ipcMain, dialog, Menu } = require( "electron" );
const isDev = require( "electron-is-dev" );
const { autoUpdater } = require( "electron-updater" );
const path = require( "path" );
const url = require( "url" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );
const xml2js = require( "xml2js" );
const cp = require( "child_process" );

/* -----------PROPIEDADES DE AUTOUPDATER----------- */

autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

/* -----------DECLARACIONES DE VARIABLES----------- */

let appWin;
let appPrelaod;
let modalOpenIt;
let modalOpenAvaya;
let modalOpenTrouble1;
let count = 0;
const RUTE__CONFIG = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Config.xml`;
const RUTE__PROFILE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default`;
const RUTE__PROFILE__SETTINGS = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default/Settings.xml`;
const RUTE__INSTALL = 'C:/Program Files (x86)/Avaya';
const RUTE__LAN__PROD = `C:/Users/${os.userInfo().username}/AppData/Local/Programs/ITSupport/resources/app/src/assets/language.xml`;
const RUTE__LAN__DEV = './src/assets/language.xml';
const PASS__AVAYA = 'NErKSOxs6svv3KKQseDwh9gjGisvxFdwdXLxQY0YhX24YISBVzNt432Zyl3g5AKVKtfe82PvqRhG2urEM+pHKVYEZTy3f2Cw==';
const RUTE__CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';

/* -----------TEMPLATE MENU----------- */
let menuTemplateDev = [
    {
        label: 'Vista',
        submenu: [
            { role: 'toggledevtools' }
        ]
    }
];

/* -----------FUNCIÓN DE VENTANA PRINCIPAL Y PRELOAD----------- */

createWindow = () => {
    //autoUpdater.checkForUpdates();
    appWin = new BrowserWindow(
        { 
            width: 800, 
            height: 670,
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
    if(isDev) {
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
    }
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

/* -----------PREPARACIÓN DE LA VENTANA PRINCIPAL Y PRELOAD----------- */

app.whenReady().then( () => createWindow() );

/* -----------ACCIONES PARA CERRAR LA APLICACIÓN MacOs----------- */

app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

/* -----------COMUNICACIÓN ENTRE PROCESOS----------- */

//ABRIR VENTANA NUEVA DE IT SUPPORT
ipcMain.on( 'openIt', ( event, args ) => openIt() );
//ABRIR VENTANA NUEVA DE CONFIGURACIÓN DE AVAYA
ipcMain.on( 'openAvaya', ( event, args ) => openAvaya() );
//ABRIR VENTANA NUEVA DE trouble16
//ipcMain.on( 'openTrouble16', ( event, args ) => openTrouble16( event, args ) );
//VERIFICAR SI AVAYA ESTÁ INSTALADO
ipcMain.on( 'checkAvayaInstall', ( event, args ) => checkAvayaInstall( event, args ) );
//OBTENER DATOS: HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS
ipcMain.on( 'getDataOsExcludeAvaya', ( event, args ) => getDataOsExcludeAvaya( event, args ) );
//OBTENER DATOS: EXTENSION Y LOGIN DE AVAYA
ipcMain.on( 'getDataOsAvaya', ( event, args ) => getDataOsAvaya( event, args ) );
//Trouble1
ipcMain.on( 'trouble1', ( event, args ) => trouble1( event, args ) );
//Trouble16
//ipcMain.on( 'trouble16', ( event, args ) => trouble16( event, args ) );
//Trouble20
//ipcMain.on( 'trouble20', ( event, args ) => trouble20( event, args ) );
//PRUEBA CON TASKKILL
//ipcMain.on( 'pruebaTask', ( event, args ) => pruebaTask( event, args ) );
//SELECCIÓN DE IDIOMA
ipcMain.on( 'checkLanguage', ( event, args ) => checkLanguage( event, args ) );
//ESTABLECER IDIOMA
ipcMain.on( 'setLanguage', ( event, args ) => {
    fs.readFile( RUTE__LAN__DEV, ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'setLanguage', { data: 'notRead' } );
        else {

        }
    });
});
//ABRIR PORTAL DE INCIDENCIAS
ipcMain.on( 'openIncident', ( event, args ) => {
    const url = 'https://henryschein.service-now.com/serviceportaleurope?id=index_eu';
    cp.spawn( RUTE__CHROME, [ '-new-tab', url ] );
});
//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'setVersion', ( event, args ) => event.sender.send( 'setVersion', { data: app.getVersion() } ) );


/* -----------FUNCIONES INTERNAS----------- */

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
    if( fs.existsSync( RUTE__INSTALL ) ) {
        if( fs.existsSync( `${RUTE__INSTALL}/Avaya one-X Agent` ) ) {
            if( fs.existsSync( `${RUTE__INSTALL}/Avaya one-X Agent/OneXAgentUI.exe` ) ) event.sender.send( 'checkAvayaInstall', { data: 'ok' } );
            else event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
        }
        else event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
    }
    else event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
};
//SELECCIÓN DE IDIOMA
let checkLanguage = ( event, args ) => {
    fs.readFile( './src/assets/language.xml', ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'checkLanguage', { data: 'notRead' } );
        else {
            xml2js.parseString( data, ( errorJson, result ) => {
                if( errorJson ) event.sender.send( 'checkLanguage', { data: 'notJson' } );
                else {
                    const json = result;
                    const lan = json.Settings.lan[0].$.language;
                    event.sender.send( 'checkLanguage', { data: lan } );
                }
            });
        }
    });
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
    fs.readFile( RUTE__PROFILE__SETTINGS, ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'getDataOsAvaya', { data: 'notRead' } );
        else {
            xml2js.parseString( data, ( errorJson, result ) => {
                if( errorJson ) event.sender.send( 'getDataOsAvaya', { data: 'notJson' } );
                else {
                    const json = result;
                    const ext = json.Settings.Login[0].Telephony[0].User[0].$.Station; // extension
                    const log = json.Settings.Login[0].Agent[0].$.Login // login
                    event.sender.send( 'getDataOsAvaya', { data: [ ext, log ] } );
                }
            });
        }
    });
};

/* -----------PROBLEMAS AVAYA----------- */

//PROBLEMA: Oigo demasiado alto a los clientes [ Value: 1 - CAT: Sonido ]
let trouble1 = ( event, args ) => {

    // PRED; RecepcionGanancia: 3.34 - TransmisionGanancia: 1.00

    fs.readFile( RUTE__CONFIG, ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'trouble1', { data: 'notRead' } );
        else {
            xml2js.parseString( data, ( errorJson, result ) => {
                if( errorJson ) event.sender.send( 'trouble1', { data: 'notJson' } );
                else {
                    const json = result;
                    // json.ConfigData.parameter[15] - recepcion
                    // json.ConfigData.parameter[16] - transmision
                    if( json.ConfigData.paremeter[15].name === 'ReceiveGain' ) {
                        //TODO: MODIFICAR VALOR AL PREDETERMINADO - 3.34
                    }else {
                        //TODO: CREAR NODO "ReceiveGain" AL FINAL (SE ORDENA AUTOMÁTICAMENTE)
                    }
                    event.sender.send( 'trouble1', { data: json } );
                }
            });
        }
    });
};

//PROBLEMA: No puedo iniciar sesión(Me muestra un error) [ Value: 16 - CAT: Conexion ]
/*let trouble16 = ( event, args ) => {
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
};*/
//PROBLEMA: Inicio de sesión automático(Aplicar) [ Value: 20 - CAT: Conexion ]
/*let trouble20 = ( event, args ) => {
    fs.readFile( RUTE__PROFILE__SETTINGS, ( errorRead, data ) => {
        if( errorRead ) event.sender.send( 'trouble20', { data: 'notRead' } );
        else {
            xml2js.parseString( data, ( errorJson, result ) => {
                if( errorJson ) event.sender.send( 'trouble20', { data: 'notJson' } );
                else {
                    let json = result;
                    json.Settings.Login[0].Telephony[0].User[0].$.AutoLogin = 'true';
                    json.Settings.Login[0].Agent[0].$.AutoLogin = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__SETTINGS, xml, ( errorWrite ) => {
                        if( errorWrite ) event.sender.send( 'trouble20', { data: 'notModify' } );
                        else {
                            event.sender.send( 'trouble20', { data: 'ok' } );
                        }
                    });
                }
            });
        }
    });
};*/

//PROBLEMAS: PRUEBAS CON TASKKILL
/*let pruebaTask = ( event, args ) => {
    exec( 'taskkill /im QosServM.exe', ( error, stdout, stderr ) => {
        if( error ) event.sender.send( 'pruebaTask', { data: error } );
        else if( stderr ) event.sender.send( 'pruebaTask', { data: stderr } );
        else event.sender.send( 'pruebaTask', { data: stdout } );
    });
};*/

/* -----------EVENTOS DE ACTUALIZACIONES AUTOMÁTICAS----------- */

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