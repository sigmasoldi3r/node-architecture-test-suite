import { join, extname } from 'path'
import zlib from 'zlib'
import * as util from 'util'

// Sample service
export class ExampleService {
  async something(str: string) {
    await new Promise((r) => process.nextTick(r))
    return join(str, 'mundane')
  }
}
