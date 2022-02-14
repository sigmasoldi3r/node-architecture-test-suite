import 'reflect-metadata'
import { typescript } from 'tree-sitter-typescript'
import * as Parser from 'tree-sitter'
import * as fs from 'fs'
import { option, some, none } from '@octantis/option'
import { classes, noClasses } from './expect'

class Analyzer {
  constructor(readonly ast: Parser.Tree) {}

  /**
   * Gets top-level import data from the source tree.
   */
  getImports() {
    return this.ast.rootNode.children
      .filter((s) => s.type === 'import_statement')
      .map((i) => {
        const [, { children: refs }, , route] = i.children
        let references: option<string[]> = none()
        const [extract] = refs
        if (extract.type === 'identifier') {
          references = some([extract.text])
        } else if (extract.type === 'namespace_import') {
          references = some([extract.children[2].text])
        } else if (extract.type === 'named_imports') {
          references = some(extract.children.slice(1, -1).map((s) => s.text))
        }
        return {
          references: references.get(),
          path: route.text.slice(1, -1),
        }
      })
  }
}

export class Main {
  static testAssert() {
    console.log(classes().that.clogged)
    console.log(noClasses().that.clogged)
  }

  static async main() {
    const parser = new Parser()
    parser.setLanguage(typescript)
    const src = fs.readFileSync('resources/controllers/sample.ts').toString()
    const ast = await parser.parse(src)
    const analyzer = new Analyzer(ast)
    const imports = analyzer.getImports()
    console.log(imports)
    this.testAssert()
    return 0
  }
}
