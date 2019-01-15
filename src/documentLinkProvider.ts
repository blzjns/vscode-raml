import * as path from 'path'
import {
  CancellationToken,
  DocumentLink,
  DocumentLinkProvider,
  ProviderResult,
  TextDocument,
  Range,
  Uri
} from 'vscode'

export class RamlDocumentLinkProvider implements DocumentLinkProvider {
  provideDocumentLinks(d: TextDocument, token: CancellationToken): ProviderResult<DocumentLink[]> {
    const text = d.getText()
    const re = /(?:^|\n)((?!\/)[^:]+:\s*(?:(?:\![\w\!]+)\s+?)?\!include\s)(\S+)/g
    let match: ReturnType<typeof re.exec>
    const links: DocumentLink[] = []
    const {fsPath} = d.uri
    while (match = re.exec(text)) {
      const {
        index,
        [0]: line,
        [1]: prefix,
        [2]: link
      } = match
      links.push(new DocumentLink(
        new Range(d.positionAt(index + prefix.length + 1), d.positionAt(index + line.length)),
        Uri.file(path.join(path.dirname(fsPath), link))
      ))
    }
    return links
  }
}