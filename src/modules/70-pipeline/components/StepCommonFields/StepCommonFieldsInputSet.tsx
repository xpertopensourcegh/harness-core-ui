import React from 'react'
import { Text, Button, FormInput, getMultiTypeFromValue, MultiTypeInputType } from '@wings-software/uicore'
import cx from 'classnames'
import { isEmpty } from 'lodash-es'
import { connect } from 'formik'
import { useStrings } from 'framework/strings'
import { DurationInputFieldForInputSet } from '@common/components/MultiTypeDuration/MultiTypeDuration'
import type { InputSetData } from '@pipeline/components/AbstractSteps/Step'
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
              <FormInput.Text
                name={`${isEmpty(path) ? '' : `${path}.`}spec.resources.limits.memory`}
                label={
                  <Text style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('pipelineSteps.limitMemoryLabel')}
                  </Text>
                }
                style={{ flexGrow: 1, flexBasis: '50%' }}
                placeholder={getString('pipelineSteps.limitMemoryPlaceholder')}
                disabled={readonly}
              />
            )}
            {isLimitCPURuntime && (
              <FormInput.Text
                name={`${isEmpty(path) ? '' : `${path}.`}spec.resources.limits.cpu`}
                label={
                  <Text style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('pipelineSteps.limitCPULabel')}
                  </Text>
                }
                style={{ flexGrow: 1, flexBasis: '50%' }}
                placeholder={getString('pipelineSteps.limitCPUPlaceholder')}
                disabled={readonly}
              />
            )}
          </div>
        </>
      )}
      {!withoutTimeout && isTimeoutRuntime && (
        <DurationInputFieldForInputSet
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
          inputProps={{ placeholder: getString('pipelineSteps.timeoutPlaceholder') }}
          disabled={readonly}
        />
      )}
    </>
  )
}

export default connect(StepCommonFieldsInputSet)
