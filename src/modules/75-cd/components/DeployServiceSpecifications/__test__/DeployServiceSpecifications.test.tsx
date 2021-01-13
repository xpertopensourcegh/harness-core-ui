/* eslint-disable jest/no-disabled-tests */
import React from 'react'
import { render, findByText, fireEvent, waitFor, createEvent, act } from '@testing-library/react'

import {
  PipelineContextInterface,
  PipelineContext
} from '@pipeline/components/PipelineStudio/PipelineContext/PipelineContext'
import { TestWrapper } from '@common/utils/testUtils'

import overridePipelineContext from './overrideSetPipeline.json'
import DeployServiceSpecifications from '../DeployServiceSpecifications'
import connectorListJSON from './connectorList.json'
import mockListSecrets from './mockListSecret.json'
import services from './servicesMock.json'
const getOverrideContextValue = (): PipelineContextInterface => {
  return { ...overridePipelineContext, updatePipeline: jest.fn() } as any
}

jest.mock('services/cd-ng', () => ({
  getConnectorListPromise: () => Promise.resolve(connectorListJSON),

  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockListSecrets)),
  useGetServiceListForProject: jest
    .fn()
    .mockImplementation(() => ({ loading: false, data: services, refetch: jest.fn() })),
  usePostSecretTextV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePostSecretFileV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePutSecret: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePostSecret: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePutSecretTextV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePutSecretFileV2: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  usePutSecretViaYaml: jest.fn().mockImplementation(() => ({ mutate: jest.fn() })),
  useGetConnectorList: jest.fn(() => ({ data: null }))
}))

