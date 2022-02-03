import 'reflect-metadata'
import { expect } from 'chai'
import Container from 'typedi'
import RequireExtractor from '../../src/parsing/RequireExtractor'
import { readFileSync } from 'fs'
import * as Parser from 'tree-sitter'

const SOURCE_PATH = 'spec/resources/require.Service.sample.js'

describe('Require expression extraction object', () => {
  const service = Container.get(RequireExtractor)
  it('Should be registered in the container', () => {
    expect(service).to.be.instanceOf(RequireExtractor)
  })
  const raw = readFileSync(SOURCE_PATH).toString()
  const parser = new Parser()
  parser.setLanguage(require('tree-sitter-typescript').typescript)
  const ast = parser.parse(raw)
  it('Should extract all top level imports', () => {
    const imports = service.getDependencies(ast)
    expect(imports.length).to.be.eq(3)
  })
})
