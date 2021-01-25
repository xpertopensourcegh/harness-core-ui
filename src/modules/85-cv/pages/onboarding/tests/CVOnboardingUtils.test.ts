import * as CVOnboardingUtils from '../CVOnBoardingUtils'

describe('Unit tests for CVOnboardingUtils', () => {
  test('Ensure correct object is returned for buildConnectorRef', async () => {
    expect(
      CVOnboardingUtils.buildConnectorRef({
        connector: {
          name: 'solo-dolo',
          projectIdentifier: '1234_projctIdent',
          identifier: 'solo-dolo',
          type: 'AppDynamics',
          spec: {}
        }
      })
    ).toEqual({
      label: 'solo-dolo',
      scope: 'project',
      value: 'solo-dolo'
    })
  })
})
