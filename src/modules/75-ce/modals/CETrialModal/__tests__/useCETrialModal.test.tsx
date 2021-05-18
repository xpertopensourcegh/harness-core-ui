/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper, findDialogContainer } from '@common/utils/testUtils'
import type { Project } from 'services/cd-ng'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import useCETrialModal from '../useCETrialModal'

interface TestComponentProps {
  openProjectModal?: () => void
  onClose?: () => void
  isProjectSelected?: boolean
  routeToCE?: (provider: ConnectorInfoDTO['type'], project?: Project) => void
}

const TestComponent = (props: TestComponentProps): React.ReactElement => {
  const { showModal, hideModal } = useCETrialModal({
    isProjectSelected: props.isProjectSelected ? props.isProjectSelected : false,
    routeToCE: props.routeToCE ? props.routeToCE : (_provider, _project) => {}
  })
  return (
    <>
      <button className="open" onClick={showModal} />
      <button className="close" onClick={hideModal} />
    </>
  )
}

describe('open and close the CE Trial Modal', () => {
  describe('Rendering', () => {
    test('should open  the start trial modal', async () => {
      const { container } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.open')!)

      const dialog = findDialogContainer() as HTMLElement
      expect(dialog).toMatchSnapshot()
    })

    test('should close the start trial modal', async () => {
      const { container } = render(
        <TestWrapper>
          <TestComponent />
        </TestWrapper>
      )
      fireEvent.click(container.querySelector('.close')!)

      const dialog = findDialogContainer() as HTMLElement
      expect(dialog).toMatchSnapshot()
    })
  })
})
