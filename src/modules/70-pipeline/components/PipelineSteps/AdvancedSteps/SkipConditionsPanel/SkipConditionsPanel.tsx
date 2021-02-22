import React from 'react'

import { Text, FormInput, Link } from '@wings-software/uicore'
import { String } from 'framework/exports'

import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import { Modes } from '../common'
import css from '../AdvancedSteps.module.scss'

export interface SkipConditionPanelProps {
  mode?: Modes
}

export default function SkipConditionsPanel(props: SkipConditionPanelProps): React.ReactElement {
  const { expressions } = useVariablesExpression()
  const labelStringID = props.mode === Modes.STAGE ? 'skipConditionStageLabel' : 'skipConditionLabel'
  const helpTextStringId = props.mode === Modes.STAGE ? 'skipConditionText' : 'skipConditionHelpText'
  return (
    <>
      <Text className={css.skipConditionLabel} font={{ weight: 'semi-bold' }} margin={{ bottom: 'large' }}>
        <String stringID={labelStringID} />
      </Text>
      <FormInput.ExpressionInput items={expressions} name="skipCondition" label="" />
      <Text font="small" style={{ whiteSpace: 'break-spaces' }}>
        <String stringID={helpTextStringId} />
        <br />
        <Link font="small" withoutHref>
          <String stringID="learnMore" />
        </Link>
      </Text>
    </>
  )
}
