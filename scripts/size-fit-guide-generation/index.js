const fs = require('fs')
const Liquid = require('liquidjs')
const glob = require("glob")

const {
  getSrcDir,
  getDistDir,
  writeFile,
  escape,
  getLiquidScope,
  getSrcFiles,
  writeSnippet
} = require('./@util')

const sourceFiles = getSrcFiles()

const engine = new Liquid({
  root: getSrcDir(),
  extname: '.liquid'
})

const renderSizeFitSnippets = name => {
  return new Promise((resolve, reject) => {
    const data = require(name)
    resolve(data)
  })
  .then(scope => {
    return engine.renderFile('template.liquid', {
      ...scope
    })
  })
  .then(output => {
    const fileName = name
      .split('/')
      .pop()
      .replace('.json', '')
    writeFile(`pdp-size-fit-${fileName}`, output)
    writeSnippet(`pdp-size-fit-${fileName}`, output)
  })
  .catch(err => {
    console.error(err)
  })
}

sourceFiles.reduce((promiseChain, name) => {
  return promiseChain.then(chainResults =>
    renderSizeFitSnippets(name).then(currentResult =>
        [ ...chainResults, currentResult ]
      )
  )
}, Promise.resolve([])).then(arrayOfResults => {
  console.dir('All fit guides compiled')
})

