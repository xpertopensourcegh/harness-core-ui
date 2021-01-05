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
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { useConnectorRef } from '../StepsUseConnectorRef'
import { StepType } from '../../PipelineStepInterface'
import { PipelineStep } from '../../PipelineStep'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat,
  Types as TransformValuesTypes
} from '../StepsTransformValuesUtils'
import { useValidate, Types as ValidationFieldTypes } from '../StepsValidateUtils'
import type { MultiTypeConnectorRef, MultiTypeListType, Resources, MultiTypeListUIType } from '../StepsTypes'
import css from '../Steps.module.scss'

export interface JFrogArtifactoryStepSpec {
  connectorRef: string
  target: string
  sourcePaths: MultiTypeListType
  pomFile?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface JFrogArtifactoryStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: JFrogArtifactoryStepSpec
}

export interface JFrogArtifactoryStepSpecUI
  extends Omit<JFrogArtifactoryStepSpec, 'connectorRef' | 'sourcePaths' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  sourcePaths: MultiTypeListUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface JFrogArtifactoryStepDataUI extends Omit<JFrogArtifactoryStepData, 'spec'> {
  spec: JFrogArtifactoryStepSpecUI
}

export interface JFrogArtifactoryStepWidgetProps {
  initialValues: JFrogArtifactoryStepData
  onUpdate?: (data: JFrogArtifactoryStepData) => void
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
    name: 'spec.connectorRef',
    type: TransformValuesTypes.ConnectorRef
  },
  {
    name: 'spec.target',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.sourcePaths',
    type: TransformValuesTypes.List
  },
  {
    name: 'spec.pomFile',
    type: TransformValuesTypes.Text
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
    name: 'spec.target',
    type: ValidationFieldTypes.Target,
    required: true
  },
  {
    name: 'spec.sourcePaths',
    type: ValidationFieldTypes.SourcePaths,
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

export const JFrogArtifactoryStepWidget: React.FC<JFrogArtifactoryStepWidgetProps> = ({
  initialValues,
  onUpdate
}): JSX.Element => {
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
  // const values = getInitialValuesInCorrectFormat<JFrogArtifactoryStepData, JFrogArtifactoryStepDataUI>(initialValues, transformValuesFields, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<JFrogArtifactoryStepData, JFrogArtifactoryStepDataUI>(
    initialValues,
    transformValuesFields
  )

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<JFrogArtifactoryStepDataUI>(validateFields, {
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
        {getString('pipelineSteps.jFrogArtifactory.title')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validate={validate}
        onSubmit={(_values: JFrogArtifactoryStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<JFrogArtifactoryStepDataUI, JFrogArtifactoryStepData>(
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
              <FormMultiTypeConnectorField
                label={<Text margin={{ bottom: 'xsmall' }}>{getString('pipelineSteps.connectorLabel')}</Text>}
                type={'Artifactory'}
                width={getMultiTypeFromValue(formValues.spec.connectorRef) === MultiTypeInputType.RUNTIME ? 515 : 560}
                name="spec.connectorRef"
                placeholder={loading ? getString('loading') : getString('select')}
                disabled={loading}
                accountIdentifier={accountId}
                projectIdentifier={projectIdentifier}
                orgIdentifier={orgIdentifier}
                style={{ marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeTextField
                name="spec.target"
                label={
                  <Text>
                    {getString('pipelineSteps.targetLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.jFrogArtifactoryTargetInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                style={{ marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeList
                name="spec.sourcePaths"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.sourcePathsLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.sourcePathsInfo')}
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
              <MultiTypeTextField
                name="spec.pomFile"
                label={
                  <Text>
                    {getString('pipelineSteps.pomFileLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.pomFileInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                style={{ marginBottom: 'var(--spacing-small)' }}
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

export class JFrogArtifactoryStep extends PipelineStep<JFrogArtifactoryStepData> {
  renderStep(
    initialValues: JFrogArtifactoryStepData,
    onUpdate?: (data: JFrogArtifactoryStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <JFrogArtifactoryStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.JFrogArtifactory
  protected stepName = 'Upload Artifacts to JFrog Artifactory'
  protected stepIcon: IconName = 'service-artifactory'

  protected defaultValues: JFrogArtifactoryStepData = {
    identifier: '',
    type: StepType.JFrogArtifactory as string,
    spec: {
      connectorRef: '',
      target: '',
      sourcePaths: []
    }
  }
}
