# RAML support for Visual Studio Code
This is a RAML preview, auto-completion/intellisense, and syntax highlighting implementation for VS Code based on [jlandersen/vscode-raml](https://github.com/jlandersen/vscode-raml) project, [raml2html](https://github.com/raml2html/raml2html), and [raml-suggestions](https://github.com/mulesoft/raml-suggestions/).

## Pre-reqs 
Having [node js](https://nodejs.org/en/) installed, also install [raml2html](https://www.npmjs.com/package/raml2html) globally:
```
npm i -g raml2html
```

## Preview Theme option
The following Visual Studio Code settings are available for the vscode-raml extension. These can be set in user preferences (cmd+,) or workspace settings (.vscode/settings.json).

```
{
    "raml.previewTheme": "light"
}
```

## Screenshot
![Screenshot-1](media/screenshot_highlight.png)
![Screenshot-2](media/screenshot_preview.png)