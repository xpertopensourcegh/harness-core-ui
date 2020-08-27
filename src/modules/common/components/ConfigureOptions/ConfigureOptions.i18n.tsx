import React from 'react'

export default {
  configureOptions: 'configure options',
  variable: 'Variable',
  type: 'Type',
  defaultValue: 'Default value',
  requiredDuringExecution: 'Required during execution',
  validation: 'Validation',
  none: 'None',
  allowedValues: 'Allowed values',
  regex: 'Regex',
  allowedValuesHelp: 'Allowed values (comma separated list)',
  advanced: 'advanced',
  values: 'Values',
  notValidExpression: 'Not a valid input Expression',
  advancedHelp: `With the advanced option, you can type in JEXL expressions to return a list of values. ${(
    <a target="_blank">More information</a>
  )} \n E.g. \${env.type} == “prod” ? aws1, aws2 : aws3, aws4`,
  submit: 'Submit',
  cancel: 'Cancel'
}
