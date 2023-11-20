/* -----------IMPORTACIONES DE MÓDULOS----------- */
const { app, BrowserWindow, ipcMain, Menu, dialog } = require( "electron" );
const isDev = require( "electron-is-dev" );
const { autoUpdater } = require( "electron-updater" );
const fs = require( "fs" );
const os = require( "os" );
const { exec } = require( "child_process" );
const xml2js = require( "xml2js" );
const cp = require( "child_process" );
//const copyDir = require( "copy-dir" );

/* -----------PROPIEDADES DE AUTOUPDATER----------- */
autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

/* -----------DECLARACIONES DE VARIABLES----------- */
let appWin;
let appPrelaod;
let modalOpenIt;
let modalOpenAvaya;
let modalOpenTrouble14;
//let modalOpenTrouble16;
const RUTE__CONFIG = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Config.xml`;
const RUTE__PROFILE = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default`;
const RUTE__PROFILE__SETTINGS = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default/Settings.xml`;
const RUTE__PROFILE__PREFERENCES = `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5/Profiles/default/Preferences.xml`;
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
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
        appWin.loadURL( 'http://localhost:4200/' );
        appPrelaod.loadURL( 'http://localhost:4200/#/Preload' );
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
        appWin.loadURL( `file://${ __dirname }/dist/index.html` );
        appPrelaod.loadURL( `file://${ __dirname }/dist/index.html#/Preload` );
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
//MOSTRAR NOTIFICACIÓN NATIVA
ipcMain.on('dialog', (e, args) => {
    if(args.type === 'error') {
        if(args.parent === 'trouble14') {
            dialog.showMessageBox(modalOpenTrouble14, { type: 'error', title: 'Error', message: args.text });
        }
    }
});
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
    
    if(isDev) {
        modalOpenIt.setIcon( 'src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        modalOpenIt.setMenu( menuDev );
        modalOpenIt.loadURL( 'http://localhost:4200/#/It' );
    }
    else {
        modalOpenIt.setIcon( 'resources/app/src/assets/favicon.png' );
        modalOpenIt.loadURL( `file://${ __dirname }/dist/index.html#/It` );
    }
    modalOpenIt.once( "ready-to-show", () => modalOpenIt.show() );
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

    if(isDev) {
        modalOpenAvaya.setIcon( 'src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        modalOpenAvaya.setMenu( menuDev );
        modalOpenAvaya.loadURL( 'http://localhost:4200/#/Avaya' );
    }
    else {
        modalOpenAvaya.setIcon( 'resources/app/src/assets/favicon.png' );
        modalOpenAvaya.loadURL( `file://${ __dirname }/dist/index.html#/Avaya` );
    }
    modalOpenAvaya.once( "ready-to-show", () => modalOpenAvaya.show() );
});
//ABRIR VENTANA NUEVA DE trouble_14
ipcMain.on( 'openTrouble14', ( event, args ) => {
    if( !fs.existsSync( `${RUTE__PROFILE}/SelectedPhoneFeatures.xml` ) ) event.sender.send( 'trouble_14', { data: 'notExist' } );
    else {
        modalOpenTrouble14 = new BrowserWindow( 
            { 
                parent: modalOpenAvaya, 
                modal: true, 
                show: false,
                width: 800,
                height: 700, 
                x: 400, 
                y: 100, 
                resizable: false,
                webPreferences: { 
                    contextIsolation: false, 
                    nodeIntegration: true 
                } 
            } 
        );
    
        if(isDev) {
            modalOpenTrouble14.setIcon( 'src/assets/favicon.png' );
            const menuDev = Menu.buildFromTemplate( menuTemplateDev );
            modalOpenTrouble14.setMenu( menuDev );
            modalOpenTrouble14.loadURL( 'http://localhost:4200/#/Trouble14' );
        }
        else {
            modalOpenTrouble14.setIcon( 'resources/app/src/assets/favicon.png' );
            modalOpenTrouble14.loadURL( `file://${ __dirname }/dist/index.html#/Trouble14` );
        }
    
        modalOpenTrouble14.once( "ready-to-show", () => modalOpenTrouble14.show() );
        event.sender.send( 'openTrouble14', { data: 'ok' } );
    }
});
//ABRIR VENTANA NUEVA DE trouble_16
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

    if(isDev) {
        modalOpenTrouble16.setIcon( 'src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        modalOpenTrouble16.setMenu( menuDev );
        modalOpenTrouble16.loadURL( 'http://localhost:4200/#/Trouble16' );
    }
    else {
        modalOpenTrouble16.setIcon( 'resources/app/src/assets/favicon.png' );
        modalOpenTrouble16.loadURL( `file://${ __dirname }/dist/index.html#/Trouble16` );
    }

    modalOpenTrouble16.once( "ready-to-show", () => modalOpenTrouble16.show() );
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
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'getDataOsAvaya', { data: 'noExist' } );
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
//OBTENER BOTONES FAVORITOS DE AVAYA
ipcMain.on( 'getButtonsAvaya', ( event, args ) => {
    fs.readFile( `${RUTE__PROFILE}/SelectedPhoneFeatures.xml`, ( errorRead, data ) => {
        xml2js.parseString( data, ( errorJson, result ) => {
            const json = result;
            if(json.SelectedFeatures.SelectedFeature) {
                if( json.SelectedFeatures.SelectedFeature.length > 0 ) {
                    event.sender.send( 'getButtonsAvaya', { data: json.SelectedFeatures.SelectedFeature } );
                }else {
                    event.sender.send( 'getButtonsAvaya', { data: 'notButtons' } );
                }
            }
            else event.sender.send( 'getButtonsAvaya', { data: 'notButtons' } );
        });
    });
});
//MODIFICAR BOTONES DE AVAYA(APLICAR)
ipcMain.on( 'modifyButtonsAvaya', ( event, args ) => {
    //TODO: COMPARAR BOTONES ENTRE AVAYA Y SELECCIONADOS, SOLO AÑADIR LOS QUE NO ESTÁN.
    fs.readFile( `${RUTE__PROFILE}/SelectedPhoneFeatures.xml`, ( error, data ) => {
        xml2js.parseString( data, ( errorJson, result ) => {
            const json = result;
            /*for( let i = 0; i < args.data.length; i++ ) {
                switch( args.data[i] ) {
                    case 'Marc Abrev 4':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"abrv-dial", Location:"10", Label:"Marc Abrev 4", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'AutoInACD':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"auto-in", Location:"11", Label:"AutoInACD", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'TrabAux':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"aux-work", Location:"12", Label:"TrabAux", State:"On", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'DespLlam':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"after-call", Location:"13", Label:"DespLlam", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Marc Abrev 8':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"abrv-dial", Location:"14", Label:"Marc Abrev 8", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Directorio':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"directory", Location:"15", Label:"Directorio", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Proximo':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"next", Location:"16", Label:"Proximo", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Hacer Llamada':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"call-disp", Location:"17", Label:"Hacer Llamada", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Estacion Llam':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"call-park", Location:"18", Label:"Estacion Llam", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Tomar Llam':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"call-pkup", Location:"19", Label:"Tomar Llam", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Env Cola 521':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"q-calls", Location:"20", Label:"Env Cola 521", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'Liberar':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"release", Location:"21", Label:"Liberar", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'normal':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"normal", Location:"22", Label:"normal ", State:"On", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                    case 'voice-mail 112':
                        json.SelectedFeatures.SelectedFeature.push( { $: { Name:"voice-mail", Location:"23", Label:"voice-mail 112", State:"Off", Auxinfo:"0", xmlns:"http://avaya.com/OneXAgent/ObjectModel/Phone" } } );
                        break;
                }
            }*/
            event.sender.send( 'modifyButtonsAvaya', { data: json.SelectedFeatures.SelectedFeature } );
        });
    });

    /*
    <SelectedFeature Name="abrv-dial" Location="10" Label="Marc Abrev 4" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="auto-in" Location="11" Label="AutoInACD" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="aux-work" Location="12" Label="TrabAux" State="On" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="after-call" Location="13" Label="DespLlam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="abrv-dial" Location="14" Label="Marc Abrev 8" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="directory" Location="15" Label="Directorio" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="next" Location="16" Label="Proximo" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="call-disp" Location="17" Label="Hacer Llamada" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="call-park" Location="18" Label="Estacion Llam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="call-pkup" Location="19" Label="Tomar Llam" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="q-calls" Location="20" Label="Env Cola 521" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="release" Location="21" Label="Liberar" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="normal" Location="22" Label="normal " State="On" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    <SelectedFeature Name="voice-mail" Location="23" Label="voice-mail 112" State="Off" Auxinfo="0" xmlns="http://avaya.com/OneXAgent/ObjectModel/Phone" />
    */
});

