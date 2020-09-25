export default {
  STEPS: {
    ONE: {
      PROGRESS: 'Checking Delegate',
      FAILED: 'Delegate not found',
      SUCCESS: 'Delegate found'
    },
    TWO: {
      PROGRESS: (connector: string) => `Establishing Connection between Delegate and ${connector || 'Connector'}`
    },
    THREE: {
      PROGRESS: 'Verifying connection'
    }
  },
  verifyConnectionText: 'Verify Connection to',
  VERIFICATION_TIME_TEXT:
    'This process may take a while. You may close your window or wait until verification is completed.',
  DELEGATE_FOUND: 'Delegate found',
  FINISH: 'FINISH',
  ACTIVE: 'Active',
  NOT_ACTIVE: 'NOT_ACTIVE',
  RETEST: 'RETEST CONNECTION',
  Status: 'Status',
  LAST_CONNECTED: 'Last connected successfully',
  CLOSE: 'CLOSE'
}
