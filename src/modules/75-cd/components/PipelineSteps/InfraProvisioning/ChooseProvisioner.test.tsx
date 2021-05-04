import React from 'react'
import { render } from '@testing-library/react'

import { TestWrapper } from '@common/utils/testUtils'

import useChooseProvisioner from './ChooseProvisioner'

const TestComponent = (): React.ReactElement => {
  const { showModal, hideModal } = useChooseProvisioner({
    onSubmit: jest.fn(),
    onClose: jest.fn()
  })
  return (
    <>
      <button className="open" onClick={showModal} />
      <button className="close" onClick={hideModal} />
    </>
  )
}
describe('Choose Provisioner tests', () => {
  test('render dialog for choosing provisioner type', () => {
    const { container } = render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    )

    expect(container).toMatchSnapshot()
  })
})
