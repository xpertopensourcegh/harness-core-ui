const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const _ = require('lodash')
const chalk = require('chalk')

const stringsFile = 'src/strings/strings.en.yaml'

const content = fs.readFileSync(path.resolve(process.cwd(), stringsFile), 'utf-8')
const { global: globalNamespace, ...otherNamespaces } = yaml.parse(content)

let errors = 0

// check for duplicate values
const valuesMap = new Map()
function checkForDuplicateValues(ns, data, parentPath = []) {
  Object.keys(data).forEach(key => {
    const value = data[key]
    const path = [...parentPath, key].join('.')

    if (typeof value === 'string') {
      if (valuesMap.has(value)) {
        errors++
        console.log(
          `${chalk.red('error')} '${path}' has duplicate value of '${value}'. Please use "${valuesMap.get(
            value
          )}" instead or extract the value to a common place`
        )
      } else {
        valuesMap.set(value, `(${ns}) ${path}`)
      }
    } else {
      checkForDuplicateValues(ns, value, [...parentPath, key])
    }
  })
}

// overrides should be present only if they are defined in global namespace
function checkKeyinGlobalNameSpace(data, parentPath = []) {
  Object.keys(data).forEach(key => {
    const value = data[key]
    const path = [...parentPath, key].join('.')

    if (typeof value === 'string') {
      // do not merge the if condition checks. They are required to be sepreate in order to work properly
      if (!_.has(globalNamespace, path)) {
        errors++
        console.log(
          `${chalk.red(
            'error'
          )} '${path}' is not defined in global namespace. Namespaces are meant to be used only for overrides.`
        )
      } else {
        // do nothing
      }
    } else {
      checkKeyinGlobalNameSpace(value, [...parentPath, key])
    }
  })
}

// perform actual checks
console.log(chalk.blueBright(`\nNamespace: global`))
checkForDuplicateValues('global', globalNamespace)

Object.keys(otherNamespaces).forEach(ns => {
  console.log(chalk.blueBright(`\nNamespace: ${ns}`))
  checkForDuplicateValues(ns, otherNamespaces[ns])
  checkKeyinGlobalNameSpace(otherNamespaces[ns])
})

if (errors > 0) {
  console.log(chalk.red(`\n❌ ${errors} errors found`))
  process.exit(1)
} else {
  console.log(chalk.green(`\n✅  0 errors found`))
}
