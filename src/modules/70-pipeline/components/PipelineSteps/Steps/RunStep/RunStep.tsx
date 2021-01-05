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
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { PipelineContext, StepViewType, getStageFromPipeline } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat,
  Types as TransformValuesTypes
} from '../StepsTransformValuesUtils'
import { useValidate, Types as ValidationFieldTypes } from '../StepsValidateUtils'
import type {
  MultiTypeMapType,
  MultiTypeMapUIType,
  MultiTypeListType,
  MultiTypeListUIType,
  MultiTypeConnectorRef,
  Resources
} from '../StepsTypes'
import { useConnectorRef } from '../StepsUseConnectorRef'
import css from '../Steps.module.scss'

export interface RunStepSpec {
  connectorRef: string
  image: string
  command: string
  paths?: MultiTypeListType
  envVariables?: MultiTypeMapType
  outputVariables?: MultiTypeListType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface RunStepData {
  identifier: string
  name?: string
  description?: string
  type: string
  timeout?: string
  spec: RunStepSpec
}

export interface RunStepSpecUI
  extends Omit<RunStepSpec, 'connectorRef' | 'paths' | 'envVariables' | 'outputVariables' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  paths?: MultiTypeListUIType
  envVariables?: MultiTypeMapUIType
  outputVariables?: MultiTypeListUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface RunStepDataUI extends Omit<RunStepData, 'spec'> {
  spec: RunStepSpecUI
}

export interface RunStepWidgetProps {
  initialValues: RunStepData
  onUpdate?: (data: RunStepData) => void
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
    name: 'spec.command',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.reportPaths',
    type: TransformValuesTypes.ReportPaths
  },
  {
    name: 'spec.envVariables',
    type: TransformValuesTypes.Map
  },
  {
    name: 'spec.outputVariables',
    type: TransformValuesTypes.List
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
    name: 'spec.command',
    type: ValidationFieldTypes.Command,
    required: true
  },
  {
    name: 'spec.reportPaths',
    type: ValidationFieldTypes.ReportPaths
  },
  {
    name: 'spec.envVariables',
    type: ValidationFieldTypes.EnvVariables
  },
  {
    name: 'spec.outputVariables',
    type: ValidationFieldTypes.OutputVariables
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

export const RunStepWidget: React.FC<RunStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
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
  // const values = getInitialValuesInCorrectFormat<RunStepData, RunStepDataUI>(initialValues, transformValuesFields, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<RunStepData, RunStepDataUI>(initialValues, transformValuesFields)

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<RunStepDataUI>(validateFields, {
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
        {getString('pipelineSteps.run.title')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validate={validate}
        onSubmit={(_values: RunStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<RunStepDataUI, RunStepData>(_values, transformValuesFields)
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
                style={{ marginBottom: 0, marginTop: 'var(--spacing-small)' }}
              />
              <MultiTypeTextField
                name="spec.image"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('imageLabel')}
                    <Button icon="question" minimal tooltip={getString('imageInfo')} iconProps={{ size: 14 }} />
                  </Text>
                }
                multiTextInputProps={{
                  placeholder: getString('imagePlaceholder')
                }}
              />
              <FormMultiTypeTextAreaField
                className={css.removeBpLabelMargin}
                name="spec.command"
                label={
                  <Text margin={{ top: 'small' }} style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('commandLabel')}
                    <Button icon="question" minimal tooltip={getString('commandInfo')} iconProps={{ size: 14 }} />
                  </Text>
                }
                placeholder={getString('commandPlaceholder')}
                style={{ marginBottom: 0 }}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getString('pipelineSteps.optionalConfiguration')}
              </Text>
              <MultiTypeList
                name="spec.reportPaths"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.reportPathsLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.reportPathsInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
              />
              <MultiTypeMap
                name="spec.envVariables"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('environmentVariables')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('environmentVariablesInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
                style={{ marginTop: 'var(--spacing-small)', marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeList
                name="spec.outputVariables"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.outputVariablesLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.outputVariablesInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
              />
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

export class RunStep extends PipelineStep<RunStepData> {
  renderStep(
    initialValues: RunStepData,
    onUpdate?: (data: RunStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <RunStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.Run
  protected stepName = 'Configure Run Step'
  protected stepIcon: IconName = 'run-step'

  protected defaultValues: RunStepData = {
    identifier: '',
    type: StepType.Run as string,
    spec: {
      connectorRef: '',
      image: '',
      command: '',
      envVariables: {}
    }
  }
}
