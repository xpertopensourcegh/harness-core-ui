const fs = require('fs')
const path = require('path')

const yaml = require('yaml')
const _ = require('lodash')
const { node } = require('webpack')

const stringsFile = 'src/strings/strings.en.yaml'

module.exports = {
  meta: {
    type: 'problem'
  },
  create(context) {
    const content = fs.readFileSync(path.resolve(process.cwd(), stringsFile), 'utf-8')
    const { global: globalNamespace, ...otherNamespaces } = yaml.parse(content)

    function getLiteralValue(node) {
      if (node.value.type === 'Literal') {
        return node.value.value
      }

      if (node.value.type === 'JSXExpressionContainer' && node.value.expression.type === 'Literal') {
        return node.value.expression.value
      }
    }

    return {
      JSXElement(node) {
        if (_.get(node, 'openingElement.name.name') === 'String') {
          const attrs = _.get(node, 'openingElement.attributes') || []
          const stringID = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'stringID')
          const namespace = attrs.find(attr => attr.type === 'JSXAttribute' && attr.name.name === 'namespace')

          if (!stringID) return

          const pathToStr = getLiteralValue(stringID)

          if (!pathToStr) return

          const notPresentInGlobal = typeof _.get(globalNamespace, pathToStr) !== 'string'

          // check in namespace attribute is defined
          if (namespace) {
            const nsStr = getLiteralValue(namespace)

            // check if a namespace value is empty string
            if (nsStr === '') {
              return context.report(node, node.loc, 'Namespace cannot be empty')
            }

            // if namespace is not a static string return
            if (!nsStr) return

            // check if a namespace value is valid value
            if (!_.has(otherNamespaces, nsStr)) {
              return context.report(node, node.loc, `Namespace "${nsStr}" does not exist`)
            }

            // check if a default value is defined in global scope before overriding it.
            if (notPresentInGlobal) {
              return context.report(
                node,
                node.loc,
                `A default string with key "${pathToStr}" does not exists in "global" namespace. Please add a default string in global namespace first. Then provide override using namespaces.`
              )
            }

            const notPresentInNamespace = typeof _.get(otherNamespaces[nsStr], pathToStr) !== 'string'

            // check if value is defined in namespace
            if (notPresentInNamespace) {
              return context.report(
                node,
                node.loc,
                `A string with key "${pathToStr}" does not exists in ${nsStr} namespace. This will fallback to "global" namespace. Please remove the namespace.`
              )
            }
          }

          if (notPresentInGlobal) {
            return context.report(
              node,
              node.loc,
              `A string with key "${pathToStr}" does not exists in "global" namespace`
            )
          }
        }
      }
    }
  }
}
