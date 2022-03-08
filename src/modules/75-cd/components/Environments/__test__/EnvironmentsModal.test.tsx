/*
 * Copyright 2021 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React from 'react'
import { render, fireEvent, waitFor, act } from '@testing-library/react'
import { fillAtForm, InputTypes } from '@common/utils/JestFormHelper'
import { TestWrapper } from '@common/utils/testUtils'
import { environmentModal } from '@cd/mock'
import { NewEditEnvironmentModalYaml } from '../EnvironmentList/EnvironmentsModal'

jest.mock('services/pipeline-ng', () => {
  return {
    useGetSchemaYaml: jest.fn(() => ({ data: null }))
  }
})
const onSave = jest.fn()
const onClose = jest.fn()
const props = {
  isEdit: false,
  data: { name: '', identifier: '', description: '', tags: {} },
  onCreateOrUpdate: onSave,
  closeModal: onClose
}
describe('Environments', () => {
  test('should render Environments', () => {
    const { container, getByText } = render(
      <TestWrapper
        path="account/:accountId/cd/orgs/:orgIdentifier/projects/:projectIdentifier/environment"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <NewEditEnvironmentModalYaml {...environmentModal} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
    fireEvent.click(getByText('save'))
    fireEvent.click(getByText('YAML'))
    fireEvent.click(getByText('save'))
    expect(container).toMatchSnapshot()
  })

  test('should validate edit mode snapshot', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <NewEditEnvironmentModalYaml
          {...props}
          isEdit={true}
          data={{
            name: 'Environment 101',
            identifier: 'Environment_101',
            description: '',
            tags: { tag1: '', tag2: '' },
            type: 'Production'
          }}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('input[value="Environment 101"]')).toBeTruthy())

    fillAtForm([
      {
        container,
        fieldId: 'name',
        type: InputTypes.TEXTFIELD,
        value: 'Environment 102'
      }
    ])

    await act(async () => {
      fireEvent.click(getByText('save'))
    })

    expect(container).toMatchSnapshot()
  })
})
