/* -----------IMPORTACIONES DE MÓDULOS----------- */
const { app, BrowserWindow, ipcMain, Menu } = require( "electron" );
const isDev = require( "electron-is-dev" );
const { autoUpdater } = require( "electron-updater" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );
const xml2js = require( "xml2js" );
const cp = require( "child_process" );
const copyDir = require( "copy-dir" );

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
let existProcess = 0;
const RUTE__CONFIG = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Config.xml`;
const RUTE__PROFILE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default`;
const RUTE__PROFILE__SETTINGS = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default/Settings.xml`;
const RUTE__INSTALL = 'C:/Program Files (x86)/Avaya';
const RUTE__LAN__PROD = `C:/Users/${os.userInfo().username}/AppData/Local/Programs/ITSupport/resources/app/src/assets/language.xml`;
const RUTE__LAN__DEV = './src/assets/language.xml';
const RUTE__AVAYA__TEMPLATE__DEV = './src/assets/Avaya';
const RUTE__AVAYA__TEMPLATE__PROD = `C:/Users/${os.userInfo().username}/AppData/Local/Programs/ITSupport/resources/app/src/assets/Avaya`;
const PASS__AVAYA = 'NErKSOxs6svv3KKQseDwh9gjGisvxFdwdXLxQY0YhX24YISBVzNt432Zyl3g5AKVKtfe82PvqRhG2urEM+pHKVYEZTy3f2Cw==';
const RUTE__CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const RUTE__FIREFOX = 'C:/Program Files/Mozilla Firefox/firefox.exe';
const RUTE__EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

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
ipcMain.on( 'openIt', ( event, args ) => {
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
});
//ABRIR VENTANA NUEVA DE CONFIGURACIÓN DE AVAYA
ipcMain.on( 'openAvaya', ( event, args ) => {
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
    //if(isDev) modalOpenAvaya.webContents.openDevTools( { mode: "detach" } );
    modalOpenAvaya.once( "ready-to-show", () => modalOpenAvaya.show() );
    modalOpenAvaya.setMenu( null );
});
//ABRIR VENTANA NUEVA DE trouble16
ipcMain.on( 'openTrouble16', ( event, args ) => {
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
});
//ABRIR PORTAL DE INCIDENCIAS
ipcMain.on( 'openIncident', ( event, args ) => {
    const url = 'https://henryschein.service-now.com/serviceportaleurope?id=index_eu';
    if( fs.existsSync( RUTE__CHROME ) ) cp.spawn( RUTE__CHROME, [ '-new-tab', url ] );
    else {
        if( fs.existsSync( RUTE__FIREFOX ) ) cp.spawn( RUTE__FIREFOX, [ '-new-tab', url ] );
        else {
            if( fs.existsSync( RUTE__EDGE ) ) cp.spawn( RUTE__EDGE, [ '-new-tab', url ] );
        }
    }
});

//VERIFICAR SI AVAYA ESTÁ INSTALADO
ipcMain.on( 'checkAvayaInstall', ( event, args ) => {
    if( fs.existsSync( `${RUTE__INSTALL}/Avaya one-X Agent/OneXAgentUI.exe` ) ) {
        event.sender.send( 'checkAvayaInstall', { data: 'ok' } );
    }else event.sender.send( 'checkAvayaInstall', { data: 'fail' } );
});
//OBTENER DATOS: HOSTNAME, SERIALTAG Y USUARIO DE WINDOWS
ipcMain.on( 'getDataOsExcludeAvaya', ( event, args ) => {
    exec( 'wmic bios get serialnumber', ( error, stdout, stderr ) => {
        if( error || stderr ) event.sender.send( 'getDataOsExcludeAvaya', { data: [ os.hostname(), 'error', os.userInfo().username ] } );
        else event.sender.send( 'getDataOsExcludeAvaya', { data: [ os.hostname(), stdout, os.userInfo().username ] } );
    });
});
//OBTENER DATOS: EXTENSION Y LOGIN DE AVAYA
ipcMain.on( 'getDataOsAvaya', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE__SETTINGS ) ) event.sender.send( 'getDataOsAvaya', { data: 'noExist' } );
    else {
        fs.readFile( RUTE__PROFILE__SETTINGS, ( errorRead, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                const ext = json.Settings.Login[0].Telephony[0].User[0].$.Station; // extension
                const log = json.Settings.Login[0].Agent[0].$.Login // login
                event.sender.send( 'getDataOsAvaya', { data: [ ext, log ] } );
            });
        });
    }
});
/*
    PROBLEMA 1: Oigo demasiado alto a los clientes [ Value: 1 - CAT: Sonido ]
    PROBLEMA 2: Oigo demasiado Bajo a los clientes [ Value: 2 - CAT: Sonido ]
*/
ipcMain.on( 'trouble_1_2', ( event, args ) => {
    if( !fs.existsSync( RUTE__CONFIG ) ) event.sender.send( 'trouble_1_2', { data: 'notExist' } );
    else {
        // PRED; RecepcionGanancia: 1.00
        fs.readFile( RUTE__CONFIG, ( errorRead, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                //Guardamos el resultado de la conversión a json
                const json = result;
                if( json.ConfigData.parameter.length > 0 ) {
                    //creamos variable para saber si existe el elemento en el array;
                    let resultArr = 0;
                    //Guardamos todos los elementos del array en una variable;
                    const arrParameters = json.ConfigData.parameter;
                    //Inicializamos variable para guardar la posición del elemento encontrado;
                    let posArr;
                    //Bucle for que recorre todos los elementos del array;
                    for( i = 0; i < arrParameters.length; i++ ) {
                        //Si alguna posicion se encuentra el elemento...
                        if( arrParameters[i].name[0] === 'ReceiveGain' ) {
                            //Guardamos en variable la confirmación de que existe el elemento;
                            resultArr = 1;
                            //Guardamos la posición actual del elemento.
                            posArr = i;
                        }
                    }
                    //Si el elemento existe...
                    if( resultArr == 1 ) {
                        //Elimina el elemento del array;
                        json.ConfigData.parameter.slice( posArr, 1 );
                        //Se envía al renderer un mensaje
                        event.sender.send( 'trouble_1_2', { data: 'gananMod', json: json } );
                    }else event.sender.send( 'trouble_1_2', { data: 'gananPred' } );
                }else event.sender.send( 'trouble_1_2', { data: 'notExist' } );
            });
        });
    }
});
/*
    PROBLEMA 3: Los clientes me oyen demasiado alto [ Value: 3 - CAT: Sonido ]
    PROBLEMA 4: Los clientes me oyen demasiado Bajo [ Value: 3 - CAT: Sonido ]
*/
ipcMain.on( 'trouble_3_4', ( event, args ) => {
    if( !fs.existsSync( RUTE__CONFIG ) ) event.sender.send( 'trouble_3_4', { data: 'notExist' } );
    else {
        // PRED; TransmisionGanancia: 0.34
        fs.readFile( RUTE__CONFIG, ( errorRead, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                //Guardamos el resultado de la conversión a json
                const json = result;
                if( json.ConfigData.parameter.length > 0 ) {
                    //creamos variable para saber si existe el elemento en el array;
                    let resultArr = 0;
                    //Guardamos todos los elementos del array en una variable;
                    const arrParameters = json.ConfigData.parameter;
                    //Inicializamos variable para guardar la posición del elemento encontrado;
                    let posArr;
                    //Bucle for que recorre todos los elementos del array;
                    for( i = 0; i < arrParameters.length; i++ ) {
                        //Si alguna posicion se encuentra el elemento...
                        if( arrParameters[i].name[0] === 'TransmitGain' ) {
                            //Guardamos en variable la confirmación de que existe el elemento;
                            resultArr = 1;
                            //Guardamos la posición actual del elemento.
                            posArr = i;
                        }
                    }
                    //Si el elemento existe...
                    if( resultArr == 1 ) {
                        //Elimina el elemento del array;
                        json.ConfigData.parameter.slice( posArr, 1 );
                        //Se envía al renderer un mensaje
                        event.sender.send( 'trouble_3_4', { data: 'gananMod', json: json } );
                    }else event.sender.send( 'trouble_3_4', { data: 'gananPred' } );
                }else event.sender.send( 'trouble_3_4', { data: 'notExist' } );
            });
        });
    }
});
//PROBLEMA 5: La llamada se transfiere directamente [ Value: 5 - CAT: llamadas ]
ipcMain.on( 'trouble_5', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE__SETTINGS ) ) event.sender.send( 'trouble_3_4', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__SETTINGS, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Settings.WorkHandling[0].Transfer[0].$.Consult === 'true' ) {
                    event.sender.send( 'trouble_5', { data: 'solved' } )
                }else {
                    json.Settings.WorkHandling[0].Transfer[0].$.Consult = true;
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__SETTINGS, xml, ( errorRead ) => event.sender.send( 'trouble_5', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 16: No puedo iniciar sesión(Me muestra un error) [ Value: 16 - CAT: Conexion ]
ipcMain.on( 'trouble16', ( event, args ) => {
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
});
//PROBLEMA 20: Inicio de sesión automático(Aplicar) [ Value: 20 - CAT: Conexion ]
ipcMain.on( 'trouble20', ( event, args ) => {
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
});
//COMPROBAR EL IDIOMA GUARDADO EN EL ARCHIVO language.xml
ipcMain.on( 'checkLanguage', ( event, args ) => {
    fs.readFile( './src/assets/language.xml', ( errorRead, data ) => {
        xml2js.parseString( data, ( errorJson, result ) => {
            const json = result;
            const lan = json.Settings.lan[0].$.language;
            event.sender.send( 'checkLanguage', { data: lan } );
        });
    });
});
//ESTABLECER IDIOMA
ipcMain.on( 'setLanguage', ( event, args ) => {
    //TODO: CAMBIAR A LA RUTA DE PROD CUANDO SE PROCEDA
    fs.readFile( RUTE__LAN__DEV, ( errorRead, data ) => {
        xml2js.parseString( data, ( errorJson, result ) => {
            const json = result;
            json.Settings.lan[0].$.language = args.data;
            const builder = new xml2js.Builder();
            const xml = builder.buildObject( json );
            //TODO: CAMBIAR A LA RUTA DE PROD CUANDO SE PROCEDA
            fs.writeFile( RUTE__LAN__DEV, xml, ( errorWrite ) => {
                if( errorWrite ) event.sender.send( 'setLanguage', { data: 'notRead' } );
                else event.sender.send( 'setLanguage', { data: 'ok' } );
            });
        });
    });
});
//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'setVersion', ( event, args ) => event.sender.send( 'setVersion', { data: app.getVersion() } ) );

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