// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode'),
    raml2html = require('raml2html'),
    fs = require('fs-extra');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('RAML starting up...');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let showPreview = vscode.commands.registerCommand('raml.showPreview', function () {
        
        // The code you place here will be executed every time your command is executed
        let document = vscode.window.activeTextEditor.document

        let fileName = `${new Date().getTime()}.html`, 
            filePath = `${__dirname}/tmp/${fileName}`;

        raml2html.render(document.uri.fsPath, raml2html.getDefaultConfig('./raml2html_template/darkly.nunjucks', __dirname)).then((result) => {
            fs.writeFile(filePath, result, (errorCreateFile) => {
                if(errorCreateFile) {
                    vscode.window.showErrorMessage(errorCreateFile.toString()); 
                    throw errorCreateFile
                }
                
                let uri = vscode.Uri.parse(`file://${filePath}`)
                vscode.commands.executeCommand(
                    "vscode.previewHtml", 
                    uri, 
                    vscode.window.activeTextEditor.viewColumn, 
                    "RAML Preview"
                );

                vscode.window.showInformationMessage(`${document.uri}`)
            });
        }, (error) => {
            vscode.window.showErrorMessage(error.toString()); throw error 
        });
    });

    context.subscriptions.push(showPreview);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    console.log("Cleaning up tmp folder...");
    fs.emptyDir(__dirname + "/tmp", (errorFilesDeletion) => {
        if (errorFilesDeletion) {
            vscode.window.showErrorMessage(errorFilesDeletion.toString()); 
            throw errorFilesDeletion;
        }
    })
}
exports.deactivate = deactivate;