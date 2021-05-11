import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import useStartTrialModal from '../StartTrialModal'

const TestComponent = (): React.ReactElement => {
  const { showModal, hideModal } = useStartTrialModal({
    handleStartTrial: jest.fn(),
    module: 'ce'
  })
  return (
    <>
      <button className="open" onClick={showModal} />
      <button className="close" onClick={hideModal} />
    </>
  )
}

describe('open and close Start Trial Modal', () => {
  describe('Rendering', () => {
    test('should open and close the start trial modal', async () => {
      const { container, getByText } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.open')!)
      await waitFor(() => expect(() => getByText('Welcome, let’s get you started!')).toBeDefined())
      expect(container).toMatchSnapshot()
    })
  })
})
