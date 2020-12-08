import React from 'react'
import { render, fireEvent, act, findByText } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'
import DeployStageSpecifications from '../DeployStageSpecifications'
describe('StepWidget tests', () => {
  test(`renders DeployStageSpecifications without crashing `, () => {
    const { container } = render(
      <TestWrapper>
        <DeployStageSpecifications />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test(`Updates DeployStageSpecifications form `, async () => {
    const { container } = render(
      <TestWrapper>
        <DeployStageSpecifications />
      </TestWrapper>
    )

    act(() => {
      const stageNameInput = container.querySelector('input[name="name"]')
      expect(stageNameInput).toBeDefined()
      fireEvent.change(stageNameInput!, { target: { value: 'Deploy' } })
      expect(container).toMatchSnapshot('Updated Form')
    })

    await act(async () => {
      const addVariableButton = await findByText(document.body, '+ Add Variable')
      expect(addVariableButton).toBeDefined()
      fireEvent.click(addVariableButton)
      const variableNameInput = document.querySelector('input[placeholder="Enter Variable name"]')
      expect(variableNameInput).toBeDefined()
      fireEvent.change(variableNameInput!, { target: { value: 'Variable' } })
      const submitdVariableButton = await findByText(document.body, 'Add')
      expect(submitdVariableButton).toBeDefined()
      expect(document.getElementsByClassName('bp3-portal')[0]).toMatchSnapshot('Add Variable Form')
    })
    const variableTitle = await findByText(container, 'Variable')
    expect(variableTitle).toBeDefined()
    expect(document.getElementsByClassName('bp3-portal')[0]).toMatchSnapshot('Variables List')
  })
})
