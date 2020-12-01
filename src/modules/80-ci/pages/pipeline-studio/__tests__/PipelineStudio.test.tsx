import React from 'react'
import { render, getByText, waitFor, fireEvent } from '@testing-library/react'
import { findDialogContainer, TestWrapper } from '@common/utils/testUtils'
import { defaultAppStoreValues } from '@projects-orgs/pages/projects/__tests__/DefaultAppStoreData'
import { DefaultNewPipelineId } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import routes from '@common/RouteDefinitions'
import { accountPathProps, pipelinePathProps } from '@common/utils/routeUtils'

import CIPipelineStudio from '../CIPipelineStudio'
import { PipelineResponse } from './PipelineStudioMocks'

jest.mock('@common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  getPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve(PipelineResponse)),
  putPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' })),
  postPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' })),
  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve({ response: { data: { content: [] } } }))
}))

jest.mock('@pipeline/components/PipelineStudio/PipelineContext/PipelineContextUtils', () => ({
  getPipelinePromiseFactory: jest.fn().mockImplementation(() => () => Promise.resolve(PipelineResponse)),
  putPipelinePromiseFactory: jest.fn().mockImplementation(() => () => Promise.resolve({ status: 'SUCCESS' })),
  postPipelinePromiseFactory: jest.fn().mockImplementation(() => () => Promise.resolve({ status: 'SUCCESS' }))
}))

jest.mock('@pipeline/components/RunPipelineModal/RunPipelineForm', () => ({
  // eslint-disable-next-line react/display-name
  RunPipelineForm: ({ onClose }: { onClose: () => void }): JSX.Element => (
    <div>
      Run Pipeline Form <button onClick={onClose}>Close Pipeline Form</button>
    </div>
  )
}))

const TEST_PATH = routes.toCIPipelineStudio({ ...accountPathProps, ...pipelinePathProps })

describe('Test Pipeline Studio', () => {
  test('should render default pipeline studio', async () => {
    const { container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: DefaultNewPipelineId
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(document.body, 'Welcome to the Pipeline Studio'))
    expect(container).toMatchSnapshot()
  })
  test('should render edit pipeline studio', async () => {
    const { container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'editPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(container.querySelector('.pipelineNameContainer') as HTMLElement, 'test-p1'))
    expect(container).toMatchSnapshot()
  })
  test('should render edit pipeline studio, run pipeline line, save Pipeline and close studio', async () => {
    const { getByTitle, container } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'editPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(container.querySelector('.pipelineNameContainer') as HTMLElement, 'test-p1'))
    const runPipeline = getByTitle('Run Pipeline')
    fireEvent.click(runPipeline)
    await waitFor(() => getByText(document.body, 'Run Pipeline Form'))
    const dialog = findDialogContainer()
    expect(dialog).toBeDefined()
    const crossBtn = getByText(dialog as HTMLElement, 'Close Pipeline Form')
    fireEvent.click(crossBtn)
    const saveBtn = getByText(document.body, 'Save and Publish')
    fireEvent.click(saveBtn)
  })
  test('should render new pipeline studio, run pipeline line, save Pipeline and close studio', async () => {
    render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: DefaultNewPipelineId
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(document.body, 'Welcome to the Pipeline Studio'))
    const dialog = findDialogContainer()
    const input = dialog?.querySelector('[placeholder="Name"]') as HTMLElement
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(getByText(dialog as HTMLElement, 'Start'))
    const saveBtn = getByText(document.body, 'Save and Publish')
    fireEvent.click(saveBtn)
    expect(saveBtn).toBeDefined()
  })

  test('should render and test Trigger, Notifications, Templates and Variables Sections', async () => {
    const { container, getByTitle } = render(
      <TestWrapper
        path={TEST_PATH}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'editPipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CIPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(container.querySelector('.pipelineNameContainer') as HTMLElement, 'test-p1'))
    const notificationsBtn = getByText(container, 'Notifications')
    fireEvent.click(notificationsBtn)
    const varBtn = getByTitle('Input Variables')
    fireEvent.click(varBtn)
    expect(getByText(document.body, 'Pipeline Variables')).toBeDefined()
    fireEvent.click(document.querySelector('.bp3-overlay-backdrop')!)
    fireEvent.click(varBtn.parentElement?.previousSibling!)
    expect(getByText(document.body, 'Templates')).toBeDefined()
  })
})
