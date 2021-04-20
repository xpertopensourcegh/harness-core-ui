import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { Container } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import { SubmitAndPreviousButtonProps, SubmitAndPreviousButtons } from '../SubmitAndPreviousButtons'

function WrappedComponent(props: SubmitAndPreviousButtonProps): JSX.Element {
  return (
    <TestWrapper>
      <Container>
        <SubmitAndPreviousButtons {...props} />
      </Container>
    </TestWrapper>
  )
}

describe('Unit tests for SubmitAndPreviousTestButtons', () => {
  test('Ensure previous and next buttons render and call passed in props', async () => {
    const previousFunc = jest.fn()
    const nextFunc = jest.fn()
    const { container } = render(<WrappedComponent onPreviousClick={previousFunc} onNextClick={nextFunc} />)

    await waitFor(() => expect(container.querySelector('[class*="main"]')).not.toBeNull())
    const buttons = container.querySelectorAll('button')
    expect(buttons.length).toBe(2)
    fireEvent.click(buttons[0])
    await waitFor(() => expect(previousFunc).toHaveBeenCalledTimes(1))
    fireEvent.click(buttons[1])
    await waitFor(() => expect(nextFunc).toHaveBeenCalledTimes(1))
  })
})
