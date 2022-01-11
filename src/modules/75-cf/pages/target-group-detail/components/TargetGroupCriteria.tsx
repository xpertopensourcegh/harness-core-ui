import React, { FC } from 'react'
import { FontVariation, Heading, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import type { Segment } from 'services/cf'
import TargetGroupCriteriaTargetListing from './TargetGroupCriteriaTargetListing'
import TargetGroupCriteriaConditionListing from './TargetGroupCriteriaConditionListing'

import css from './TargetGroupCriteria.module.scss'

export interface TargetGroupCriteriaProps {
  targetGroup: Segment
}

const TargetGroupCriteria: FC<TargetGroupCriteriaProps> = ({ targetGroup }) => {
  const { getString } = useStrings()

  return (
    <aside className={css.layout}>
      <Heading level={3} font={{ variation: FontVariation.H5 }}>
        {getString('cf.segmentDetail.criteria')}
      </Heading>

      <section className={css.section}>
        <Heading level={4} font={{ variation: FontVariation.H6 }}>
          {getString('cf.segmentDetail.specificTargets')}
        </Heading>

        <div className={css.subSection}>
          <Text font={{ variation: FontVariation.FORM_LABEL }}>
            {getString('cf.segmentDetail.includeTheFollowing')}:
          </Text>
          <TargetGroupCriteriaTargetListing targets={targetGroup.included} />
        </div>

        <div className={css.subSection}>
          <Text font={{ variation: FontVariation.FORM_LABEL }}>
            {getString('cf.segmentDetail.excludeTheFollowing')}:
          </Text>
          <TargetGroupCriteriaTargetListing targets={targetGroup.excluded} />
        </div>
      </section>

      <section className={css.section}>
        <Heading level={4} font={{ variation: FontVariation.H6 }}>
          {getString('cf.segmentDetail.targetBasedOnCondition')}
        </Heading>

        <TargetGroupCriteriaConditionListing rules={targetGroup.rules} />
      </section>
    </aside>
  )
}

export default TargetGroupCriteria