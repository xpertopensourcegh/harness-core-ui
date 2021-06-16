import React from 'react'
import { Text, Button, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { connect } from 'formik'
import { useStrings } from 'framework/strings'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import { FormMultiTypeDurationField } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
import { useVariablesExpression } from '@pipeline/components/PipelineStudio/PiplineHooks/useVariablesExpression'
import css from '../PipelineSteps/Steps/Steps.module.scss'

interface StepCommonFieldsInputSetProps<T> extends Omit<InputSetData<T>, 'path' | 'template'> {
  path?: string
  // @TODO: set up proper typing
  // eslint-disable-next-line
  template: any
  withoutTimeout?: boolean
}

function StepCommonFieldsInputSet<T>(props: StepCommonFieldsInputSetProps<T>): JSX.Element | null {
  const { path, template, readonly, withoutTimeout } = props
  const { getString } = useStrings()
  const { expressions } = useVariablesExpression()
  // const pullOptions = usePullOptions()
  const isLimitMemoryRuntime =
    getMultiTypeFromValue(template?.spec?.resources?.limits?.memory) === MultiTypeInputType.RUNTIME
  const isLimitCPURuntime = getMultiTypeFromValue(template?.spec?.resources?.limits?.cpu) === MultiTypeInputType.RUNTIME
  const isTimeoutRuntime = getMultiTypeFromValue(template?.timeout) === MultiTypeInputType.RUNTIME

  // If neither value is runtime then return null
  if (!isLimitMemoryRuntime && !isLimitCPURuntime && !isTimeoutRuntime) return null

  return (
    <>
      {/* TODO: Right now we do not support Image Pull Policy, should be added in a future*/}
      {(isLimitMemoryRuntime || isLimitCPURuntime) && (
        <>
          <Text margin={{ top: 'small' }}>
            {getString('pipelineSteps.setContainerResources')}
            <Button
              icon="question"
              minimal
              tooltip={getString('pipelineSteps.setContainerResourcesTooltip')}
              iconProps={{ size: 14 }}
            />
          </Text>
          <div
            className={cx(css.fieldsGroup, css.withoutSpacing, css.withoutAligning)}
            style={{ marginBottom: 'var(--spacing-small)' }}
          >
            {isLimitMemoryRuntime && (
              <MultiTypeTextField
                name={`${isEmpty(path) ? '' : `${path}.`}spec.resources.limits.memory`}
                label={
                  <Text style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-xsmall)' }}>
                    {getString('pipelineSteps.limitMemoryLabel')}
                  </Text>
                }
                style={{ flexGrow: 1, flexBasis: '50%' }}
                multiTextInputProps={{
                  placeholder: getString('pipelineSteps.limitMemoryPlaceholder'),
                  disabled: readonly,
                  multiTextInputProps: {
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }
                }}
              />
            )}
            {isLimitCPURuntime && (
              <MultiTypeTextField
                name={`${isEmpty(path) ? '' : `${path}.`}spec.resources.limits.cpu`}
                label={
                  <Text style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--spacing-xsmall)' }}>
                    {getString('pipelineSteps.limitCPULabel')}
                  </Text>
                }
                style={{ flexGrow: 1, flexBasis: '50%' }}
                multiTextInputProps={{
                  placeholder: getString('pipelineSteps.limitCPUPlaceholder'),
                  disabled: readonly,
                  multiTextInputProps: {
                    expressions,
                    allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
                  }
                }}
              />
            )}
          </div>
        </>
      )}
      {!withoutTimeout && isTimeoutRuntime && (
        <FormMultiTypeDurationField
          className={css.removeBpLabelMargin}
          label={
            <Text style={{ display: 'flex', alignItems: 'center' }}>
              {getString('pipelineSteps.timeoutLabel')}
              <Button
                icon="question"
                minimal
                tooltip={getString('pipelineSteps.timeoutInfo')}
                iconProps={{ size: 14 }}
              />
            </Text>
          }
          name={`${isEmpty(path) ? '' : `${path}.`}timeout`}
          placeholder={getString('pipelineSteps.timeoutPlaceholder')}
          multiTypeDurationProps={{
            expressions,
            allowableTypes: [MultiTypeInputType.EXPRESSION, MultiTypeInputType.FIXED]
          }}
          disabled={readonly}
        />
      )}
    </>
  )
}

export default connect(StepCommonFieldsInputSet)
