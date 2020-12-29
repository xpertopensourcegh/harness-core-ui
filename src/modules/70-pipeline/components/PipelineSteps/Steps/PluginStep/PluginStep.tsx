import React from 'react'
import {
  Text,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  IconName,
  FormikForm
} from '@wings-software/uikit'
import { useParams } from 'react-router-dom'
import { PipelineContext, StepViewType, getStageFromPipeline } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import { useConnectorRef } from '../StepsUseConnectorRef'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat,
  Types as TransformValuesTypes
} from '../StepsTransformValuesUtils'
import { useValidate, Types as ValidationFieldTypes } from '../StepsValidateUtils'
import type { MultiTypeMapType, MultiTypeMapUIType, MultiTypeConnectorRef, Resources } from '../StepsTypes'
import css from '../Steps.module.scss'

export interface PluginStepSpec {
  connectorRef: string
  image: string
  settings?: MultiTypeMapType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface PluginStepData {
  identifier: string
  name?: string
  description?: string
  type: string
  timeout?: string
  spec: PluginStepSpec
}

export interface PluginStepSpecUI extends Omit<PluginStepSpec, 'connectorRef' | 'settings' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  settings?: MultiTypeMapUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface PluginStepDataUI extends Omit<PluginStepData, 'spec'> {
  spec: PluginStepSpecUI
}

export interface PluginStepWidgetProps {
  initialValues: PluginStepData
  onUpdate?: (data: PluginStepData) => void
  stepViewType?: StepViewType
}

const transformValuesFields = [
  {
    name: 'identifier',
    type: TransformValuesTypes.Text
  },
  {
    name: 'name',
    type: TransformValuesTypes.Text
  },
  {
    name: 'description',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.connectorRef',
    type: TransformValuesTypes.ConnectorRef
  },
  {
    name: 'spec.image',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.settings',
    type: TransformValuesTypes.Map
  },
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // {
  //   name: 'spec.pull',
  //   type: TransformValuesTypes.Pull
  // },
  {
    name: 'spec.limitMemory',
    type: TransformValuesTypes.LimitMemory
  },
  {
    name: 'spec.limitCPU',
    type: TransformValuesTypes.LimitCPU
  },
  {
    name: 'timeout',
    type: TransformValuesTypes.Text
  }
]

const validateFields = [
  {
    name: 'identifier',
    type: ValidationFieldTypes.Identifier,
    required: true
  },
  {
    name: 'name',
    type: ValidationFieldTypes.Name,
    required: true
  },
  {
    name: 'spec.connectorRef',
    type: ValidationFieldTypes.ConnectorRef,
    required: true
  },
  {
    name: 'spec.image',
    type: ValidationFieldTypes.Image,
    required: true
  },
  {
    name: 'spec.settings',
    type: ValidationFieldTypes.Settings,
    required: true
  },
  {
    name: 'spec.limitMemory',
    type: ValidationFieldTypes.LimitMemory
  },
  {
    name: 'spec.limitCPU',
    type: ValidationFieldTypes.LimitCPU
  },
  {
    name: 'timeout',
    type: ValidationFieldTypes.Timeout
  }
]

export const PluginStepWidget: React.FC<PluginStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
  const {
    state: { pipeline, pipelineView },
    updatePipelineView
  } = React.useContext(PipelineContext)

  const { getString } = useStrings()

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const { connector, loading } = useConnectorRef(initialValues.spec.connectorRef)

  const { stage: currentStage } = getStageFromPipeline(pipeline, pipelineView.splitViewData.selectedStageId || '')

  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // const pullOptions = usePullOptions()

  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // const values = getInitialValuesInCorrectFormat<PluginStepData, PluginStepDataUI>(initialValues, transformValuesFields, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<PluginStepData, PluginStepDataUI>(initialValues, transformValuesFields)

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<PluginStepDataUI>(validateFields, {
    initialValues,
    steps: currentStage?.stage.spec.execution.steps
  })

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.StepConfig }
    })
  }

  return (
    <>
      <Text className={css.boldLabel} font={{ size: 'medium' }}>
        {getString('pipelineSteps.plugin.title')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validate={validate}
        onSubmit={(_values: PluginStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<PluginStepDataUI, PluginStepData>(
            _values,
            transformValuesFields
          )
          onUpdate?.(schemaValues)
        }}
      >
        {({ values: formValues }) => (
          <FormikForm>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier
                inputName="name"
                idName="identifier"
                inputLabel={getString('pipelineSteps.stepNameLabel')}
              />
              <FormMultiTypeTextAreaField
                className={css.removeBpLabelMargin}
                name="description"
                label={<Text margin={{ bottom: 'xsmall' }}>{getString('description')}</Text>}
              />
              <FormMultiTypeConnectorField
                label={
                  <Text style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('pipelineSteps.connectorLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.connectorInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                type={['Gcp', 'Aws', 'DockerRegistry']}
                width={getMultiTypeFromValue(formValues.spec.connectorRef) === MultiTypeInputType.RUNTIME ? 515 : 560}
                name="spec.connectorRef"
                placeholder={loading ? getString('loading') : getString('select')}
                disabled={loading}
                accountIdentifier={accountId}
                projectIdentifier={projectIdentifier}
                orgIdentifier={orgIdentifier}
                style={{ marginBottom: 0 }}
              />
              <MultiTypeTextField
                name="spec.image"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('imageLabel')}
                    <Button icon="question" minimal tooltip={getString('pluginImageInfo')} iconProps={{ size: 14 }} />
                  </Text>
                }
                multiTextInputProps={{
                  placeholder: getString('pluginImagePlaceholder')
                }}
                style={{ marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeMap
                name="spec.settings"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.settingsLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.settingsInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getString('pipelineSteps.optionalConfiguration')}
              </Text>
              <StepCommonFields />
            </div>
            <div className={css.buttonsWrapper}>
              <Button
                intent="primary"
                type="submit"
                text={getString('save')}
                margin={{ right: 'xxlarge' }}
                data-testid={'submit'}
              />
              <Button text={getString('cancel')} minimal onClick={handleCancelClick} />
            </div>
          </FormikForm>
        )}
      </Formik>
    </>
  )
}

export class PluginStep extends PipelineStep<PluginStepData> {
  renderStep(
    initialValues: PluginStepData,
    onUpdate?: (data: PluginStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <PluginStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.Plugin
  protected stepName = 'Configure Plugin Step'
  protected stepIcon: IconName = 'plugin-step'

  protected defaultValues: PluginStepData = {
    identifier: '',
    type: StepType.Plugin as string,
    spec: {
      connectorRef: '',
      image: '',
      settings: {}
    }
  }
}
