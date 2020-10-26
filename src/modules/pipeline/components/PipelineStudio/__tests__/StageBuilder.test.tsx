import React from 'react'
import { render, waitFor, getByText as getByTextBody, fireEvent } from '@testing-library/react'
import { prependAccountPath, TestWrapper } from 'modules/common/utils/testUtils'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import { defaultAppStoreValues } from 'modules/common/pages/ProjectsPage/__tests__/DefaultAppStoreData'
import CDPipelineStudio from 'modules/pipeline/pages/pipeline-studio/CDPipelineStudio'
import StageBuilder from '../StageBuilder/StageBuilder'
import { PipelineResponse } from './PipelineStudioMocks'
jest.mock('modules/common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

window.HTMLElement.prototype.scrollTo = jest.fn()

jest.mock('services/cd-ng', () => ({
  getPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve(PipelineResponse)),
  useGetConnector: jest.fn().mockImplementation(() => ({ loading: false, refetch: jest.fn(), data: undefined }))
}))

jest.mock('resize-observer-polyfill', () => {
  class ResizeObserver {
    static default = ResizeObserver
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    observe() {
      // do nothing
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    unobserve() {
      // do nothing
    }
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    disconnect() {
      // do nothing
    }
  }
  return ResizeObserver
})

describe('Stage Builder Test', () => {
  test('should test stage builder', async () => {
    const { container, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelineStudio.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'editPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineStudio>
          <StageBuilder />
        </CDPipelineStudio>
      </TestWrapper>
    )
    await waitFor(() => getByText('asd'))
    const createNewBtn = container.querySelector('.defaultCard.createNew')
    fireEvent.click(createNewBtn as HTMLElement)
    await waitFor(() => getByTextBody(document.body, 'Deploy'))
    const deployBtn = getByTextBody(document.body, 'Deploy')
    fireEvent.click(deployBtn)
    await waitFor(() => getByText('Untitled'))
    const newStage = getByText('Untitled')
    fireEvent.click(newStage)
    await waitFor(() => getByTextBody(document.body, 'About Your Stage'))
    const stageName = document.body.querySelector('[name="name"]')
    fireEvent.change(stageName!, { target: { value: 'New Stage' } })
    await waitFor(() => getByTextBody(document.body, 'New_Stage'))
    const setupStage = getByTextBody(document.body, 'Setup Stage')
    fireEvent.click(setupStage)
    await waitFor(() => getByTextBody(document.body, 'Propagate From:'))
    let next = getByText('Next')
    fireEvent.click(next)
    await waitFor(() => getByTextBody(document.body, 'Name your environment'))
    next = getByText('Next')
    fireEvent.click(next)
    await waitFor(() => expect(container.querySelector('.bp3-tab-panel [icon="plus"]')).toBeDefined())
  }, 20000)
})
