import React from 'react'
import { IconName, Text, Formik, FormInput, Button, Heading, Layout } from '@wings-software/uikit'
import * as Yup from 'yup'
import { PipelineContext } from '@pipeline/exports'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import type { StepViewType } from '@pipeline/exports'
import type { StepElement } from 'services/cd-ng'
import { StepType } from '../../PipelineStepInterface'
import i18n from './SaveCache.i18n'
import { PipelineStep } from '../../PipelineStep'
import stepCss from '../Steps.module.scss'

export interface RestoreCacheStepData extends StepElement {
  spec: {
    name?: string
    override?: boolean
    paths?: Array<string>
  }
}

interface RestoreCacheStepWidgetProps {
  initialValues: RestoreCacheStepData
  onUpdate?: (data: RestoreCacheStepData) => void
  stepViewType?: StepViewType
}

const RestoreCacheStepWidget: React.FC<RestoreCacheStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
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
        {i18n.saveCache}
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
                  name="spec.override"
                  label={i18n.override}
                  items={[
                    { label: 'true', value: 'true' },
                    { label: 'false', value: 'false' }
                  ]}
                />

                <Heading level={3}>{i18n.paths}</Heading>

                <FormInput.MultiSelectTypeInput
                  selectItems={[]}
                  name="spec.path"
                  placeholder={i18n.pathPlaceholder}
                  label=""
                />
                <Button margin={{ top: 'small' }} style={{ display: 'block' }} text="+ Path" minimal />
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

export class SaveCache extends PipelineStep<RestoreCacheStepData> {
  renderStep(
    initialValues: RestoreCacheStepData,
    onUpdate?: (data: RestoreCacheStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <RestoreCacheStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }

  protected type = StepType.SaveCache
  protected stepName = i18n.saveCache
  protected stepIcon: IconName = 'save-cache-step'

  protected defaultValues: RestoreCacheStepData = {
    identifier: '',
    spec: { paths: [] }
  }
}
