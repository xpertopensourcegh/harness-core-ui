import React from 'react'
import { queryByAttribute, act, fireEvent, findByText, render } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { SecretDTOV2 } from 'services/cd-ng'
import BuildStageSpecifications, { getSecretKey } from '../BuildStageSpecifications'
import mockData from './mockData.json'

jest.mock('services/cd-ng', () => ({
  listSecretsV2Promise: jest.fn().mockImplementation(() => Promise.resolve(mockData))
}))

const mockSecretDataBase: SecretDTOV2 = {
  type: 'SecretFile',
  name: 'testName',
  spec: {
    errorMessageForInvalidYaml: 'error'
  },
  identifier: 'testId'
}
const mockSecretDataNoOrg = { ...mockSecretDataBase, projectIdentifier: 'testProject' }
const mockSecretDataNoProject = { ...mockSecretDataBase, orgIdentifier: 'testOrg' }

describe('BuildStageSpecifications tests', () => {
  test('renders correctly', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
        <BuildStageSpecifications />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('clicking on description and tags shows corresponding inputs', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
        <BuildStageSpecifications />
      </TestWrapper>
    )
    const addDescriptionBtn = await findByText(container, 'description')
    expect(addDescriptionBtn).toBeDefined()
    const addTagsBtn = await findByText(container, 'tags')
    expect(addTagsBtn).toBeDefined()
    await act(async () => {
      fireEvent.click(addDescriptionBtn)
      fireEvent.click(addTagsBtn)
    })
    expect(queryByAttribute('name', container, 'description')).toBeDefined()
    expect(queryByAttribute('name', container, 'tags')).toBeDefined()
    expect(container).toMatchSnapshot()
  })
  test('able to add a variable', async () => {
    const { container } = render(
      <TestWrapper pathParams={{ accountIdentifier: 'dummy' }}>
        <BuildStageSpecifications />
      </TestWrapper>
    )

    await act(async () => {
      const addVariableBtn = await findByText(container, '+ Add Variable')
      expect(addVariableBtn).toBeDefined()
      fireEvent.click(addVariableBtn)
      const portal = document.getElementsByClassName('bp3-dialog')[0]
      // enter variable name and save
      const variableNameInput = portal.querySelector("input[name='name']")
      expect(variableNameInput).toBeDefined()
      fireEvent.change(variableNameInput!, { target: { value: 'dummy-var' } })
      expect(variableNameInput).toHaveProperty('value', 'dummy-var')
      const saveAndContinueButton = await findByText(portal as HTMLElement, 'Add')
      fireEvent.click(saveAndContinueButton as Element)
    })

    const variableName = await findByText(container, 'dummy-var')
    expect(variableName).toBeDefined()
  })
  test('getSecretKey works correctly', async () => {
    expect(getSecretKey(mockSecretDataBase)).toEqual('account.testId')
    expect(getSecretKey(mockSecretDataNoOrg)).toEqual('project.testId')
    expect(getSecretKey(mockSecretDataNoProject)).toEqual('org.testId')
  })
})
