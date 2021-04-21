import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { defaultAppStoreValues } from '@common/utils/DefaultAppStoreData'
import { accountPathProps, pipelineModuleParams, pipelinePathProps } from '@common/utils/routeUtils'
import { CurrentLocation, TestWrapper } from '@common/utils/testUtils'
import routes from '@common/RouteDefinitions'
import CIPipelineDeploymentList from '../CIPipelineDeploymentList'

jest.mock('@pipeline/pages/pipeline-deployment-list/PipelineDeploymentList', () => {
  return function CIPipelineDeploymentListComp(props: any) {
    return <button onClick={() => props.onRunPipeline()} id="runPipelineId"></button>
  }
})

function ComponentWrapper(): React.ReactElement {
  return (
    <React.Fragment>
      <CIPipelineDeploymentList />
      <CurrentLocation />
    </React.Fragment>
  )
}

const TEST_PATH = routes.toPipelineStudio({ ...accountPathProps, ...pipelinePathProps, ...pipelineModuleParams })

describe('<CIPipelineDeploymentList /> tests', () => {
  test('call run pipeline', async () => {
    const { container, getByTestId } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'testPip',
          module: 'ci'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <ComponentWrapper />
      </TestWrapper>
    )

    const projectButtonSel = '#runPipelineId'
    const projectButton = await waitFor(() => container.querySelector(projectButtonSel))
    fireEvent.click(projectButton!)

    expect(getByTestId('location')).toMatchInlineSnapshot(`
      <div
        data-testid="location"
      >
        /account/testAcc/ci/orgs/testOrg/projects/test/pipelines/testPip/runpipeline
      </div>
    `)
  })
})
