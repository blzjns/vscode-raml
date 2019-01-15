let vscode = require('vscode');

var features = {
    showPreview: require("./showPreview"), //html preview
    completionItemProvider: require('./completionItemProvider'), //autocompletion/intellisense
    documentLinkProvider: require('./documentLinkProvider')
}

function activate(context) {
    
    console.log('RAML starting up...');

    let completionItemProvider = vscode.languages.registerCompletionItemProvider("raml", new features.completionItemProvider.RamlCompletitionProvider(), '.', '/');
    context.subscriptions.push(completionItemProvider);

    let showPreview = vscode.commands.registerCommand('raml.showPreview', features.showPreview.showPreview);
    context.subscriptions.push(showPreview);

    const linkProvider = vscode.languages.registerDocumentLinkProvider('raml',
        new features.documentLinkProvider.RamlDocumentLinkProvider()
    )
}
exports.activate = activate;

function deactivate() {
    features.showPreview.cleanUp();
}
exports.deactivate = deactivate;