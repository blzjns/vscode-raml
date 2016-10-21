// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
let vscode = require('vscode');
var features = {
    showPreview: require("./showPreview"),
    completionItemProvider: require('./completionItemProvider')
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('RAML starting up...');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let completionItemProvider = vscode.languages.registerCompletionItemProvider("raml", new features.completionItemProvider.RamlCompletitionProvider(), '.', '/');
    context.subscriptions.push(completionItemProvider);

    let showPreview = vscode.commands.registerCommand('raml.showPreview', features.showPreview.showPreview);
    context.subscriptions.push(showPreview);    
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    features.showPreview.cleanUp();
}
exports.deactivate = deactivate;