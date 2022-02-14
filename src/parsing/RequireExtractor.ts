import { none, option, some } from '@octantis/option'
import * as Parser from 'tree-sitter'
import { Service } from 'typedi'
import DependencyExtractor from './DependencyExtractor'
import ImportData from './ImportData'

@Service()
export default class RequireExtractor implements DependencyExtractor {
  getDependencies(ast: Parser.Tree): ImportData[] {
    return this.collectRequires(ast.rootNode)
  }

  private extractRequireData(node: Parser.SyntaxNode): option<ImportData> {
    const declare = node.children[1]
    // return { path }
    return none()
  }

  private getStatementBlock(
    node: Parser.SyntaxNode
  ): option<Parser.SyntaxNode> {
    const found = node.children.find((s) => s.type === 'statement_block')
    if (typeof found === 'undefined') {
      return none()
    }
    return some(found)
  }

  private collectRequires(node: Parser.SyntaxNode): ImportData[] {
    const out: ImportData[] = []
    for (const child of node.children) {
      if (child.type === 'lexical_declaration') {
        for (const data of this.extractRequireData(child)) {
          out.push(data)
        }
      } else if (child.type === 'function_declaration') {
        const block = this.getStatementBlock(child).get()
        out.push(...this.collectRequires(block))
      }
    }
    return out
  }
}
