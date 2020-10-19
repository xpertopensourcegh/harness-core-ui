import React from 'react'
import { render, waitFor, fireEvent, createEvent, act } from '@testing-library/react'
import { findDialogContainer, prependAccountPath, TestWrapper } from 'modules/common/utils/testUtils'
import { defaultAppStoreValues } from 'modules/common/pages/ProjectsPage/__tests__/DefaultAppStoreData'
import { routeInputSetList } from 'modules/cd/routes'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import { InputFormType, InputSetForm } from '../InputSetForm'
import {
  TemplateResponse,
  PipelineResponse,
  ConnectorResponse,
  GetInputSetsResponse,
  GetInputSetEdit,
  MergeInputSetResponse,
  GetOverlayInputSetEdit
} from './InputSetMocks'

const eventData = { dataTransfer: { setData: jest.fn(), dropEffect: '', getData: () => '1' } }

const successResponse = (): Promise<{ status: string }> => Promise.resolve({ status: 'SUCCESS' })

jest.mock(
  'modules/common/components/YAMLBuilder/YamlBuilder',
  () => ({ children, bind }: { children: JSX.Element; bind: YamlBuilderProps['bind'] }) => {
    const handler = React.useMemo(
      () =>
        ({
          getLatestYaml: () => GetInputSetEdit.data?.data?.inputSetYaml || '',
          getYAMLValidationErrorMap: () => new Map()
        } as YamlBuilderHandlerBinding),
      []
    )

    React.useEffect(() => {
      bind?.(handler)
    }, [bind, handler])
    return (
      <div>
        <span>Yaml View</span>
        {children}
      </div>
    )
  }
)

jest.mock('services/cd-ng', () => ({
  useGetPipeline: jest.fn(() => PipelineResponse),
  useGetTemplateFromPipeline: jest.fn(() => TemplateResponse),
  useGetInputSetForPipeline: jest.fn(() => GetInputSetEdit),
  useGetMergeInputSetFromPipelineTemplateWithListInput: jest.fn(() => MergeInputSetResponse),
  useGetOverlayInputSetForPipeline: jest.fn(() => GetOverlayInputSetEdit),
  useCreateInputSetForPipeline: jest.fn(() => ({})),
  useUpdateInputSetForPipeline: jest.fn().mockImplementation(() => ({ mutate: successResponse })),
  useUpdateOverlayInputSetForPipeline: jest.fn().mockImplementation(() => ({ mutate: successResponse })),
  useCreateOverlayInputSetForPipeline: jest.fn(() => ({})),
  useGetInputSetsListForPipeline: jest.fn(() => GetInputSetsResponse),
  useGetConnector: jest.fn(() => ConnectorResponse)
}))

describe('Render Forms - Snapshot Testing', () => {
  test('render Input Set Form view', async () => {
    const { getAllByText, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routeInputSetList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <InputSetForm hideForm={jest.fn()} formType={InputFormType.InputForm} />
      </TestWrapper>
    )
    const container = findDialogContainer()
    await waitFor(() => getAllByText('Release name'))
    expect(container).toMatchSnapshot()
    // Switch Mode
    fireEvent.click(getByText('YAML'))
    await waitFor(() => getAllByText('Yaml View'))
    expect(container).toMatchSnapshot()
    // Switch Mode
    fireEvent.click(getByText('VISUAL'))
    await waitFor(() => getAllByText('Release name'))
    // Close Form
    fireEvent.click(container?.querySelector('[icon="small-cross"]')!)
  })

  test('render Overlay Input Set Form view', async () => {
    const { getAllByText } = render(
      <TestWrapper
        path={prependAccountPath(routeInputSetList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <InputSetForm hideForm={jest.fn()} formType={InputFormType.OverlayInputForm} />
      </TestWrapper>
    )
    const container = findDialogContainer()
    await waitFor(() => getAllByText('+ Add Input Set'))
    const addNew = getAllByText('+ Add Input Set')[0]
    // Add two
    fireEvent.click(addNew)
    fireEvent.click(addNew)
    // Remove the last
    const remove = container?.querySelectorAll('[icon="delete"]')[1]
    fireEvent.click(remove!)
    expect(container).toMatchSnapshot()
  })

  test('render Edit Input Set Form view', async () => {
    const { getAllByText, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routeInputSetList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <InputSetForm hideForm={jest.fn()} formType={InputFormType.InputForm} identifier="asd" />
      </TestWrapper>
    )
    const container = findDialogContainer()
    await waitFor(() => getAllByText('tesa1'))
    expect(container).toMatchSnapshot()
    fireEvent.click(getByText('Save'))
    // Switch Mode
    fireEvent.click(getByText('YAML'))
    await waitFor(() => getAllByText('Yaml View'))
    fireEvent.click(getByText('Save'))
  })

  test('render Edit Overlay Input Set Form view', async () => {
    const { getAllByText, getByText } = render(
      <TestWrapper
        path={prependAccountPath(routeInputSetList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <InputSetForm hideForm={jest.fn()} formType={InputFormType.OverlayInputForm} identifier="OverLayInput" />
      </TestWrapper>
    )
    const container = findDialogContainer()
    await waitFor(() => getAllByText('2.'))
    expect(container).toMatchSnapshot()
    fireEvent.click(getByText('Save'))
    // Switch Mode
    fireEvent.click(getByText('YAML'))
    await waitFor(() => getAllByText('Yaml View'))
    fireEvent.click(getByText('Save'))
  })

  test('render Edit Overlay Input Set Form and test drag drop', async () => {
    const { getByTestId } = render(
      <TestWrapper
        path={prependAccountPath(routeInputSetList.path)}
        pathParams={{
          accountId: 'testAcc',
          orgIdentifier: 'testOrg',
          projectIdentifier: 'test',
          pipelineIdentifier: 'pipeline'
        }}
        defaultAppStoreValues={defaultAppStoreValues}
      >
        <InputSetForm hideForm={jest.fn()} formType={InputFormType.OverlayInputForm} identifier="OverLayInput" />
      </TestWrapper>
    )
    await waitFor(() => getByTestId('asd'))

    const container = getByTestId('asd')
    const container2 = getByTestId('test')

    act(() => {
      const dragStartEvent = Object.assign(createEvent.dragStart(container), eventData)

      fireEvent(container, dragStartEvent)
      expect(container).toMatchSnapshot()

      fireEvent.dragEnd(container)
      expect(container).toMatchSnapshot()

      fireEvent.dragLeave(container)
      expect(container).toMatchSnapshot()

      const dropEffectEvent = Object.assign(createEvent.dragOver(container), eventData)
      fireEvent(container2, dropEffectEvent)
      expect(container2).toMatchSnapshot()

      const dropEvent = Object.assign(createEvent.drop(container), eventData)
      fireEvent(container2, dropEvent)
      expect(container2).toMatchSnapshot()
    })
  })
})
