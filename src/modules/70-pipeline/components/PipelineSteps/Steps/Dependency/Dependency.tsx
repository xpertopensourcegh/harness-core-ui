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
import { useConnectorRef } from '../StepsUseConnectorRef'
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
  MultiTypeConnectorRef,
  Resources,
  MultiTypeListUIType
} from '../StepsTypes'
import css from '../Steps.module.scss'

export interface DependencySpec {
  connectorRef: string
  image: string
  envVariables?: MultiTypeMapType
  entrypoint?: MultiTypeListType
  args?: MultiTypeListType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface DependencyData {
  identifier: string
  name?: string
  description?: string
  type: string
  spec: DependencySpec
}

export interface DependencySpecUI
  extends Omit<DependencySpec, 'connectorRef' | 'envVariables' | 'entrypoint' | 'args' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  envVariables?: MultiTypeMapUIType
  entrypoint?: MultiTypeListUIType
  args?: MultiTypeListUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface DependencyDataUI extends Omit<DependencyData, 'spec'> {
  spec: DependencySpecUI
}

export interface DependencyWidgetProps {
  initialValues: DependencyData
  onUpdate?: (data: DependencyData) => void
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
    name: 'spec.envVariables',
    type: TransformValuesTypes.Map
  },
  {
    name: 'spec.entrypoint',
    type: TransformValuesTypes.List
  },
  {
    name: 'spec.args',
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
    name: 'spec.envVariables',
    type: ValidationFieldTypes.EnvVariables
  },
  {
    name: 'spec.entrypoint',
    type: ValidationFieldTypes.Entrypoint
  },
  {
    name: 'spec.args',
    type: ValidationFieldTypes.Args
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

export const DependencyWidget: React.FC<DependencyWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
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
  // const values = getInitialValuesInCorrectFormat<DependencyData, DependencyDataUI>(initialValues, transformValuesFields, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<DependencyData, DependencyDataUI>(initialValues, transformValuesFields)

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<DependencyDataUI>(validateFields, {
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
    <Formik<DependencyDataUI>
      enableReinitialize={true}
      initialValues={values}
      validate={validate}
      onSubmit={(_values: DependencyDataUI) => {
        const schemaValues = getFormValuesInCorrectFormat<DependencyDataUI, DependencyData>(
          _values,
          transformValuesFields
        )
        onUpdate?.(schemaValues)
      }}
    >
      {({ values: formValues }) => (
        <FormikForm>
          <div style={{ padding: 'var(--spacing-large)' }}>
            <div className={css.fieldsSection}>
              <FormInput.InputWithIdentifier
                inputName="name"
                idName="identifier"
                inputLabel={getString('dependencyNameLabel')}
              />
              <FormMultiTypeTextAreaField
                className={css.removeBpLabelMargin}
                name="description"
                label={<Text margin={{ bottom: 'xsmall' }}>{getString('description')}</Text>}
                style={{ marginBottom: 'var(--spacing-xsmall)' }}
              />
              <FormMultiTypeConnectorField
                label={
                  <Text style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('pipelineSteps.connectorLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.dependencyConnectorInfo')}
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
                    <Button icon="question" minimal tooltip={getString('imageInfo')} iconProps={{ size: 14 }} />
                  </Text>
                }
                multiTextInputProps={{
                  placeholder: getString('dependencyImagePlaceholder')
                }}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getString('pipelineSteps.optionalConfiguration')}
              </Text>
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
              />
              <MultiTypeList
                name="spec.entrypoint"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('entryPointLabel')}
                      <Button icon="question" minimal tooltip={getString('entryPointInfo')} iconProps={{ size: 14 }} />
                    </Text>
                  )
                }}
                style={{ marginTop: 'var(--spacing-small)', marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeList
                name="spec.args"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('argsLabel')}
                      <Button icon="question" minimal tooltip={getString('argsInfo')} iconProps={{ size: 14 }} />
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
          </div>
        </FormikForm>
      )}
    </Formik>
  )
}

export class Dependency extends PipelineStep<DependencyData> {
  renderStep(
    initialValues: DependencyData,
    onUpdate?: (data: DependencyData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <DependencyWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.Dependency
  protected stepName = 'Configure Service Dependency'
  protected stepIcon: IconName = 'dependency-step'

  protected defaultValues: DependencyData = {
    identifier: '',
    type: StepType.Dependency as string,
    spec: {
      connectorRef: '',
      image: ''
    }
  }
}
