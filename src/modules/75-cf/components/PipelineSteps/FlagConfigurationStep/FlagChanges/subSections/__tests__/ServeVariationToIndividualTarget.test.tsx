import React from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { Target, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import ServeVariationToIndividualTarget, {
  ServeVariationToIndividualTargetProps
} from '../ServeVariationToIndividualTarget'

const getProfileInitials = (str: string): string =>
  str
    .split(' ')
    .map(([firstLetter]) => firstLetter.toUpperCase())
    .join('')

const mockTargets: Partial<Target>[] = [
  { identifier: 't1', name: 'Target 1' },
  { identifier: 't2', name: 'Target 2' },
  { identifier: 't3', name: 'Target 3' }
]

const mockVariations: Partial<Variation>[] = [
  { identifier: 'v1', name: 'Variation 1' },
  { identifier: 'v2' },
  { identifier: 'v3', name: 'Variation 3' }
]

const mockFieldValues = (targets: Target[], variation: Variation): FlagConfigurationStepFormDataValues =>
  ({
    spec: {
      serveVariationToIndividualTarget: {
        include: {
          variation: variation.identifier as string,
          targets: targets.map(({ identifier }) => identifier as string)
        }
      }
    }
  } as FlagConfigurationStepFormDataValues)

const renderComponent = (props: Partial<ServeVariationToIndividualTargetProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <ServeVariationToIndividualTarget
        clearField={jest.fn()}
        setField={jest.fn()}
        subSectionSelector={<span />}
        targets={mockTargets as Target[]}
        variations={mockVariations as Variation[]}
        {...props}
      />
    </TestWrapper>
  )

describe('ServeVariationToIndividualTarget', () => {
  test('it should not display targets that are not part of the known targets', async () => {
    const fakeTarget = { name: 'NOT REAL', identifier: 'NOT_REAL' }
    const selectedTargets = [fakeTarget, mockTargets[0]] as Target[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, selectedVariation) })

    expect(screen.queryByText(getProfileInitials(fakeTarget.name))).not.toBeInTheDocument()
    expect(screen.queryByText(getProfileInitials(selectedTargets[1].name))).toBeInTheDocument()
  })

  test('it should not display the variation if it is not part of the known variations', async () => {
    const fakeVariation = { name: 'NOT REAL', identifier: 'NOT_REAL' } as Variation
    const selectedTargets = [mockTargets[0], mockTargets[2]] as Target[]

    renderComponent({ fieldValues: mockFieldValues(selectedTargets, fakeVariation) })

    expect(screen.queryByText(fakeVariation.name as string)).not.toBeInTheDocument()
  })
})
