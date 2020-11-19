import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import ActivityChangesDrilldownView from '../ActivityChangesDrilldownView'
import DeploymentDrilldownViewHeader from '../../deployment-drilldown/DeploymentDrilldownViewHeader'
import VerificationInstancePostDeploymentView from '../../deployment-drilldown/VerificationInstancePostDeploymentView'

jest.mock('framework/exports', () => ({
  useRouteParams: () => ({
    params: { activityId: '112233' }
  })
}))

jest.mock('../../deployment-drilldown/DeploymentDrilldownViewHeader', () => {
  return jest.fn().mockImplementation(() => <div />)
})

jest.mock('../../deployment-drilldown/VerificationInstancePostDeploymentView', () => {
  return jest.fn().mockImplementation(props => {
    return (
      <div
        className="trigger-activity-set"
        onClick={() =>
          props?.onActivityLoaded({
            activityName: 'testName',
            environmentIdentifier: 'qa',
            serviceIdentifier: 'testService',
            endTime: 1605189961698,
            activityStartTime: 1605189960698
          })
        }
      />
    )
  })
})

describe('ActivityChangesDrilldownView', () => {
  test('activity is set and props are passed correctly', () => {
    const { container } = render(<ActivityChangesDrilldownView />)
    fireEvent.click(container.querySelector('.trigger-activity-set')!)
    const headersProps = (DeploymentDrilldownViewHeader as any).mock.calls[1][0]
    const viewProps = (VerificationInstancePostDeploymentView as any).mock.calls[1][0]

    expect(headersProps.deploymentTag).toEqual('testName')
    expect(headersProps.environments[0]).toEqual('qa')
    expect(headersProps.service).toEqual('testService')

    expect(viewProps.selectedActivityId).toEqual('112233')
    expect(viewProps.environmentIdentifier).toEqual('qa')
    expect(viewProps.activityStartTime).toEqual(1605189960698)
    expect(viewProps.durationMs).toEqual(1000)
  })
})
