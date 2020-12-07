const { RuleTester } = require('eslint')
const rule = require('../string-exists-in-yaml')

const ruleTester = new RuleTester()

const parserOptions = {
  ecmaVersion: 2020,
  ecmaFeatures: {
    jsx: true
  }
}

ruleTester.run('string-exists-in-yaml', rule, {
  valid: [
    {
      code: '<String stringID="harness" />',
      parserOptions
    },
    {
      code: '<String stringID="harness" namespace="testing" />',
      parserOptions
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings()

            return (
                <div>
                  <div>{getString('harness')}</div>
                  {props.items.map((item) => {
                      return <div key={item}>{getString('harness')}</div>
                  })}
                </div>
            )
        }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
              const { getString } = useStrings('testing')

              return (
                  <div>
                    <div>{getString('harness')}</div>
                    {props.items.map((item) => {
                        return <div key={item}>{getString('harness')}</div>
                    })}
                  </div>
              )
          }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
              const { getString: getGlobalString } = useStrings()
              const { getString } = useStrings('testing')

              return (
                  <div>
                    <div>{getGlobalString('harness')}</div>
                    {props.items.map((item) => {
                        return <div key={item}>{getString('harness')}</div>
                    })}
                  </div>
              )
          }`,
      parserOptions
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings()

              return (
                  <div>
                    <div>{getStringAliased('harness')}</div>
                    {props.items.map((item) => {
                        return <div key={item}>{getStringAliased('harness')}</div>
                    })}
                  </div>
              )
          }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
                const { getString:  getStringAliased } = useStrings('testing')

                return (
                    <div>
                      <div>{getStringAliased('harness')}</div>
                      {props.items.map((item) => {
                          return <div key={item}>{getStringAliased('harness')}</div>
                      })}
                    </div>
                )
            }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
                const { getString: getGlobalString } = useStrings()
                const { getString:  getStringAliased } = useStrings('testing')

                return (
                    <div>
                      <div>{getGlobalString('harness')}</div>
                      {props.items.map((item) => {
                          return <div key={item}>{getStringAliased('harness')}</div>
                      })}
                    </div>
                )
            }`,
      parserOptions
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
                const strings = useStrings()

                return (
                    <div>
                      <div>{getStringAliased('harness')}</div>
                      {props.items.map((item) => {
                          return <div key={item}>{getStringAliased('harness')}</div>
                      })}
                    </div>
                )
            }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
                  const strings = useStrings('testing')

                  return (
                      <div>
                        <div>{getStringAliased('harness')}</div>
                        {props.items.map((item) => {
                            return <div key={item}>{getStringAliased('harness')}</div>
                        })}
                      </div>
                  )
              }`,
      parserOptions
    },
    {
      code: `function MyComponent(props) {
                  const globalStrings = useStrings()
                  const strings = useStrings('testing')

                  return (
                      <div>
                        <div>{globalStrings.getString('harness')}</div>
                        {props.items.map((item) => {
                            return <div key={item}>{strings.getString('harness')}</div>
                        })}
                      </div>
                  )
              }`,
      parserOptions
    }
  ],
  invalid: [
    {
      code: '<String stringID="" />',
      parserOptions,
      errors: [
        {
          message: 'StringID cannot be empty.',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="foobar" />',
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" does not exists in "global" namespace.',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="harness" namespace="" />',
      parserOptions,
      errors: [
        {
          message: 'Namespace cannot be empty. Either use a correct namespace or remove it.',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="harness" namespace="foobar" />',
      parserOptions,
      errors: [
        {
          message: 'Namespace "foobar" does not exist',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="" namespace="" />',
      parserOptions,
      errors: [
        {
          message: 'StringID cannot be empty.',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="foobar" namespace="foobar" />',
      parserOptions,
      errors: [
        {
          message: 'Namespace "foobar" does not exist',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="foobar" namespace="testing" />',
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" exists neither in "testing" namespace nor in "global" namespace.',
          type: 'JSXElement'
        }
      ]
    },
    {
      code: '<String stringID="status" namespace="testing" />',
      parserOptions,
      errors: [
        {
          message:
            'A string with key "status" does not exists in "testing" namespace, this will fallback to "global" namespace. Please remove the namespace.',
          type: 'JSXElement'
        }
      ]
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
          const { getString } = useStrings()

          return (
              <div>
                <div>{getString('')}</div>
              </div>
          )
      }`,
      parserOptions,
      errors: [
        {
          message: 'StringID cannot be empty.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings()

            return (
                <div>
                  <div>{getString('foobar')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" does not exists in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings('')

            return (
                <div>
                  <div>{getString('foobar')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace cannot be empty. Either use a correct namespace or remove it.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings('foobar')

            return (
                <div>
                  <div>{getString('harness')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace "foobar" does not exist',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings('testing')

            return (
                <div>
                  <div>{getString('foobar')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" exists neither in "testing" namespace nor in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
            const { getString } = useStrings('testing')

            return (
                <div>
                  <div>{getString('status')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message:
            'A string with key "status" does not exists in "testing" namespace, this will fallback to "global" namespace. Please remove the namespace.',
          type: 'CallExpression'
        }
      ]
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
            const { getString:  getStringAliased } = useStrings()

            return (
                <div>
                  <div>{getStringAliased('')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'StringID cannot be empty.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings()

              return (
                  <div>
                    <div>{getStringAliased('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" does not exists in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings('')

              return (
                  <div>
                    <div>{getStringAliased('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace cannot be empty. Either use a correct namespace or remove it.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings('foobar')

              return (
                  <div>
                    <div>{getStringAliased('harness')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace "foobar" does not exist',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings('testing')

              return (
                  <div>
                    <div>{getStringAliased('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" exists neither in "testing" namespace nor in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const { getString:  getStringAliased } = useStrings('testing')

              return (
                  <div>
                    <div>{getStringAliased('status')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message:
            'A string with key "status" does not exists in "testing" namespace, this will fallback to "global" namespace. Please remove the namespace.',
          type: 'CallExpression'
        }
      ]
    },
    /**********************************************************************************************/
    /**********************************************************************************************/
    /**********************************************************************************************/
    {
      code: `function MyComponent(props) {
            const strings = useStrings()

            return (
                <div>
                  <div>{strings.getString('')}</div>
                </div>
            )
        }`,
      parserOptions,
      errors: [
        {
          message: 'StringID cannot be empty.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const strings = useStrings()

              return (
                  <div>
                    <div>{strings.getString('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" does not exists in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const strings = useStrings('')

              return (
                  <div>
                    <div>{strings.getString('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace cannot be empty. Either use a correct namespace or remove it.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const strings = useStrings('foobar')

              return (
                  <div>
                    <div>{strings.getString('harness')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'Namespace "foobar" does not exist',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const strings = useStrings('testing')

              return (
                  <div>
                    <div>{strings.getString('foobar')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message: 'A string with key "foobar" exists neither in "testing" namespace nor in "global" namespace.',
          type: 'CallExpression'
        }
      ]
    },
    {
      code: `function MyComponent(props) {
              const strings = useStrings('testing')

              return (
                  <div>
                    <div>{strings.getString('status')}</div>
                  </div>
              )
          }`,
      parserOptions,
      errors: [
        {
          message:
            'A string with key "status" does not exists in "testing" namespace, this will fallback to "global" namespace. Please remove the namespace.',
          type: 'CallExpression'
        }
      ]
    }
  ]
})
