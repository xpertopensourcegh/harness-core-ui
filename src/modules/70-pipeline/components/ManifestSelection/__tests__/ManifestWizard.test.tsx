import React from 'react'
import { render, findByText, fireEvent, waitFor, act } from '@testing-library/react'
// import { act } from 'react-dom/test-utils'
import { TestWrapper } from '@common/utils/testUtils'
import { ManifestWizard } from '../ManifestWizardSteps/ManifestWizard'
import pipelineMock from './pipeline_mock.json'
import stageMock from './stage_mock.json'
describe('ManifestSelection tests', () => {
  test(`renders without crashing`, () => {
    const { container } = render(
      <TestWrapper>
        <ManifestWizard
          isForOverrideSets={false}
          isForPredefinedSets={false}
          identifier="Deploy_Service"
          pipeline={pipelineMock as any}
          stage={stageMock as any}
          view={2}
          updatePipeline={jest.fn()}
          closeModal={jest.fn()}
          handleViewChange={jest.fn()}
        />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test(`can change artifact input type  without crashing`, async () => {
    const { container } = render(
      <TestWrapper>
        <ManifestWizard
          isForOverrideSets={false}
          isForPredefinedSets={false}
          identifier="Deploy_Service"
          pipeline={pipelineMock as any}
          stage={stageMock as any}
          view={2}
          updatePipeline={jest.fn()}
          closeModal={jest.fn()}
          handleViewChange={jest.fn()}
        />
      </TestWrapper>
    )
    const multiTypeButton = container
      .querySelector('.bp3-popover-wrapper')
      ?.parentNode?.querySelector('button[class*="MultiTypeInput"]')

    expect(multiTypeButton).toBeDefined()
    fireEvent.click(multiTypeButton as HTMLElement)
    const runtimeInputButton = await findByText(document.body, 'Runtime input')
    expect(runtimeInputButton).toBeDefined()
    fireEvent.click(runtimeInputButton as HTMLElement)
    const inputName = container.querySelector('input[value="<+input>"]')
    expect(inputName).toBeDefined()
    const saveButton = container.querySelector('button[type="submit"]')
    expect(saveButton).toBeDefined()
    fireEvent.click(saveButton as HTMLElement)
    await waitFor(() => findByText(container, 'Manifest Identifier'))
    expect(container).toMatchSnapshot('Second Step')

    await act(async () => {
      const identifierInput = container.querySelector('input[name="identifier"]') as HTMLElement
      expect(identifierInput).toBeDefined()
      fireEvent.change(identifierInput, { target: { value: 'identifier' } })
    })
    await act(async () => {
      const branchNameInput = container.querySelector('input[placeholder="Enter branch name here"]') as HTMLElement
      expect(branchNameInput).toBeDefined()
      fireEvent.change(branchNameInput, { target: { value: 'branch' } })
    })
    expect(container).toMatchSnapshot()
  })
})
