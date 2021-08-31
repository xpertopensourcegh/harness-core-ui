import React from 'react'
import { render, waitFor, fireEvent, act } from '@testing-library/react'
import { InputTypes, setFieldValue } from '@common/utils/JestFormHelper'
import { TestWrapper } from '@common/utils/testUtils'
import { ChangeSourceDrawer } from '../ChangeSourceDrawer'
import { changeSourceTableData, changeSourceDrawerData, onSuccessExpectedData } from './ChangeSourceDrawer.mock'

const onSuccess = jest.fn()
const hideDrawer = jest.fn()
describe('Test Change Source Drawer', () => {
  test('ChangeSource Drawer renders in create mode', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <ChangeSourceDrawer
          isEdit={false}
          rowdata={{ spec: {} }}
          tableData={[]}
          onSuccess={onSuccess}
          hideDrawer={hideDrawer}
        />
      </TestWrapper>
    )

    // change source name input and source type dropdown are rendered
    await waitFor(() => expect(getByText('cv.changeSource.sourceName')).toBeTruthy())
    await waitFor(() => expect(container.querySelector('input[name="category"]')).toBeTruthy())

    act(() => {
      fireEvent.click(getByText('submit'))
    })

    await waitFor(() => expect(getByText('cv.changeSource.selectChangeSourceName')).toBeTruthy())
    await waitFor(() => expect(getByText('cv.changeSource.selectChangeSourceProvider')).toBeTruthy())

    expect(container).toMatchSnapshot()
  })

  test('ChangeSource Drawer renders in edit mode for HarnessCD', async () => {
    const { container, getByText } = render(
      <TestWrapper>
        <ChangeSourceDrawer
          isEdit
          rowdata={changeSourceDrawerData}
          tableData={changeSourceTableData}
          onSuccess={onSuccess}
          hideDrawer={hideDrawer}
        />
      </TestWrapper>
    )

    // change source name input and source type dropdown are rendered
    await waitFor(() => expect(container.querySelector('input[value="deploymentText"]')).toBeTruthy())
    await waitFor(() => expect(container.querySelector('input[value="HarnessCD"]')).toBeTruthy())
    await waitFor(() => expect(getByText('cv.onboarding.changeSourceTypes.HarnessCDNextGen.name')).toBeTruthy())

    // category dropdown and thumbnailSelect are disabled in editmode
    await waitFor(() => expect(container.querySelector('input[value="deploymentText"]')).toBeDisabled())
    await waitFor(() => expect(container.querySelector('input[value="HarnessCD"]')).toBeDisabled())

    setFieldValue({
      container,
      fieldId: 'name',
      value: 'Updated Change Source',
      type: InputTypes.TEXTFIELD
    })

    // check chnageSource name is updated
    await waitFor(() => expect(container.querySelector('input[value="Updated Change Source"]')).toBeTruthy())

    act(() => {
      fireEvent.click(getByText('submit'))
    })
    await waitFor(() => expect(onSuccess).toHaveBeenCalledWith(onSuccessExpectedData))
    expect(container).toMatchSnapshot()
  })
})
