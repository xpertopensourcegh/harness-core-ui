const fs = require('fs')
const path = require('path')
const yaml = require('yaml')
const _ = require('lodash')
const chalk = require('chalk')
const textTable = require('text-table')

const stringsFile = 'src/strings/strings.en.yaml'

const content = fs.readFileSync(path.resolve(process.cwd(), stringsFile), 'utf-8')
const parsedContent = yaml.parse(content)

const REFERENCE_REGEX = /\{\{\s*\$\.(.+?)\s*\}\}/g

const errors = []
const valuesMap = new Map()

function validateReferences(str, path) {
  const matches = str.matchAll(REFERENCE_REGEX)

  for (const match of matches) {
    if (!_.has(parsedContent, match[1])) {
      errors.push([chalk.red('error'), `"${path}" has incorrect reference: "${match[0]}"`])
    }
  }
}

function validateStrings(data, parentPath = []) {
  Object.entries(data).forEach(([key, value]) => {
    const path = [...parentPath, key].join('.')

    if (typeof value === 'string') {
      // only variable values
      if (value.startsWith('{{') && value.endsWith('}}')) {
        validateReferences(value, path)
        return
      }

      if (valuesMap.has(value)) {
        const existingPath = valuesMap.get(value)
        errors.push([
          chalk.red('error'),
          `"${path}" has duplicate value of "${value}". Please use "${existingPath}" instead or extract the value to a common place`
        ])
      } else {
        valuesMap.set(value, path)
        validateReferences(value, path)
      }
    } else {
      validateStrings(value, [...parentPath, key])
    }
  })
}

// perform actual checks
validateStrings(parsedContent)

if (errors.length > 0) {
  console.log(chalk.red(`\n❌ ${errors.length} issues found\n`))
  console.log(textTable(errors))
  process.exit(1)
} else {
  console.log(chalk.green(`\n✅  0 issues found`))
}
