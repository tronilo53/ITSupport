const { app, BrowserWindow, ipcMain, Menu } = require( "electron" );
const path = require( "path" );
const url = require( "url" );
const fs = require( "fs" );
const os = require( "os" );

let appWin;

let menu = [
    {
        label: 'Archivo',
        submenu: [
            {
                label: 'Recargar',
                click() {
                    reloadWindow()
                }
            }
        ]
    }
]

createWindow = () => {

    appWin = new BrowserWindow({

        width: 800,
        height: 600,
        title: 'Avaya Help',
        resizable: false,
        webPreferences: {

            contextIsolation: false,
            nodeIntegration: true
        }
    });

    appWin.setIcon( 'src/assets/favicon.png' );

    appWin.loadURL(
        url.format({
            pathname: path.join( __dirname, '/dist/index.html' ),
            protocol: 'file',
            slashes: true
        })
    );

    appWin.setMenu( null );

    appWin.on( "closed", () => {

        appWin = null;
    });

    let menuPrincipal = Menu.buildFromTemplate( menu );
    appWin.setMenu( menuPrincipal );
}

app.on( "ready", createWindow );

app.on( "window-all-closed", () => {

    if( process.platform !== 'darwin' ) app.quit();
});

//Comunicación entre procesos
//--------------------------------------------
/*ipcMain.on( 'openModal', ( event, args ) => openModal() );
ipcMain.on( 'checkAvayaInstall', ( event, args ) => {
    if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya` ) ) {
        if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent` ) ) {
            if( fs.existsSync( `C:/Users/${os.userInfo().username}/AppData/Roaming/Avaya/one-X Agent/2.5` ) ) {
                event.sender.send( 'checkAvayaInstall', { data: 'success' } );
            }
        }
    }else {
        event.sender.send( 'checkAvayaInstall', { data: 'error' } );
    }
});*/

//Nueva ventana Modal
//---------------------------------------------
/*let openModal = () => {
    let modal = new BrowserWindow( { parent: appWin, modal: true, show: false } );
    modal.setIcon( 'src/assets/avaya.png' );
    modal.loadURL( `file://${ __dirname }/dist/index.html#/Ventana` );
    modal.once( "ready-to-show", () => modal.show() );
    modal.setMenu( null );
    modal.webContents.openDevTools();
};*/