import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import SkipCondition from '../SkipCondition'

const getProps = () => ({
  onUpdate: jest.fn(),
  selectedStage: {
    stage: {
      skipCondition: 'somecondition',
      stageName: 'stageName',
      name: 'stageName'
    }
  }
})

describe('Skip Condition in pipeline', () => {
  test('Skip condition in stage', async () => {
    const props = getProps()
    const { getByDisplayValue, getByText } = render(
      <TestWrapper>
        <SkipCondition {...props} />
      </TestWrapper>
    )

    fireEvent.change(getByDisplayValue('somecondition'), { target: { value: 'somechangedvalue' } })
    fireEvent.click(getByText('Submit'))

    await waitFor(() => {
      expect(props.onUpdate).toBeCalled()
    })
  })
})
