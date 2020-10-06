export default {
  placeholder: 'placeholder',
  optional: 'optional',
  name: 'Name',
  nameOptional: 'Name (optional)',
  desc: 'Description',
  descOptional: 'Description (optional)',
  trueFlag: 'True',
  falseFlag: 'False',
  saveAndContinue: 'Save and Continue',
  percentage: 'Percentage Rollout',
  back: 'Back',
  close: 'Close',
  aboutFlag: {
    aboutFlagHeading: 'About the flag',
    permaFlag: 'This is a permanent flag',
    nameRequired: 'Name is required',
    idRequired: 'Identifier is required',
    ffNamePlaceholder: 'Enter Feature Flag name...',
    ffRegex: 'Identifier can only contain alphanumerics, _ and $',
    tags: 'Tags',
    tagsOptional: 'Tags (optional)',
    tagsPlaceholder: 'Add Tags',
    permaFlagTooltip:
      "A flag is permanent if you wish to keep it in your code for the long term. We won't remind you to these types of flags. "
  },
  varSettingsFlag: {
    variationSettingsHeading: 'Variation settings',
    boolVal: 'Boolean',
    multiVal: 'Multivariate',
    variation: 'Variation',
    flagType: 'Flag Type',
    defaultRules: 'Default rules for the flag',
    flagOn: 'If the flag is ON, serve',
    flagOff: 'If the flag is OFF, serve',
    saveAndClose: 'Save and Close',
    testFlagOption: 'test the feature flag',
    defaultRulesTooltip: 'Define which variation users will see by default when the flag is ON or OFF',
    jsonType: 'json',
    stringType: 'string',
    numberType: 'number',
    descVariationsPlaceholder: 'What is your variation about?',
    percentageRollout: 'Percentage Rollout'
  },
  testTheFlag: {
    testFlagHeading: 'Test the flag',
    setupAppText: "Let's set up your application and code so that it can communicate with our platform",
    selectSdk: 'Select Your SDK',
    sdkClient: 'Client',
    sdkServer: 'Server',
    selectSdkLanguage: 'Select the language',
    installNode: 'Install Node.js dependency',
    initClient: 'Initialize Client SDK',
    codeSample: 'Place this sample code we generated of your feature flag into your code',
    codeSampleNote:
      'Please note that in the above example, it is whatever gets generated. This is just an example. This area can contain some minor notes if necessary.',
    verify: 'Verify',
    verifyText:
      "Once you're done, run your application so that we can verify that we are able to receive analytic events for your feature.",
    testFlagTargetHeading: 'Testing feature flag on production environment'
  }
}
