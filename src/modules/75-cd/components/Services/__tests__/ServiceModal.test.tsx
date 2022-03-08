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
import { serviceModal } from '@cd/mock'
import { NewEditServiceModalYaml } from '../ServicesListPage/ServiceModal'

jest.mock('services/pipeline-ng', () => {
  return {
    useGetSchemaYaml: jest.fn(() => ({ data: null }))
  }
})
const onSave = jest.fn()
const onClose = jest.fn()

const props = {
  isEdit: false,
  data: { name: '', identifier: '', orgIdentifier: 'orgIdentifier', projectIdentifier: 'projectIdentifier' },
  isService: true,
  onCreateOrUpdate: onSave,
  closeModal: onClose
}
describe('ServiceModal', () => {
  test('should render Services modal', () => {
    const { container, getByText } = render(
      <TestWrapper
        path="account/:accountId/cd/orgs/:orgIdentifier/projects/:projectIdentifier/services"
        pathParams={{ accountId: 'dummy', orgIdentifier: 'dummy', projectIdentifier: 'dummy' }}
      >
        <NewEditServiceModalYaml {...serviceModal} />
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
        <NewEditServiceModalYaml
          {...props}
          isEdit={true}
          isService={false}
          data={{
            name: 'Service 101',
            identifier: 'Service_101',
            orgIdentifier: 'orgIdentifier',
            projectIdentifier: 'projectIdentifier'
          }}
        />
      </TestWrapper>
    )

    await waitFor(() => expect(container.querySelector('input[value="Service 101"]')).toBeTruthy())

    fillAtForm([
      {
        container,
        fieldId: 'name',
        type: InputTypes.TEXTFIELD,
        value: 'Service 102'
      }
    ])

    await act(async () => {
      fireEvent.click(getByText('save'))
    })

    expect(container).toMatchSnapshot()
  })
})
