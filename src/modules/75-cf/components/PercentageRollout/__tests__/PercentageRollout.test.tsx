import React from 'react'
import { render, RenderResult, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Formik } from '@wings-software/uicore'
import { TestWrapper } from '@common/utils/testUtils'
import type { Segment, TargetAttributesResponse, Variation } from 'services/cf'
import PercentageRollout, { PercentageRolloutProps } from '@cf/components/PercentageRollout/PercentageRollout'

const mockTargetGroups: Segment[] = [
  { name: 'Group 1', identifier: 'g1' },
  { name: 'Group 2', identifier: 'g2' },
  { name: 'Group 3', identifier: 'g3' }
]

const mockVariations: Variation[] = [
  { name: 'Variation 1', value: 'var1', identifier: 'var1', description: 'Variation 1 description' },
  { value: 'var2', identifier: 'var2', description: 'Variation 2 description' },
  { name: 'Variation 3', value: 'var3', identifier: 'var3', description: 'Variation 3 description' }
]

const mockAttributes: TargetAttributesResponse = ['attribute1', 'attribute2', 'attribute3']

const mockInitialValues: PercentageRolloutProps['fieldValues'] = {
  variation: {}
}

const renderComponent = (
  props: Partial<PercentageRolloutProps> = {},
  initialValues: PercentageRolloutProps['fieldValues'] = mockInitialValues
): RenderResult => {
  const prefix = props.namePrefix || 'test'

  return render(
    <TestWrapper>
      <Formik formName="test" onSubmit={jest.fn()} initialValues={{ [prefix]: initialValues }}>
        {({ values }) => (
          <PercentageRollout
            namePrefix={prefix}
            targetGroups={mockTargetGroups}
            variations={mockVariations}
            fieldValues={values[prefix]}
            bucketByAttributes={mockAttributes}
            {...props}
          />
        )}
      </Formik>
    </TestWrapper>
  )
}

describe('PercentageRollout', () => {
  test('it should prefix input names with the namePrefix', async () => {
    const namePrefix = 'TEST-PREFIX'
    const { container } = renderComponent({ namePrefix })

    container.querySelectorAll('input').forEach(input => {
      expect(input).toHaveAttribute('name', expect.stringMatching(new RegExp(`^${namePrefix}`)))
    })
  })

  test('it should display a drop down with all target groups', async () => {
    const { container } = renderComponent()

    expect(screen.getByText('cf.percentageRollout.toTargetGroup')).toBeInTheDocument()

    mockTargetGroups.forEach(({ name }) => {
      expect(screen.queryByText(name)).not.toBeInTheDocument()
    })

    await userEvent.click(container.querySelector('[name$="targetGroup"]')?.closest('.bp3-input') as HTMLElement)

    await waitFor(() => {
      mockTargetGroups.forEach(({ name }) => {
        expect(screen.getByText(name)).toBeInTheDocument()
      })
    })
  })

  test('it should display a row for each variation', async () => {
    renderComponent()

    mockVariations.forEach(({ name, identifier }) => {
      const titleEl = screen.getByText(name || identifier)
      expect(titleEl).toBeInTheDocument()
      expect((titleEl.closest('.variationRow') as HTMLInputElement).querySelector('input')).toBeInTheDocument()
    })
  })

  test('it should display the sum of the variation weights as the total', async () => {
    renderComponent()

    const variationInputs = screen.getAllByRole('spinbutton') // accessible role for a number input
    const total = screen.getByText('0%')

    expect(variationInputs).toHaveLength(3)
    expect(total).toHaveTextContent('0%')

    await userEvent.type(variationInputs[0], '33')
    expect(total).toHaveTextContent('33%')

    await userEvent.type(variationInputs[1], '33')
    expect(total).toHaveTextContent('66%')

    await userEvent.type(variationInputs[2], '34')
    expect(total).toHaveTextContent('100%')
  })

  test('it should display an error message when the total is > 100%', async () => {
    renderComponent()

    expect(screen.queryByText('cf.percentageRollout.invalidTotalError')).not.toBeInTheDocument()

    const input = screen.getAllByRole('spinbutton')[0]

    await userEvent.type(input, '99')
    expect(screen.queryByText('cf.percentageRollout.invalidTotalError')).not.toBeInTheDocument()

    await userEvent.clear(input)
    await userEvent.type(input, '101')
    expect(screen.getByText('cf.percentageRollout.invalidTotalError')).toBeInTheDocument()

    await userEvent.clear(input)
    await userEvent.type(input, '100')
    expect(screen.queryByText('cf.percentageRollout.invalidTotalError')).not.toBeInTheDocument()
  })

  test('it should display a drop down with with all attributes to bucket by', async () => {
    const { container } = renderComponent()

    expect(screen.getByText('cf.percentageRollout.bucketBy')).toBeInTheDocument()

    mockAttributes.forEach(attribute => {
      expect(screen.queryByText(attribute)).not.toBeInTheDocument()
    })

    await userEvent.click(container.querySelector('[name$="bucketBy"]')?.closest('.bp3-input') as HTMLElement)

    await waitFor(() => {
      mockAttributes.forEach(attribute => {
        expect(screen.getByText(attribute)).toBeInTheDocument()
      })
    })
  })
})
