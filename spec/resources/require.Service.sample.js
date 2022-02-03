const tty = require('tty')
const { join, extname } = require('path')

function sample() {
  const s = require('url')
}

module.exports = class ExampleService {
  someFunction(a) {
    return tty.isatty() + join(a, 'b')
  }
}
