import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import { CanvasButtons, CanvasButtonsActions } from '../CanvasButtons'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const getDummyEngine = () => ({
  zoomToFit: jest.fn(),
  getModel: jest.fn().mockImplementation(() => ({
    getZoomLevel: jest.fn().mockImplementation(() => 100),
    setZoomLevel: jest.fn(),
    setOffset: jest.fn()
  })),
  repaintCanvas: jest.fn()
})

const callBack = jest.fn()

describe('Canvas Button Tests', () => {
  test('should render canvas buttons', () => {
    const engine = getDummyEngine()
    const { container } = render(
      <TestWrapper>
        <CanvasButtons engine={engine as any} className="test" callback={callBack} />
      </TestWrapper>
    )
    expect(container).toMatchSnapshot()
  })
  test('should render canvas buttons Actions', () => {
    const engine = getDummyEngine()
    const { container } = render(
      <TestWrapper>
        <CanvasButtons engine={engine as any} callback={callBack} />
      </TestWrapper>
    )
    const buttons = container.querySelectorAll('.canvasButtons button')
    fireEvent.click(buttons[0])
    expect(callBack).toBeCalledWith(CanvasButtonsActions.ZoomToFit)
    callBack.mockReset()
    fireEvent.click(buttons[1])
    expect(callBack).toBeCalledWith(CanvasButtonsActions.ZoomToFit)
    callBack.mockReset()
    fireEvent.click(buttons[2])
    expect(callBack).toBeCalledWith(CanvasButtonsActions.ZoomIn)
    callBack.mockReset()
    fireEvent.click(buttons[3])
    expect(callBack).toBeCalledWith(CanvasButtonsActions.ZoomOut)
  })
})
