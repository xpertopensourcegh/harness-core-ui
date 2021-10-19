import React, { Children, cloneElement, FC, ReactElement } from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import type { Variation } from 'services/cf'
import ServePercentageRollout, { ServePercentageRolloutProps } from '../ServePercentageRollout'

const ComponentWrapper: FC = ({ children }) => (
  <TestWrapper>
    <Formik formName="test" onSubmit={jest.fn()} initialValues={{ spec: { percentageRollout: { variation: {} } } }}>
      {({ values }) =>
        Children.toArray(children).map(child => cloneElement(child as ReactElement, { fieldValues: values }))
      }
    </Formik>
  </TestWrapper>
)

const renderComponent = (props: Partial<ServePercentageRolloutProps> = {}): RenderResult =>
  render(<ServePercentageRollout subSectionSelector={<span />} clearField={jest.fn()} {...props} />, {
    wrapper: ComponentWrapper
  })

describe('ServePercentageRollout', () => {
  test('it should render', async () => {
    renderComponent()

    expect(screen.getByText('cf.percentageRollout.toTargetGroup')).toBeInTheDocument()
    expect(screen.getByText('cf.percentageRollout.bucketBy')).toBeInTheDocument()
  })

  test('it should prune unused variation values when the variations list changes', async () => {
    const variations1: Variation[] = [
      { name: 'Test 1', identifier: 'test1', value: 'test1' },
      { name: 'Test 2', identifier: 'test2', value: 'test2' }
    ]

    const variations2: Variation[] = [
      { name: 'Test 3', identifier: 'test3', value: 'test3' },
      { name: 'Test 4', identifier: 'test4', value: 'test4' }
    ]

    const clearFieldMock = jest.fn()

    const { rerender } = render(
      <ServePercentageRollout clearField={clearFieldMock} subSectionSelector={<span />} variations={variations1} />,
      { wrapper: ComponentWrapper }
    )

    for (const { name, identifier } of variations1) {
      await userEvent.type(
        screen.getByText(name || identifier).parentElement?.parentElement?.querySelector('input') as HTMLInputElement,
        Math.floor(100 / variations1.length).toString()
      )
    }

    rerender(
      <ServePercentageRollout clearField={clearFieldMock} subSectionSelector={<span />} variations={variations2} />
    )
    await waitFor(() => {
      variations1.forEach(({ identifier }) =>
        expect(clearFieldMock).toHaveBeenCalledWith(expect.stringContaining(identifier))
      )
    })
  })
})
