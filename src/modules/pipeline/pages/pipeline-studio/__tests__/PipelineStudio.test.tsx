import React from 'react'
import { render, getByText, waitFor, fireEvent } from '@testing-library/react'
import { findDialogContainer, prependAccountPath, TestWrapper } from 'modules/common/utils/testUtils'
import { defaultAppStoreValues } from 'modules/common/pages/ProjectsPage/__tests__/DefaultAppStoreData'
import { routeCDPipelineStudio } from 'navigation/cd/routes'
import { DefaultNewPipelineId } from '../../../components/PipelineStudio/PipelineContext/PipelineActions'
import CDPipelineStudio from '../CDPipelineStudio'
import { PipelineResponse } from './PipelineStudioMocks'

jest.mock('modules/common/components/YAMLBuilder/YamlBuilder', () => ({ children }: { children: JSX.Element }) => (
  <div>{children}</div>
))

jest.mock('services/cd-ng', () => ({
  getPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve(PipelineResponse)),
  putPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' })),
  postPipelinePromise: jest.fn().mockImplementation(() => Promise.resolve({ status: 'SUCCESS' })),
  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve({ response: { data: { content: [] } } }))
}))

jest.mock('modules/cd/components/RunPipelineModal/RunPipelineForm', () => ({
  // eslint-disable-next-line react/display-name
  RunPipelineForm: ({ onClose }: { onClose: () => void }): JSX.Element => (
    <div>
      Run Pipeline Form <button onClick={onClose}>Close Pipeline Form</button>
    </div>
  )
}))

describe('Test Pipeline Studio', () => {
  test('should render default pipeline studio', async () => {
    const { container } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelineStudio.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: DefaultNewPipelineId
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(document.body, 'Welcome to the Pipeline Studio'))
    expect(container).toMatchSnapshot()
  })
  test('should render edit pipeline studio', async () => {
    const { container } = render(
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
        <CDPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(document.body, 'test-p1'))
    expect(container).toMatchSnapshot()
  })
  test('should render edit pipeline studio, run pipeline line, save Pipeline and close studio', async () => {
    const { getByTitle, container, getByTestId } = render(
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
        <CDPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(document.body, 'test-p1'))
    const runPipeline = getByTitle('Run Pipeline')
    fireEvent.click(runPipeline)
    await waitFor(() => getByText(document.body, 'Run Pipeline Form'))
    const dialog = findDialogContainer()
    expect(dialog).toBeDefined()
    const crossBtn = getByText(dialog as HTMLElement, 'Close Pipeline Form')
    fireEvent.click(crossBtn)
    const saveBtn = getByText(document.body, 'Save and Publish')
    fireEvent.click(saveBtn)
    const closeStudio = container.querySelector('[icon="cross"]')
    fireEvent.click(closeStudio!)
    expect(getByTestId('location').innerHTML).toBe(
      '/account/null/cd/pipelines/orgs/testOrg/projects/test/pipelines/editPipeline/executions'
    )
  })
  test('should render new pipeline studio, run pipeline line, save Pipeline and close studio', async () => {
    const { container } = render(
      <TestWrapper
        path={prependAccountPath(routeCDPipelineStudio.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: DefaultNewPipelineId
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <CDPipelineStudio />
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
    const closeStudio = container.querySelector('[icon="cross"]')
    fireEvent.click(closeStudio!)
    expect(closeStudio).toBeDefined()
  })

  test('should render and test Trigger, Notifications, Templates and Variables Sections', async () => {
    const { container, getByTitle } = render(
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
        <CDPipelineStudio />
      </TestWrapper>
    )
    await waitFor(() => getByText(container, 'test-p1'))
    const triggersBtn = getByText(container, 'Triggers')
    fireEvent.click(triggersBtn)
    let isPrimary = triggersBtn.parentElement?.getAttribute('class')?.indexOf('primary')
    expect(isPrimary && isPrimary > -1).toBeTruthy()
    const notificationsBtn = getByText(container, 'Notifications')
    fireEvent.click(notificationsBtn)
    isPrimary = notificationsBtn.parentElement?.getAttribute('class')?.indexOf('primary')
    expect(isPrimary && isPrimary > -1).toBeTruthy()
    const varBtn = getByTitle('Input Variables')
    fireEvent.click(varBtn)
    expect(getByText(document.body, 'Pipeline Variables')).toBeDefined()
    fireEvent.click(document.querySelector('.bp3-overlay-backdrop')!)
    fireEvent.click(varBtn.parentElement?.previousSibling!)
    expect(getByText(document.body, 'Templates')).toBeDefined()
  })
})
