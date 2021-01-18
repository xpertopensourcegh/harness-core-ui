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
          message: 'A string definition with key "foobar" does not exists.',
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
          message: 'A string definition with key "foobar" does not exists.',
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
          message: 'A string definition with key "foobar" does not exists.',
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
          message: 'A string definition with key "foobar" does not exists.',
          type: 'CallExpression'
        }
      ]
    }
  ]
})
