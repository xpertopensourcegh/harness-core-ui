import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { useExtendTrialOrFeedbackModal, FORM_TYPE } from '../useExtendTrialOrFeedbackModal'

const onCloseModal = jest.fn()
const TestComponent = (): React.ReactElement => {
  const { openExtendTrialOrFeedbackModal, closeExtendTrialOrFeedbackModal } = useExtendTrialOrFeedbackModal({
    onSubmit: jest.fn(),
    onCloseModal,
    moduleDescription: 'Continuous Delivery',
    bgImg: '',
    expiryDateStr: 'June 30 2021',
    formType: FORM_TYPE.EXTEND_TRIAL
  })
  return (
    <>
      <button className="open" onClick={openExtendTrialOrFeedbackModal} />
      <button className="close" onClick={closeExtendTrialOrFeedbackModal} />
    </>
  )
}
describe('Extend Trial Modal', () => {
  describe('Rendering', () => {
    test('should render Extend Trial Modal', async () => {
      const { container, getByText } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.open')!)
      await waitFor(() => expect(() => getByText('common.extendTrial.heading')))
      expect(container).toMatchSnapshot()
    })

    test('should open and close Extend Trial Modal', async () => {
      const { container, getByText, getByRole } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.open')!)
      await waitFor(() => expect(() => getByText('common.extendTrial.heading')))
      fireEvent.click(getByRole('button', { name: 'close modal' }))
      await waitFor(() => expect(onCloseModal).toBeCalled())
    })

    test('should close modal by closeExtendTrialModal', async () => {
      const { container, getByText } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.open')!)
      await waitFor(() => expect(() => getByText('common.extendTrial.heading')))
      fireEvent.click(container.querySelector('.close')!)
      await waitFor(() => expect(onCloseModal).toBeCalled())
    })
  })
})
