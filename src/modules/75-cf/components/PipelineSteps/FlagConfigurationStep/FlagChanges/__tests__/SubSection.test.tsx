import React, { ReactElement } from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import SubSection, { disallowedProps, SubSectionProps } from '../SubSection'

const renderComponent = (
  props: Partial<SubSectionProps & { children: ReactElement } & Record<string, unknown>> = {}
): RenderResult => render(<SubSection subSectionSelector={<span />} {...props} />)

describe('SubSection', () => {
  test('it should display the passed removeSubSectionButton', async () => {
    const testId = 'TEST-EL-ID'
    renderComponent({ removeSubSectionButton: <span data-testid={testId} /> })

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })

  test('it should display the passed subSectionSelector', async () => {
    const testId = 'TEST-EL-ID'
    renderComponent({ subSectionSelector: <span data-testid={testId} /> })

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })

  test('it should display the passed children', async () => {
    const testId = 'TEST-EL-ID'
    renderComponent({ children: <span data-testid={testId} /> })

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })

  test('it should filter props that are meant for concrete sub-sections', async () => {
    const badProps = disallowedProps.reduce<Record<string, unknown>>(
      (props, propName) => ({ ...props, [propName]: propName }),
      {}
    )
    const goodProps: Record<string, unknown> = {
      'data-testid': 'testid',
      'data-somethingelse': 'somethingelse'
    }

    const { container } = renderComponent({ ...badProps, ...goodProps })

    for (const propName of disallowedProps) {
      expect(container.querySelector(`[${propName}]`)).not.toBeInTheDocument()
      expect(container.querySelector(`[${propName.toLowerCase()}]`)).not.toBeInTheDocument()
    }

    for (const [propName, propValue] of Object.entries(goodProps)) {
      expect(container.querySelector(`[${propName}]`)).toHaveAttribute(propName, propValue)
    }
  })
})
