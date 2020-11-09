export default {
  STEP: {
    ONE: {
      NAME: 'CONNECTOR DETAILS'
    },
    TWO: {
      NAME: 'CREDENTIALS',
      Heading: 'Credentials',
      delegate: 'Assume IAM Role on Delegate',
      manual: 'Enter AWS Access Keys manually',
      CREDENTIAL: 'Credentials',
      BACK: 'BACK',
      SAVE_CREDENTIALS_AND_CONTINUE: 'SAVE CREDENTIALS AND CONTINUE',
      delegateSelector: 'Delegate Selector',
      selectDelegate: 'Selact a delegate',
      addNewDelegate: 'Add a new Delegate to this Cluster',
      useExistingDelegateSelector: 'Use existing delegate selector',
      assumeSTSRole: 'Assume STS Role',
      roleARN: 'Role ARN',
      externalId: 'External Id (Optional)',
      accessKey: 'Access Key',
      secretKey: 'Secret Key',
      validation: {
        delegateSelector: 'Delegate Tag is required',
        secretKeyRef: 'Secret key is required',
        accessKey: 'Access key is required',
        crossAccountRoleArn: 'Role ARN is required.'
      }
    },
    THREE: {
      NAME: 'VERIFY CONNECTION'
    }
  }
}
