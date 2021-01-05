import React from 'react'

import { Text, FormInput, Link } from '@wings-software/uicore'
import { String } from 'framework/exports'

import css from '../AdvancedSteps.module.scss'

export default function SkipConditionsPanel(): React.ReactElement {
  return (
    <>
      <Text className={css.skipConditionLabel} font={{ weight: 'semi-bold' }} margin={{ bottom: 'large' }}>
        <String stringID="skipConditionLabel" />
      </Text>
      <FormInput.Text name="skipCondition" label="" />
      <Text font="small" style={{ whiteSpace: 'break-spaces' }}>
        <String stringID="skipConditionHelpText" />
        <br />
        <Link font="small" withoutHref>
          <String stringID="learnMore" />
        </Link>
      </Text>
    </>
  )
}
