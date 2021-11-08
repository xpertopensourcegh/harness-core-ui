import React from 'react'
import { render, RenderResult, screen } from '@testing-library/react'
import { TestWrapper } from '@common/utils/testUtils'
import type { Segment, Target, Variation } from 'services/cf'
import type { FlagConfigurationStepFormDataValues } from '@cf/components/PipelineSteps/FlagConfigurationStep/types'
import ServeVariationToTargetGroup, { ServeVariationToTargetGroupProps } from '../ServeVariationToTargetGroup'

const getProfileInitials = (str: string): string =>
  str
    .split(' ')
    .map(([firstLetter]) => firstLetter.toUpperCase())
    .join('')

const mockTargetGroups: Partial<Target>[] = [
  { identifier: 'tg1', name: 'TargetGroup 1' },
  { identifier: 'tg2', name: 'TargetGroup 2' },
  { identifier: 'tg3', name: 'TargetGroup 3' }
]

const mockVariations: Partial<Variation>[] = [
  { identifier: 'v1', name: 'Variation 1' },
  { identifier: 'v2' },
  { identifier: 'v3', name: 'Variation 3' }
]

const mockFieldValues = (targetGroups: Segment[], variation: Variation): FlagConfigurationStepFormDataValues =>
  ({
    spec: {
      serveVariationToTargetGroup: {
        include: {
          variation: variation.identifier as string,
          targetGroups: targetGroups.map(({ identifier }) => identifier as string)
        }
      }
    }
  } as FlagConfigurationStepFormDataValues)

const renderComponent = (props: Partial<ServeVariationToTargetGroupProps> = {}): RenderResult =>
  render(
    <TestWrapper>
      <ServeVariationToTargetGroup
        clearField={jest.fn()}
        setField={jest.fn()}
        subSectionSelector={<span />}
        targetGroups={mockTargetGroups as Segment[]}
        variations={mockVariations as Variation[]}
        {...props}
      />
    </TestWrapper>
  )

describe('ServeVariationToTargetGroup', () => {
  test('it should not display target groups that are not part of the known targets', async () => {
    const fakeTargetGroup = { name: 'NOT REAL', identifier: 'NOT_REAL' }
    const selectedTargetGroups = [fakeTargetGroup, mockTargetGroups[0]] as Segment[]
    const selectedVariation = mockVariations[0] as Variation

    renderComponent({ fieldValues: mockFieldValues(selectedTargetGroups, selectedVariation) })

    expect(screen.queryByText(getProfileInitials(fakeTargetGroup.name))).not.toBeInTheDocument()
    expect(screen.queryByText(getProfileInitials(selectedTargetGroups[1].name))).toBeInTheDocument()
  })

  test('it should not display the variation if it is not part of the known variations', async () => {
    const fakeVariation = { name: 'NOT REAL', identifier: 'NOT_REAL' } as Variation
    const selectedTargetGroups = [mockTargetGroups[0], mockTargetGroups[2]] as Segment[]

    renderComponent({ fieldValues: mockFieldValues(selectedTargetGroups, fakeVariation) })

    expect(screen.queryByText(fakeVariation.name as string)).not.toBeInTheDocument()
  })
})
