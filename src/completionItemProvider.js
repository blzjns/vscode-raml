const vscode = require('vscode'),
    completion = require('raml-suggestions'),
    path = require('path'),
    fs = require('fs'),
    properties = require('../properties');

class SyncContentProvider {
    contentDirName(content) {
        var contentPath = content.getPath();
        return path.dirname(contentPath);
    }

    dirName(childPath) {
        return path.dirname(childPath);
    };

    exists(checkPath) {
        return fs.existsSync(checkPath);
    };

    resolve(contextPath, relativePath) {
        return path.resolve(contextPath, relativePath);
    };

    isDirectory(dirPath) {
        var stat = fs.statSync(dirPath);
        return stat && stat.isDirectory();
    };

    readDir(dirPath) {
        return fs.readdirSync(dirPath);
    };

    existsAsync(path) {
        return new Promise(resolve => {
            fs.exists(path, (result) => {
                resolve(result);
            })
        });
    };
    readDirAsync(path) {
        return new Promise(resolve => {
            fs.readdir(path, (err, result) => {
                resolve(result)
            })
        });
    };
    isDirectoryAsync(path) {
        return new Promise(resolve => {
            fs.stat(path, (err, stats) => { resolve(stats.isDirectory()) })
        });
    };
}

class FSContent {
    constructor(filePath, offset, text) {
        this.filePath = filePath;
        this.offset = offset;
        this.text = text;
    }

    getText() {
        return this.text;
    };
    getPath() {
        return this.filePath;
    };
    getBaseName() {
        return path.basename(this.filePath);
    };
    getOffset() {
        return this.offset;
    };
}

function getSuggestions(document, position) {
    var t0 = new Date().getMilliseconds();

    try {
        var editorState = new FSContent(
            document.uri.fsPath,
            document.offsetAt(position),
            document.getText()
        );

        let result = completion.suggest(editorState, new SyncContentProvider());
        return result;

    } finally {
        var t1 = new Date().getMilliseconds();
        if(properties.debugging) console.warn("Completion calc:" + (t1 - t0));
    }
}

class RamlCompletitionProvider {
    constructor() {
        this.triggerCharacters = ['.'];
    }

    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            let suggestions = getSuggestions(document, position);

            var ret = [];

            for (var k in suggestions) {
                let itemSuggestion = suggestions[k];

                var baseItem = new vscode.CompletionItem(`${itemSuggestion.displayText || itemSuggestion.text}`);
                baseItem.kind = vscode.CompletionItemKind.Property;
                baseItem.insertText = `${itemSuggestion.text || itemSuggestion.displayText}`;
                baseItem.detail = `${itemSuggestion.category}`;
                baseItem.documentation = `${itemSuggestion.description}`

                ret.push(baseItem)
            }

            resolve(ret);
        });
    }
}

exports.RamlCompletitionProvider = RamlCompletitionProvider