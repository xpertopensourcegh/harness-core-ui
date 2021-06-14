import React from 'react'
import { Container, HarnessDocTooltip } from '@wings-software/uicore'
import { Checkbox } from '@blueprintjs/core'
import type { FormikProps } from 'formik'
import cx from 'classnames'
import { useStrings } from 'framework/strings'
import { MonacoTextField } from '@common/components/MonacoTextField/MonacoTextField'
import { useVariablesExpression } from '../../../PipelineStudio/PiplineHooks/useVariablesExpression'
import type { Modes } from '../common'
import type { ConditionalExecutionOption } from './ConditionalExecutionPanelUtils'
import { ModeEntityNameMap } from './ConditionalExecutionPanelUtils'
import css from './ConditionalExecutionPanel.module.scss'

interface ConditionalExecutionConditionProps {
  formikProps: FormikProps<ConditionalExecutionOption>
  mode: Modes
  isReadonly: boolean
}

export default function ConditionalExecutionCondition(props: ConditionalExecutionConditionProps): React.ReactElement {
  const { expressions } = useVariablesExpression()
  const { getString } = useStrings()
  const { formikProps, mode, isReadonly } = props

  return (
    <>
      <Checkbox
        name="enableJEXL"
        checked={formikProps.values.enableJEXL}
        disabled={isReadonly}
        className={cx(css.blackText, { [css.active]: formikProps.values.enableJEXL })}
        labelElement={
          <span data-tooltip-id="conditionalExecution">
            {getString('pipeline.conditionalExecution.condition', { entity: ModeEntityNameMap[mode] })}
            <HarnessDocTooltip tooltipId="conditionalExecution" useStandAlone={true} />
          </span>
        }
        onChange={e => {
          const isChecked = e.currentTarget.checked
          formikProps.setFieldValue('enableJEXL', isChecked)
          if (!isChecked) {
            formikProps.setFieldValue('condition', null)
          }
        }}
      />
      <Container padding={{ top: 'small', left: 'large' }}>
        <MonacoTextField
          name="condition"
          expressions={expressions}
          disabled={!formikProps.values.enableJEXL || isReadonly}
        />
      </Container>
    </>
  )
}
