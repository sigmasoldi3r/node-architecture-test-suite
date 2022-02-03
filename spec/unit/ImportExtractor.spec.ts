import 'reflect-metadata'
import { expect } from 'chai'
import Container from 'typedi'
import ImportExtractor from '../../src/parsing/ImportExtractor'
import { readFileSync } from 'fs'
import * as Parser from 'tree-sitter'

const SOURCE_PATH = 'spec/resources/import.Service.sample.ts'

describe('Import extraction object', () => {
  const service = Container.get(ImportExtractor)
  it('Should be registered in the container', () => {
    expect(service).to.be.instanceOf(ImportExtractor)
  })
  const raw = readFileSync(SOURCE_PATH).toString()
  const parser = new Parser()
  parser.setLanguage(require('tree-sitter-typescript').typescript)
  const ast = parser.parse(raw)
  it('Should extract all top level imports', () => {
    const imports = service.getDependencies(ast)
    expect(imports.length).to.be.eq(3)
  })
  it('Should extract identifier-type import data', () => {
    const imports = service.getDependencies(ast)
    expect(imports[0].path).to.be.eq('path')
    expect(imports[0].references.length).to.be.eq(2)
    expect(imports[0].references[0]).to.be.eq('join')
    expect(imports[0].references[1]).to.be.eq('extname')
  })
  it('Should extract namespace-type import data', () => {
    const imports = service.getDependencies(ast)
    expect(imports[1].path).to.be.eq('zlib')
    expect(imports[1].references.length).to.be.eq(1)
    expect(imports[1].references[0]).to.be.eq('zlib')
  })
  it('Should extract named-type import data', () => {
    const imports = service.getDependencies(ast)
    expect(imports[2].path).to.be.eq('util')
    expect(imports[2].references.length).to.be.eq(1)
    expect(imports[2].references[0]).to.be.eq('util')
  })
})
