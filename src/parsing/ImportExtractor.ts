import { none, option, some } from '@octantis/option'
import * as Parser from 'tree-sitter'
import { Service } from 'typedi'

export interface ImportData {
  references: string[]
  path: string
}

@Service()
export default class ImportExtractor {
  private onlyImportStatements(node: Parser.SyntaxNode) {
    return node.type === 'import_statement'
  }

  private asText(node: Parser.SyntaxNode): string {
    return node.text
  }

  private onlyImportSpecifierNodes(node: Parser.SyntaxNode) {
    return node.type === 'import_specifier'
  }

  private collectReferences(references: Parser.SyntaxNode): option<string[]> {
    switch (references.type) {
      case 'identifier':
        return some([references.text])
      case 'namespace_import':
        return some([references.children[2].text])
      case 'named_imports':
        return some(
          references.children
            .filter(this.onlyImportSpecifierNodes)
            .map(this.asText)
        )
    }
    return none()
  }

  private asImportData(node: Parser.SyntaxNode): ImportData {
    const [, { children }, , route] = node.children
    return {
      references: this.collectReferences(children[0]).get(),
      path: route.text.slice(1, -1),
    }
  }

  getImports(ast: Parser.Tree): ImportData[] {
    return ast.rootNode.children
      .filter(this.onlyImportStatements)
      .map(this.asImportData.bind(this))
  }
}
