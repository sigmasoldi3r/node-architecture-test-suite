import * as Parser from 'tree-sitter'
import ImportData from './ImportData'

export default interface DependencyExtractor {
  getDependencies(ast: Parser.Tree): ImportData[]
}
