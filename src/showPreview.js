const vscode = require('vscode'),
    path = require('path'),
    fs = require('fs-extra'),
    exec = require('child_process').exec;

var fileName = `${new Date().getTime()}.html`,
    tempFolder = path.resolve(__dirname, "../tmp"),
    filePath = `${path.resolve(tempFolder, fileName)}`,
    templatesFolder = path.resolve(__dirname, "../raml2html_template");

function createTempFile(text, callback) {
    fs.ensureDir(tempFolder, function (errDirCreation) {
        if (errDirCreation) {
            callback(errDirCreation);
        }

        fs.writeFile(filePath, text, (errorCreateFile) => {
            callback(errorCreateFile);
        });
    });
}

var ramlPreviewPanels = {}

exports.showPreview = function () {
    var document = vscode.window.activeTextEditor.document;

    let previewTheme = vscode.workspace.getConfiguration("raml").previewTheme;

    var checkRaml2HtmlVersion = "raml2html --version";
    exec(checkRaml2HtmlVersion, (err, version) => {
        if (err) {
            if (err.code == 127) {
                vscode.window.showErrorMessage("Please install raml2html using the following command: npm i -g raml2html");
            } else {
                vscode.window.showErrorMessage(err.toString());
            }

            return;
        }

        function createRaml2HtmlAndShowIt() {
            exec(createRaml2Html, {maxBuffer: 1024 * 1024 * 10}, function (err, result) {
                if (err) {
                    vscode.window.showErrorMessage(err.toString());
                    return;
                }

                panel = ramlPreviewPanels[vscode.window.activeTextEditor.id];
                if (!panel || panel._store._isDisposed){
                    panel = vscode.window.createWebviewPanel(
                        'ramlPreview',
                        'RAML Preview',
                        vscode.ViewColumn.Beside,
                        {
                            enableScripts: true,
                        }
                    );
                    ramlPreviewPanels[vscode.window.activeTextEditor.id] = panel;
                }
                panel.webview.html = result;
            });
        }
        
        var createRaml2Html = `raml2html --template "${templatesFolder}/${previewTheme}.nunjucks" "${document.uri.fsPath}"`;

        var isNotASavedFile = /^Untitled-/.test(document.fileName);
        if (isNotASavedFile) {
            createTempFile(document.getText(), () => {
                if (err) {
                    vscode.window.showErrorMessage(err.toString());
                    throw err;
                }

                createRaml2Html = `raml2html --template "${templatesFolder}/${previewTheme}.nunjucks" "${filePath}"`;
                createRaml2HtmlAndShowIt();
            });
        } else {
            createRaml2HtmlAndShowIt();
        }
    });
};

exports.cleanUp = function () {
    console.log("Cleaning up tmp folder...");

    fs.emptyDir(tempFolder, (errorFilesDeletion) => {
        if (errorFilesDeletion) {
            vscode.window.showErrorMessage(errorFilesDeletion.toString());
            throw errorFilesDeletion;
        }
    })
};