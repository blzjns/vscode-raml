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

// function getSuggestion(lineText, aboveLine, positionLine) {

//     var ret = [];
//     console.log("Line Text: " + lineText);
//     console.log("Above line: " + aboveLine);
//     console.log("Line position: " + positionLine);

//     if (lineText.indexOf("#") == 0) {
//         for (var key in suggestions.version) {
//             var ramlVersionItem = new vscode.CompletionItem(`${suggestions.version[key]}`);
//             ramlVersionItem.kind = vscode.CompletionItemKind.File;
//             ramlVersionItem.insertText = `${suggestions.version[key].substring(1)}`;
//             ramlVersionItem.detail = "version"
//             ramlVersionItem.documentation = "RAML version"

//             ret.push(ramlVersionItem);
//         }
//     }

//     else if (aboveLine.indexOf("protocols:") >= 0) {
//         for (var i in suggestions.protocols) {
//             var baseItem = new vscode.CompletionItem(`${suggestions.protocols[i]}`);
//             baseItem.kind = vscode.CompletionItemKind.Property;
//             baseItem.insertText = `${suggestions.protocols[i]}: `;
//             baseItem.detail = "protocols";
//             baseItem.documentation = "protocols"

//             ret.push(baseItem);
//         }

//     }

//     //if has no space in the beggining
//     else if (lineText.length == 0) {
//         for (var b in suggestions.mapping.base) {
//             var section = suggestions.mapping.base[b];
//             var sectionList = suggestions[suggestions.mapping.base[b]];

//             for (var i in sectionList) {
//                 var baseItem = new vscode.CompletionItem(`${sectionList[i]}`);
//                 baseItem.kind = vscode.CompletionItemKind.Property;
//                 baseItem.insertText = `${sectionList[i]}: `;
//                 baseItem.detail = section;
//                 baseItem.documentation = section

//                 ret.push(baseItem);
//             }
//         }
//     }

//     //if above line is an endpoint
//     else {
//         for (var b in suggestions.mapping.endpoint) {
//             var section = suggestions.mapping.endpoint[b].substring(1);
//             var sectionList = suggestions[suggestions.mapping.endpoint[b]];

//             for (var i in sectionList) {
//                 var baseItem = new vscode.CompletionItem(`${sectionList[i]}`);
//                 baseItem.kind = vscode.CompletionItemKind.Property;
//                 baseItem.insertText = `${sectionList[i]}:`;
//                 baseItem.detail = section;
//                 baseItem.documentation = section

//                 ret.push(baseItem);
//             }
//         }
//     }

//     return ret;
// }