const vscode = require('vscode');
const path = require('path');
const raml2html = require('raml2html');

let showPreview = function (context) {
    const config = vscode.workspace.getConfiguration('raml');
    const doc = vscode.window.activeTextEditor.document;

    const panel = vscode.window.createWebviewPanel(
        'ramlPreview',
        "RAML Preview",
        vscode.ViewColumn.Two,
        {
            enableScripts: true
        }
    );

    let templatePath = path.join(context.extensionPath, 'raml2html_template', `${config.previewTheme}.nunjucks`);
    let configWithCustomTemplate = raml2html.getConfigForTemplate(templatePath);

    updateSpec(panel, doc, configWithCustomTemplate);

    panel.webview.onDidReceiveMessage(event => {
        if (event.type === 'ready') {
            updateSpec(panel, doc, configWithCustomTemplate);
        }
    }, undefined, showPreview);

    vscode.workspace.onDidSaveTextDocument(event => {
        if (doc.fileName === event.fileName) {
            updateSpec(panel, doc, configWithCustomTemplate);
        }
    });
};

function updateSpec(panel, doc, configWithCustomTemplate) {
    raml2html.render(doc.uri.fsPath, configWithCustomTemplate)
    .then(html => {
        panel.webview.html = html;
    })
    .catch((err) => {
        console.error(err);
        throw err;
    });
}

exports.showPreview = showPreview;