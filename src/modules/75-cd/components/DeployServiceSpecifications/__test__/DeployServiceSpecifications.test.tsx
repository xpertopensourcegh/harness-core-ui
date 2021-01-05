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
const getOverrideContextValue = (): PipelineContextInterface => {
  return { ...overridePipelineContext, updatePipeline: jest.fn() } as any
}

jest.mock('services/cd-ng', () => ({
  getConnectorListPromise: () => Promise.resolve(connectorListJSON)
}))

const eventData = { dataTransfer: { setData: jest.fn(), dropEffect: '', getData: () => '1' } }
describe('OverrideSet tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <DeployServiceSpecifications />
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
    expect(primaryArtifactFromPrevStage).toMatchSnapshot('Selected Set1')
    expect(primaryArtifactFromPrevStage).toBeDefined()
    expect(container).toMatchSnapshot('Selected OverrideSet Set1')
    //Remove Predefined Set from list
    const removeOverrideSetButton = document.getElementById('removeOverrideSet')
    expect(removeOverrideSetButton).toBeDefined()
    fireEvent.click(removeOverrideSetButton as Element)
    expect(container).toMatchSnapshot('Removed OverrideSet Set1')
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
    expect(manifestSetOption).toMatchSnapshot('Manifest Snapshot')
    const primaryManifestFromPrevStage = await waitFor(() => findByText(container, 'man1'))
    expect(primaryManifestFromPrevStage).toBeDefined()
    expect(container).toMatchSnapshot('Selected Manifest OverrideSet Set1')

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
    expect(manifestSetOption).toMatchSnapshot('Manifest2 Snapshot')
    const primaryManifestFromPrevStage2 = await waitFor(() => findByText(container, 'man2'))
    expect(primaryManifestFromPrevStage2).toBeDefined()
    expect(container).toMatchSnapshot('Selected Manifest OverrideSet Set2')

    //drag drop manifests
    const container1 = getByTestId('manor')
    const container2 = getByTestId('manor1')

    act(() => {
      const dragStartEvent = Object.assign(createEvent.dragStart(container1), eventData)

      fireEvent(container1, dragStartEvent)
      expect(container1).toMatchSnapshot()

      fireEvent.dragEnd(container)
      expect(container1).toMatchSnapshot()

      fireEvent.dragLeave(container1)
      expect(container1).toMatchSnapshot()

      const dropEffectEvent = Object.assign(createEvent.dragOver(container1), eventData)
      fireEvent(container2, dropEffectEvent)
      expect(container2).toMatchSnapshot()

      const dropEvent = Object.assign(createEvent.drop(container1), eventData)
      fireEvent(container2, dropEvent)
      expect(container2).toMatchSnapshot()
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

  test(`create manifest value type without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <PipelineContext.Provider value={getOverrideContextValue()}>
          <DeployServiceSpecifications />
        </PipelineContext.Provider>
      </TestWrapper>
    )

    const manifestTab = await waitFor(() => findByText(container, 'Manifests'))
    expect(manifestTab).toBeDefined()
    fireEvent.click(manifestTab)
    const addManifestButton = await findByText(container, '+ Add Manifest')
    fireEvent.click(addManifestButton)
    const valuesOverride = await waitFor(() => findByText(document.body, 'Values Override'))
    fireEvent.click(valuesOverride)
    await act(async () => {
      const gitServerInput = await waitFor(() => findByText(document.body, 'Select GIT Server'))
      fireEvent.click(gitServerInput)
    })
    const projectsButton = document.body.querySelector('[icon="cube"]')
    fireEvent.click(projectsButton as Element)
    const k8connector = await waitFor(() => document.body.querySelector('[icon="full-circle"]'))
    expect(k8connector).toBeDefined()
    fireEvent.click(k8connector as Element)
    const continueButton = await findByText(document.body, 'Save and Continue')
    fireEvent.click(continueButton)
    await waitFor(() => findByText(document.body, 'Configure Manifest Source'))
    const nameInput = document.body.querySelector('input[name="identifier"]')
    fireEvent.change(nameInput as Element, { target: { value: 'manifest1' } })
    const branchInput = document.body.querySelector('input[name="branch"]')
    fireEvent.change(branchInput as Element, { target: { value: 'manifest1branch' } })
    const pathInput = document.body.querySelector('input[name="filePath[0].path"]')
    fireEvent.change(pathInput as Element, { target: { value: 'path' } })
    const submitButton = await findByText(document.body, 'Submit')
    fireEvent.click(submitButton)
    const manifestCreated = await findByText(container, 'manifest1branch')
    expect(manifestCreated).toBeDefined()
    expect(container).toMatchSnapshot('create manifest value type without crashing')
  })
})
