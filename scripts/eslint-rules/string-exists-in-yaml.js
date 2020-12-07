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

function checkAndReportIssues({ context, node, pathToStr, nsStr, globalNamespace, otherNamespaces, def }) {
  if (_.isNil(pathToStr)) {
    // it can be undefined in cases of conditional assignment and/or template literals
    return
  }

  if (pathToStr === '') {
    return context.report(node, node.loc, 'StringID cannot be empty.')
  }

  // check if a namespace value is empty string
  if (nsStr === '') {
    return context.report(
      def ? _.get(def, 'node.init') : node,
      def ? _.get(def, 'node.init.loc') : node.loc,
      'Namespace cannot be empty. Either use a correct namespace or remove it.'
    )
  }

  const namespaceDefined = !_.isNil(nsStr)
  const presentInGlobal = isValidType(_.get(globalNamespace, pathToStr))
  const validNamespace = !namespaceDefined || _.has(otherNamespaces, nsStr)
  const presentInNamespace = isValidType(_.get(otherNamespaces[nsStr], pathToStr))

  // check if a namespace value is valid value
  if (!validNamespace) {
    return context.report(
      def ? _.get(def, 'node.init') : node,
      def ? _.get(def, 'node.init.loc') : node.loc,
      `Namespace "${nsStr}" does not exist`
    )
  }

  // check if a default value is defined in global scope before overriding it.
  if (namespaceDefined) {
    if (presentInNamespace) {
      //
      if (presentInGlobal) {
        // do nothing
      } else {
        // not presentInGlobal
        context.report(
          node,
          node.loc,
          `A default string with key "${pathToStr}" does not exists in "global" namespace. Please add a default string in "global" namespace first, then provide override using namespaces.`
        )
      }
    } else {
      // not presentInNamespace

      if (presentInGlobal) {
        context.report(
          node,
          node.loc,
          `A string with key "${pathToStr}" does not exists in "${nsStr}" namespace, this will fallback to "global" namespace. Please remove the namespace.`
        )
      } else {
        context.report(
          node,
          node.loc,
          `A string with key "${pathToStr}" exists neither in "${nsStr}" namespace nor in "global" namespace.`
        )
      }
    }
  } else {
    if (!presentInGlobal) {
      context.report(node, node.loc, `A string with key "${pathToStr}" does not exists in "global" namespace.`)
    }
  }
}

module.exports = {
  meta: {
    type: 'problem'
  },
  create(context) {
    const content = fs.readFileSync(path.resolve(process.cwd(), stringsFile), 'utf-8')
    const { global: globalNamespace, ...otherNamespaces } = yaml.parse(content)

    return {
      JSXElement(node) {
        if (_.get(node, 'openingElement.name.name') === 'String') {
          const attrs = _.get(node, 'openingElement.attributes') || []
          const stringID = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'stringID')
          const namespace = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'namespace')

          const pathToStr = getLiteralValue(stringID)
          const nsStr = getLiteralValue(namespace)

          checkAndReportIssues({ context, node, pathToStr, nsStr, globalNamespace, otherNamespaces })
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
          const nsStr = getLiteralValue({ value: _.get(def, 'node.init.arguments[0]') })
          const pathToStr = getLiteralValue({ value: _.get(node, 'arguments[0]') })

          checkAndReportIssues({ context, node, pathToStr, nsStr, globalNamespace, otherNamespaces, def })
        } else if (defType === 'Identifier' && isUseString(def)) {
          // example: const strings = useStrings()
          const nsStr = getLiteralValue({ value: _.get(def, 'node.init.arguments[0]') })
          const pathToStr = getLiteralValue({ value: _.get(node, 'arguments[0]') })

          checkAndReportIssues({ context, node, pathToStr, nsStr, globalNamespace, otherNamespaces, def })
        }
      }
    }
  }
}
