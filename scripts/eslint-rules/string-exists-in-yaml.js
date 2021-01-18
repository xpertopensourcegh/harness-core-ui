const fs = require('fs')
const path = require('path')

const yaml = require('yaml')
const _ = require('lodash')
const { node } = require('webpack')

const stringsFile = 'src/strings/strings.en.yaml'

function isValidType(val) {
  return _.isString(val) || _.isNumber(val) || _.isBoolean(val)
}

function checkForUseString(variable) {
  const def = variable && Array.isArray(variable.defs) ? variable.defs[0] : null

  if (!def) return

  if (_.get(def, 'node.type') === 'VariableDeclarator') {
    switch (_.get(def, 'node.id.type')) {
      case 'ObjectPattern':
        // const { getString } = useStrings()
        if (isUseString(def) && isGetString(def, variable.name)) {
          // check if key is "getString" and RHS is "useStrings"
          objectPatternVars.set(variable.name, variable)
        }
        return
      case 'Identifier':
        // const strings = useStrings()
        if (isUseString(def)) {
          // check if RHS is "useStrings"
          identifierVars.set(variable.name, variable)
        }
        return
      default:
        return
    }
  }
}

function isGetString(def, varName) {
  const getStringVar = _.get(def, 'node.id.properties', []).find(
    prop => _.get(prop, 'key.name') === 'getString' && _.get(prop, 'value.name') === varName
  )

  return !!getStringVar
}

function isUseString(def) {
  return _.get(def, 'node.init.type') === 'CallExpression' && _.get(def, 'node.init.callee.name') === 'useStrings'
}

function getLiteralValue(node) {
  const type = _.get(node, 'value.type')

  if (type === 'Literal') {
    return _.get(node, 'value.value')
  }

  if (type === 'JSXExpressionContainer' && _.get(node, 'value.expression.type') === 'Literal') {
    return _.get(node, 'value.expression.value')
  }
}

function checkAndReportIssues({ context, node, pathToStr, stringsData, def }) {
  if (_.isNil(pathToStr)) {
    // it can be undefined in cases of conditional assignment and/or template literals
    return
  }

  if (pathToStr === '') {
    return context.report(node, node.loc, 'StringID cannot be empty.')
  }

  const presentInData = isValidType(_.get(stringsData, pathToStr))

  if (!presentInData) {
    context.report(node, node.loc, `A string definition with key "${pathToStr}" does not exists.`)
  }
}

module.exports = {
  meta: {
    type: 'problem'
  },
  create(context) {
    const content = fs.readFileSync(path.resolve(process.cwd(), stringsFile), 'utf-8')
    const stringsData = yaml.parse(content)

    return {
      JSXElement(node) {
        if (_.get(node, 'openingElement.name.name') === 'String') {
          const attrs = _.get(node, 'openingElement.attributes') || []
          const stringID = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'stringID')

          const pathToStr = getLiteralValue(stringID)

          checkAndReportIssues({ context, node, pathToStr, stringsData })
        }
      },
      CallExpression(node) {
        const scope = context.getScope(node)

        let name = ''

        if (_.get(node, 'callee.type') === 'MemberExpression' && _.get(node, 'callee.property.name') === 'getString') {
          name = _.get(node, 'callee.object.name')
        }

        if (_.get(node, 'callee.type') === 'Identifier') {
          name = _.get(node, 'callee.name')
        }

        if (!name) return

        const varNode = scope.variables.find(item => item.name === name)

        if (!varNode) return

        const def = _.get(varNode, ['defs', 0])

        if (!def) return

        const defType = _.get(def, 'node.id.type')

        if (defType === 'ObjectPattern' && isUseString(def)) {
          // example: const { getString } = useStrings()
          const pathToStr = getLiteralValue({ value: _.get(node, 'arguments[0]') })

          checkAndReportIssues({ context, node, pathToStr, stringsData, def })
        } else if (defType === 'Identifier' && isUseString(def)) {
          // example: const strings = useStrings()
          const pathToStr = getLiteralValue({ value: _.get(node, 'arguments[0]') })

          checkAndReportIssues({ context, node, pathToStr, stringsData, def })
        }
      }
    }
  }
}
