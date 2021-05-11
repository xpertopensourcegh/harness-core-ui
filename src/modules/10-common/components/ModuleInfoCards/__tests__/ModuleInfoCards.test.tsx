import React from 'react'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { Module } from '@common/interfaces/RouteInterfaces'
import ModuleInfoCards, { INFO_CARD_PROPS } from '../ModuleInfoCards'

describe('ModuleInfoCards Test', () => {
  describe('Rendering', () => {
    test('that the module info cards render', () => {
      const props = {
        module: 'ce' as Module,
        setSelectedInfoCard: jest.fn(),
        selectedInfoCard: undefined
      }

      const { container, getByText } = render(
        <TestWrapper>
          <ModuleInfoCards {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.infoCardIntent')).toBeDefined()
      expect(container).toMatchSnapshot()
    })

    test('that the module info cards get selected', () => {
      const props = {
        module: 'ce' as Module,
        setSelectedInfoCard: jest.fn(),
        selectedInfoCard: INFO_CARD_PROPS['ce'][1]
      }

      const { container, getByText } = render(
        <TestWrapper>
          <ModuleInfoCards {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.infoCardIntent')).toBeDefined()

      expect(container).toMatchSnapshot()
    })

    test('that the set selected info card callback is called', async () => {
      const setSelectedInfoCardMock = jest.fn()

      const props = {
        module: 'ce' as Module,
        setSelectedInfoCard: setSelectedInfoCardMock,
        selectedInfoCard: INFO_CARD_PROPS['ce'][0]
      }

      const { getByText } = render(
        <TestWrapper>
          <ModuleInfoCards {...props} />
        </TestWrapper>
      )
      expect(getByText('common.purpose.infoCardIntent')).toBeDefined()

      fireEvent.click(getByText('common.ce.visibility'))

      await waitFor(() => expect(setSelectedInfoCardMock).toHaveBeenCalled())
    })

    test('that nothing is rendered', async () => {
      const props = {
        module: 'cf' as Module,
        setSelectedInfoCard: jest.fn(),
        selectedInfoCard: INFO_CARD_PROPS['ce'][1]
      }

      const { container } = render(
        <TestWrapper>
          <ModuleInfoCards {...props} />
        </TestWrapper>
      )

      expect(container).toMatchSnapshot()
    })
  })
})
