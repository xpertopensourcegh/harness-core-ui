export default {
  NAME: 'VERIFY CONNECTION',
  HEADING: 'Verify Connection to ',
  STEPS: {
    ONE: 'Checking for delegates ',
    TWO: {
      FAILED: 'Delegate Connection Failed',
      SUCCESS: (connector: string) => `Establishing Connection between Delegate and ${connector || 'Connector'}`
    },
    THREE: 'Verifying Connection'
  },
  FINISH: 'FINISH',
  EDIT_CREDS: 'Edit Credentials',
  RETEST: 'RETEST CONNECTION',
  LAST_CONNECTED: 'Last connected successfully',
  delegateFound: (count: number | undefined) =>
    `${count ? count : 'No'} delegate${count && count > 1 ? 's' : ''} found`,
  STEP_TWO_POPOVER: 'Establishing connection',
  CONTINUE: 'CONTINUE',
  CLOSE: 'CLOSE',
  VERIFICATION_TIME_TEXT:
    'This process may take a while. You may close your window or wait until verification is completed.'
}