//PROBLEMA 1: Oigo demasiado alto a los clientes [ Value: 1 - CAT: Sonido ] - PROBLEMA 2: Oigo demasiado Bajo a los clientes [ Value: 2 - CAT: Sonido ]
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
                        json.ConfigData.parameter.splice( posArr, 1 );
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject( json );
                        fs.writeFile( RUTE__CONFIG, xml, ( error ) => {
                            event.sender.send( 'trouble_1_2', { data: 'ok' } );
                        });
                    }else event.sender.send( 'trouble_1_2', { data: 'solved' } );
                }else event.sender.send( 'trouble_1_2', { data: 'notExist' } );
            });
        });
    }
});
//PROBLEMA 3: Los clientes me oyen demasiado alto [ Value: 3 - CAT: Sonido ] - PROBLEMA 4: Los clientes me oyen demasiado Bajo [ Value: 3 - CAT: Sonido ]
ipcMain.on( 'trouble_3_4', ( event, args ) => {
    if( !fs.existsSync( RUTE__CONFIG ) ) event.sender.send( 'trouble_3_4', { data: 'notExist' } );
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
                        json.ConfigData.parameter.splice( posArr, 1 );
                        const builder = new xml2js.Builder();
                        const xml = builder.buildObject( json );
                        fs.writeFile( RUTE__CONFIG, xml, ( error ) => {
                            event.sender.send( 'trouble_3_4', { data: 'ok' } );
                        });
                    }else event.sender.send( 'trouble_3_4', { data: 'solved' } );
                }else event.sender.send( 'trouble_3_4', { data: 'notExist' } );
            });
        });
    }
});
//PROBLEMA 5: La llamada se transfiere directamente [ Value: 5 - CAT: llamadas ]
ipcMain.on( 'trouble_5', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_5', { data: 'notExist' } );
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
//PROBLEMA 6: Se agrega la persona a la llamada directamente [ Value: 6 - CAT: llamadas ]
ipcMain.on( 'trouble_6', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_3_4', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__SETTINGS, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Settings.WorkHandling[0].Conference[0].$.Consult === 'true' ) {
                    event.sender.send( 'trouble_6', { data: 'solved' } )
                }else {
                    json.Settings.WorkHandling[0].Conference[0].$.Consult = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__SETTINGS, xml, ( errorRead ) => event.sender.send( 'trouble_6', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 7: Cuando me llaman la pantalla no viene al frente [ Value: 7 - CAT: llamadas ]
ipcMain.on( 'trouble_7', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_7', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.IncomingCall[0].$.DisplayMainWindow === 'true' ) {
                    event.sender.send( 'trouble_7', { data: 'solved' } )
                }else {
                    json.Preferences.IncomingCall[0].$.DisplayMainWindow = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_7', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 8: No se muestra información sobre las herramientas [ Value: 8 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_8', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_8', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.ToolTip === 'true' ) {
                    event.sender.send( 'trouble_8', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.ToolTip = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_8', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 9: No se muestran las letras en el teclado de marcación [ Value: 9 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_9', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_9', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.DialPadLetters === 'true' ) {
                    event.sender.send( 'trouble_9', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.DialPadLetters = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_9', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 10: No se muestra el icono en la barra de tareas [ Value: 10 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_10', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_10', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.SystemTrayShortcut === 'true' ) {
                    event.sender.send( 'trouble_10', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.SystemTrayShortcut = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_10', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 11: No se guardan las posiciones de las ventanas [ Value: 11 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_11', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_11', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.SaveWindowPreference === 'true' ) {
                    event.sender.send( 'trouble_11', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.SaveWindowPreference = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_11', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 12: No se muestra la pantalla del teléfono [ Value: 12 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_12', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_12', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.ShowPhoneDisplay === 'true' ) {
                    event.sender.send( 'trouble_12', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.ShowPhoneDisplay = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_12', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 13: No se muestra la barra de herramientas de botones [ Value: 13 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_13', ( event, args ) => {
    if( !fs.existsSync( RUTE__PROFILE ) ) event.sender.send( 'trouble_13', { data: 'notExist' } );
    else {
        fs.readFile( RUTE__PROFILE__PREFERENCES, ( error, data ) => {
            xml2js.parseString( data, ( errorJson, result ) => {
                const json = result;
                if( json.Preferences.GeneralUI[0].$.DisplayFavoritesToolBar === 'true' ) {
                    event.sender.send( 'trouble_13', { data: 'solved' } )
                }else {
                    json.Preferences.GeneralUI[0].$.DisplayFavoritesToolBar = 'true';
                    const builder = new xml2js.Builder();
                    const xml = builder.buildObject( json );
                    fs.writeFile( RUTE__PROFILE__PREFERENCES, xml, ( errorRead ) => event.sender.send( 'trouble_13', { data: 'ok' } ) );
                }
            });
        });
    }
});
//PROBLEMA 14: Quiero configurar mis botones favoritos [ Value: 14 - CAT: Interfaz de usuario ]
ipcMain.on( 'trouble_14', ( event, args ) => {
    /* Si queremos añadir... */
    if(args.mode === 'add') {
        fs.readFile(`${RUTE__PROFILE}/SelectedPhoneFeatures.xml`, (error, data) => {
            //TODO: PENDIENTE...
        });
    /* Si queremos quitar... */
    }else {
        fs.readFile(`${RUTE__PROFILE}/SelectedPhoneFeatures.xml`, (error, data) => {
            xml2js.parseString(data, (errorJson, resp) => {
                let json = resp;
                for(let i = 0; i < json.SelectedFeatures.SelectedFeature.length; i++) {
                    for(let j = 0; j < args.buttonsDelete.length; j++) {
                        if(json.SelectedFeatures.SelectedFeature[i].$.Label === args.buttonsDelete[j].Label) {
                            json.SelectedFeatures.SelectedFeature.splice(i, 1);
                        }
                    }
                }
                const builder = new xml2js.Builder();
                const xml = builder.buildObject(json);
                fs.writeFile(`${RUTE__PROFILE}/SelectedPhoneFeatures.xml`, xml, errorWrite => {
                    if(errorWrite) event.sender.send('trouble_14', { status: '001' });
                    else event.sender.send('trouble_14', { status: '000', buttons: json.SelectedFeatures.SelectedFeature });
                });
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