const vscode = require('vscode'),
    raml2html = require('raml2html'),
    path = require('path'),
    fs = require('fs-extra');

exports.showPreview = function () {
    let document = vscode.window.activeTextEditor.document

    let fileName = `${new Date().getTime()}.html`,
        filePath = `${path.resolve(__dirname, "../tmp/",fileName)}`;

    let previewTheme = vscode.workspace.getConfiguration("raml").previewTheme;

    raml2html.render(document.uri.fsPath, raml2html.getDefaultConfig(`./${previewTheme}.nunjucks`, path.resolve(__dirname, "../raml2html_template"))).then((result) => {
        fs.writeFile(filePath, result, (errorCreateFile) => {
            if (errorCreateFile) {
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

            //shows file URI 
            vscode.window.showInformationMessage(`file://${filePath}`)
        });
    }, (error) => {
        vscode.window.showErrorMessage(error.toString()); throw error
    });
};

exports.cleanUp = function () {
    console.log("Cleaning up tmp folder...");
    
    fs.emptyDir(path.resolve(__dirname, "../tmp"), (errorFilesDeletion) => {
        if (errorFilesDeletion) {
            vscode.window.showErrorMessage(errorFilesDeletion.toString()); 
            throw errorFilesDeletion;
        }
    })
};