const eventData = { dataTransfer: { setData: jest.fn(), dropEffect: '', getData: () => '1' } }
describe('OverrideSet tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })

  test(`renders overrideSets without crashing`, async () => {
    const { container, getByTestId } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )
    const radioButtons = container.querySelectorAll('input[type="radio"]')
    fireEvent.click(radioButtons[0])

    const selectStageDropDown = document.body
      .querySelector(`[class*="bp3-input-action"]`)
      ?.querySelector('[data-icon="caret-down"]')
    fireEvent.click(selectStageDropDown as Element)
    await waitFor(() => document.body.querySelector('.bp3-menu'))
    const stage1Option = await findByText(document.body, 'Previous Stage st1 [st1]')
    fireEvent.click(stage1Option)

    //Enable use of OverrideSet
    const overrideSetCheckbox = container.querySelector('input[id=overrideSetCheckbox]')
    expect(overrideSetCheckbox).toBeDefined()
    fireEvent.click(overrideSetCheckbox as Element)

    //Add Predefined Set to list
    await waitFor(() => findByText(container, '+ Add Predefined Set'))
    let addOverrideSetButton = container.querySelector('button[class*="addOverrideSetButton"]')
    addOverrideSetButton = await waitFor(() => container.querySelector('button[class*="addOverrideSetButton"]'))
    expect(addOverrideSetButton).toBeDefined()
    fireEvent.click(addOverrideSetButton as HTMLElement)
    await waitFor(() => container.querySelector('input[name="selectedOverrideSets[0]"]'))
    const overrideSetSelectInput = container
      .querySelector('input[name="selectedOverrideSets[0]"]')
      ?.parentNode?.querySelector('[data-icon="caret-down"]')
    fireEvent.click(overrideSetSelectInput as Element)
    await waitFor(() => document.body.querySelector('.bp3-menu'))
    const set1Option = await findByText(document.body, 'Set1')
    fireEvent.click(set1Option as Element)
    const primaryArtifactFromPrevStage = await waitFor(() => findByText(container, 'Primary Artifact'))
    expect(primaryArtifactFromPrevStage).toBeDefined()

    //Remove Predefined Set from list
    const removeOverrideSetButton = document.getElementById('removeOverrideSet')
    expect(removeOverrideSetButton).toBeDefined()
    fireEvent.click(removeOverrideSetButton as Element)
    const manifestsTab = await findByText(container, 'Manifests')
    fireEvent.click(manifestsTab)
    const addManifestButton = await findByText(container, '+ Add Manifest')
    expect(addManifestButton).toBeDefined()
    await waitFor(() => findByText(container, '+ Add Predefined Set'))
    let addManifestOverrideSetButton = container.querySelector('button[class*="addOverrideSetButton"]')
    addManifestOverrideSetButton = await waitFor(() => container.querySelector('button[class*="addOverrideSetButton"]'))
    expect(addManifestOverrideSetButton).toBeDefined()
    fireEvent.click(addManifestOverrideSetButton as HTMLElement)
    await waitFor(() => container.querySelector('input[name="selectedOverrideSets[0]"]'))
    const manifestOverrideSetSelectInput = container
      .querySelector('input[name="selectedOverrideSets[0]"]')
      ?.parentNode?.querySelector('[data-icon="caret-down"]')
    fireEvent.click(manifestOverrideSetSelectInput as Element)
    await waitFor(() => document.body.querySelector('.bp3-menu'))
    const manifestSetOption = await findByText(document.body, 'manor')
    fireEvent.click(manifestSetOption as Element)
    const primaryManifestFromPrevStage = await waitFor(() => findByText(container, 'man1'))
    expect(primaryManifestFromPrevStage).toBeDefined()

    //Add 2nd set
    await waitFor(() => findByText(container, '+ Add Predefined Set'))
    let addManifestOverrideSetButton2 = container.querySelector('button[class*="addOverrideSetButton"]')
    addManifestOverrideSetButton2 = await waitFor(() =>
      container.querySelector('button[class*="addOverrideSetButton"]')
    )
    expect(addManifestOverrideSetButton2).toBeDefined()
    fireEvent.click(addManifestOverrideSetButton2 as HTMLElement)
    await waitFor(() => container.querySelector('input[name="selectedOverrideSets[1]"]'))
    const manifestOverrideSetSelectInput2 = container
      .querySelector('input[name="selectedOverrideSets[1]"]')
      ?.parentNode?.querySelector('[data-icon="caret-down"]')
    fireEvent.click(manifestOverrideSetSelectInput2 as Element)
    await waitFor(() => document.body.querySelector('.bp3-menu'))
    const manifestSetOption2 = await findByText(document.body, 'manor1')
    fireEvent.click(manifestSetOption2 as Element)
    const primaryManifestFromPrevStage2 = await waitFor(() => findByText(container, 'man2'))
    expect(primaryManifestFromPrevStage2).toBeDefined()

    //drag drop manifests
    const container1 = getByTestId('manor')
    const container2 = getByTestId('manor1')

    act(() => {
      const dragStartEvent = Object.assign(createEvent.dragStart(container1), eventData)

      fireEvent(container1, dragStartEvent)

      fireEvent.dragEnd(container)

      fireEvent.dragLeave(container1)

      const dropEffectEvent = Object.assign(createEvent.dragOver(container1), eventData)
      fireEvent(container2, dropEffectEvent)

      const dropEvent = Object.assign(createEvent.drop(container1), eventData)
      fireEvent(container2, dropEvent)
    })
  })

  test(`toggles overrideSets selection without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )
    const overrideSetCheckbox = container.querySelector('input[id=overrideSetCheckbox]')
    expect(overrideSetCheckbox).toBeDefined()
    fireEvent.click(overrideSetCheckbox as Element)
    let addOverrideSetButton = container.querySelector('button[class*="addOverrideSetButton"]')
    expect(addOverrideSetButton).toBeNull()
    fireEvent.click(overrideSetCheckbox as Element)
    addOverrideSetButton = await waitFor(() => container.querySelector('button[class*="addOverrideSetButton"]'))
    expect(addOverrideSetButton).toBeDefined()
  })

  test(`create variable without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )

    const variablesTab = await waitFor(() => findByText(container, 'Variables'))
    expect(variablesTab).toBeDefined()
    fireEvent.click(variablesTab)
    const addVariableButton = await findByText(container, 'Add Variable')
    fireEvent.click(addVariableButton)
    let variableInput = document.body.querySelector('input[placeholder="Variable Name"]')
    fireEvent.change(variableInput as Element, { target: { value: 'var1' } })
    let saveButton = await findByText(document.body.querySelector('.bp3-dialog-footer') as HTMLElement, 'Save')
    fireEvent.click(saveButton)
    const var1 = await waitFor(() => findByText(container, 'var1'))
    expect(var1).toBeDefined()
    const varInput = var1?.parentElement?.children[2]?.querySelector('input')
    fireEvent.change(varInput as Element, { target: { value: 'varval' } })

    //create scret type variable
    fireEvent.click(addVariableButton)
    variableInput = document.body.querySelector('input[placeholder="Variable Name"]')
    fireEvent.change(variableInput as Element, { target: { value: 'var2' } })
    const selectStageDropDown = document.body
      .querySelector(`input[value="String"]`)
      ?.parentNode?.querySelector('[data-icon="caret-down"]')
    await act(async () => {
      fireEvent.click(selectStageDropDown as Element)
    })
    await waitFor(() => document.body.querySelector('.bp3-menu'))
    const secretOption = await findByText(document.body, 'Secret')
    fireEvent.click(secretOption as Element)
    saveButton = await findByText(document.body.querySelector('.bp3-dialog-footer') as HTMLElement, 'Save')
    fireEvent.click(saveButton)
    const var2 = await waitFor(() => findByText(container, 'var2'))
    const secretListButton = var2.parentElement?.querySelector('[stroke="#1C1C28"]')
    fireEvent.click(secretListButton as Element)
    const projectbutton = await waitFor(() => findByText(document.body, 'Project'))
    expect(projectbutton).toBeDefined()
    fireEvent.click(projectbutton)
    const selectedSecret = await findByText(document.body, 'New Secret')
    fireEvent.click(selectedSecret)
  })
  test(`change mode `, () => {
    const { container } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )
    const propagatebutton = document.getElementById('mode_propagate')
    expect(propagatebutton).toBeDefined()
    fireEvent.click(propagatebutton as HTMLElement)
    expect(container).toMatchSnapshot('change mode')
  })
})
