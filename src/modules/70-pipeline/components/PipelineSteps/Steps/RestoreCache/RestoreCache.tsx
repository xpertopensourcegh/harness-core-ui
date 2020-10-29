import React from 'react'
import { IconName, Text, Formik, FormInput, Button, Layout } from '@wings-software/uikit'
import * as Yup from 'yup'
import type { StepViewType } from '@pipeline/exports'
import { PipelineContext } from '@pipeline/exports'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import type { StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './RestoreCache.i18n'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface RestoreCacheStepData extends StepElement {
  spec: {
    name?: string
    key?: string
    fail?: boolean
  }
}

interface SaveCacheStepWidgetProps {
  initialValues: RestoreCacheStepData
  onUpdate?: (data: RestoreCacheStepData) => void
  stepViewType?: StepViewType
}

const RestoreCacheStepWidget: React.FC<SaveCacheStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.StepConfig }
    })
  }
  return (
    <>
      <Text className={stepCss.boldLabel} font={{ size: 'medium' }}>
        {i18n.restoreCache}
      </Text>
      <Formik<RestoreCacheStepData>
        onSubmit={values => {
          onUpdate?.(values)
        }}
        initialValues={initialValues}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(i18n.stepNameRequired)
        })}
      >
        {({ submitForm }) => {
          return (
            <>
              <Layout.Vertical margin={{ bottom: 'huge' }}>
                <FormInput.InputWithIdentifier
                  inputLabel="Step name"
                  inputGroupProps={{ placeholder: i18n.stepNamePlaceholder }}
                />

                <FormInput.MultiSelectTypeInput selectItems={[]} placeholder="Search" name="spec.key" label="Key" />

                <FormInput.Select
                  style={{ width: '50%' }}
                  name="spec.fail"
                  label="Fail if not exist"
                  items={[
                    { label: 'true', value: 'true' },
                    { label: 'false', value: 'false' }
                  ]}
                />
              </Layout.Vertical>
              <Layout.Horizontal>
                <Button intent="primary" text={i18n.add} onClick={submitForm} />
                <Button minimal text={i18n.cancel} onClick={handleCancelClick} />
              </Layout.Horizontal>
            </>
          )
        }}
      </Formik>
    </>
  )
}

export class RestoreCache extends PipelineStep<RestoreCacheStepData> {
  renderStep(
    initialValues: RestoreCacheStepData,
    onUpdate?: (data: RestoreCacheStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <RestoreCacheStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.RestoreCache
  protected stepName = i18n.restoreCache
  protected stepIcon: IconName = 'restore-cache-step'

  protected defaultValues: RestoreCacheStepData = {
    identifier: '',
    spec: {}
  }
}
