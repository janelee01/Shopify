const path = require('path')
const fs = require('fs')
const glob = require("glob")

function getSrcDir () {
  return path.resolve(__dirname, './')
}

function getDistDir (childDir = '') {
  const dir = path.resolve(__dirname, `./dist/${childDir}`)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
  }
  return dir
}

function writeFile (name, output, mime = 'liquid', childDir = '') {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(`${getDistDir(childDir)}/${name}.${mime}`, output)
  })
}

function writeSnippet (name, output, mime = 'liquid', childDir = '') {
  return new Promise((resolve, reject) => {
    fs.writeFileSync(`${getSrcDir()}/../../src/snippets/${name}.${mime}`, output)
  })
}

function escape (string) {
  return string
    .replace(/©/g, '&#169;')
    .replace(/–/g, '&#8211;')
  // return Entities.encodeNonASCII(string)
}

function getLiquidScope () {
  return {}
}

function getSrcFiles () {
  return glob.sync(`${getSrcDir()}/data/*.json`)
}

module.exports = {
  getSrcDir,
  getDistDir,
  writeFile,
  escape,
  getLiquidScope,
  getSrcFiles,
  writeSnippet
}
