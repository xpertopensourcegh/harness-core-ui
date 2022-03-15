/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import { Button, ButtonVariation, Card, Container, FontVariation, Heading, Layout, Text } from '@harness/uicore'
import React, { ReactElement } from 'react'

import { PopoverPosition } from '@blueprintjs/core'
import { useStrings } from 'framework/strings'
import type { Segment, Target, TargetMap, Variation } from 'services/cf'
import DefaultRules from '../default-rules/DefaultRules'
import SpecificTargetingItem from '../specific-targeting-item.tsx/SpecificTargetingItem'
import type { FormVariationMap, TargetGroup } from '../../TargetingRulesTab'

export interface FlagEnabledRulesCardProps {
  targets: Target[]
  segments: Segment[]
  formVariationMap: FormVariationMap[]
  featureFlagVariations: Variation[]
  isLoading: boolean
  updateTargetGroups: (index: number, newTargetGroups: TargetGroup[]) => void
  updateTargets: (index: number, newTargetGroups: TargetMap[]) => void
  addVariation: (newVariation: FormVariationMap) => void
  removeVariation: (removedVariation: FormVariationMap) => void
}

const FlagEnabledRulesCard = (props: FlagEnabledRulesCardProps): ReactElement => {
  const {
    targets,
    segments,
    formVariationMap,
    featureFlagVariations,
    updateTargetGroups,
    updateTargets,
    addVariation,
    removeVariation,
    isLoading
  } = props

  const { getString } = useStrings()

  const addTargetingDropdownVariations = formVariationMap.filter(variation => !variation.isVisible)

  return (
    <Card data-testid="flag-enabled-rules-card">
      <Container border={{ bottom: true }} padding={{ bottom: 'medium' }}>
        <DefaultRules featureFlagVariations={featureFlagVariations} isLoading={isLoading} />
      </Container>
      <Container padding={{ bottom: 'medium' }}>
        <Layout.Vertical spacing="medium">
          <Heading level={4} font={{ variation: FontVariation.BODY2 }} margin={{ top: 'medium' }}>
            {getString('cf.featureFlags.rules.specificTargeting')}
          </Heading>
          {formVariationMap.map((formVariationMapItem, index) => (
            <>
              {formVariationMapItem.isVisible && (
                <SpecificTargetingItem
                  key={`${formVariationMapItem.variationIdentifier}_${index}`}
                  index={index}
                  isLoading={isLoading}
                  targets={targets}
                  segments={segments}
                  formVariationMapItem={formVariationMapItem}
                  updateTargetGroups={updateTargetGroups}
                  updateTargets={updateTargets}
                  removeVariation={() => removeVariation(formVariationMapItem)}
                />
              )}
            </>
          ))}
          {addTargetingDropdownVariations.length > 0 && (
            <Button
              icon="plus"
              rightIcon="chevron-down"
              variation={ButtonVariation.SECONDARY}
              text="Add Targeting"
              tooltipProps={{
                fill: true,
                interactionKind: 'click',
                minimal: true,
                position: PopoverPosition.BOTTOM_LEFT
              }}
              tooltip={
                <Layout.Vertical padding="small" spacing="small">
                  {addTargetingDropdownVariations.map(variation => (
                    <Text
                      data-testid={`variation_option_${variation.variationIdentifier}`}
                      inline
                      onClick={() => addVariation(variation)}
                      key={variation.variationIdentifier}
                      font={{ variation: FontVariation.BODY }}
                      icon="full-circle"
                    >
                      {variation.variationName}
                    </Text>
                  ))}
                </Layout.Vertical>
              }
            />
          )}
        </Layout.Vertical>
      </Container>
    </Card>
  )
}

export default FlagEnabledRulesCard
