export default {
  stepConfiguration: 'Step Configuration',
  stepGroupConfiguration: 'Step Group Configuration',
  advanced: 'Advanced',
  skipCondition: 'Skip Condition',
  skipConditionLabel: 'If the JEXL condition evaluates to true, skip this step',
  skipConditionHelpText: `In the JEXL expression, you could use any of the pipeline variables - including the output of any previous steps.

Examples:
<+steps.step1.output.result> == “success”
<+environment.name> != “QA”`,
  learnMore: 'Learn more',
  save: 'Save',
  cancel: 'Cancel'
}
