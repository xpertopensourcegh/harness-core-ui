import React from 'react'
import { Container, Text, IconName } from '@wings-software/uicore'
import { AddDescriptionAndTagsWithIdentifier } from '@common/components/AddDescriptionAndTags/AddDescriptionAndTags'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import { useStrings } from 'framework/exports'
import css from './ActivitySourceDetails.module.scss'

interface ActivitySourceDetailsProps {
  heading: string
  iconName: IconName
  iconLabel: string
  iconSize?: number
}

const ActivitySourceDetails: React.FC<ActivitySourceDetailsProps> = props => {
  const { getString } = useStrings()
  return (
    <Container className={css.mainDetails}>
      <Text font={{ size: 'medium' }} margin={{ top: 'large', bottom: 'large' }}>
        {props.heading}
      </Text>
      <CVSelectionCard
        isSelected={true}
        className={css.monitoringCard}
        iconProps={{
          size: props.iconSize ?? 40,
          name: props.iconName
        }}
        cardLabel={props.iconLabel}
        renderLabelOutsideCard={true}
      />
      <AddDescriptionAndTagsWithIdentifier identifierProps={{ inputLabel: getString('cv.activitySources.name') }} />
    </Container>
  )
}

export default ActivitySourceDetails
