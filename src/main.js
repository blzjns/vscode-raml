let vscode = require('vscode');

var features = {
    showPreview: require("./showPreview"), //html preview
    completionItemProvider: require('./completionItemProvider') //autocompletion/intellisense
}

function activate(context) {
    
    console.log('RAML starting up...');

    let completionItemProvider = vscode.languages.registerCompletionItemProvider("raml", new features.completionItemProvider.RamlCompletitionProvider(), '.', '/');
    context.subscriptions.push(completionItemProvider);

    let showPreview = vscode.commands.registerCommand('raml.showPreview', features.showPreview.showPreview);
    context.subscriptions.push(showPreview);    
}
exports.activate = activate;

function deactivate() {
    features.showPreview.cleanUp();
}
exports.deactivate = deactivate;