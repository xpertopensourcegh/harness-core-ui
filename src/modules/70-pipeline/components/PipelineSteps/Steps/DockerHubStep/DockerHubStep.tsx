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
  MultiTypeListUIType,
  MultiTypeConnectorRef,
  Resources
} from '../StepsTypes'
import css from '../Steps.module.scss'

export interface DockerHubStepSpec {
  connectorRef: string
  repo: string
  tags: MultiTypeListType
  dockerfile?: string
  context?: string
  labels?: MultiTypeMapType
  buildArgs?: MultiTypeMapType
  target?: string
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypePullOption
  resources?: Resources
}

export interface DockerHubStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: DockerHubStepSpec
}

export interface DockerHubStepSpecUI
  extends Omit<DockerHubStepSpec, 'connectorRef' | 'tags' | 'labels' | 'buildArgs' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  tags: MultiTypeListUIType
  labels?: MultiTypeMapUIType
  buildArgs?: MultiTypeMapUIType
  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // pull?: MultiTypeSelectOption
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface DockerHubStepDataUI extends Omit<DockerHubStepData, 'spec'> {
  spec: DockerHubStepSpecUI
}

export interface DockerHubStepWidgetProps {
  initialValues: DockerHubStepData
  onUpdate?: (data: DockerHubStepData) => void
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
    name: 'spec.repo',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.tags',
    type: TransformValuesTypes.List
  },
  {
    name: 'spec.dockerfile',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.context',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.labels',
    type: TransformValuesTypes.Map
  },
  {
    name: 'spec.buildArgs',
    type: TransformValuesTypes.Map
  },
  {
    name: 'spec.target',
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
    type: ValidationFieldTypes.DockerHubConnectorRef,
    required: true
  },
  {
    name: 'spec.repo',
    type: ValidationFieldTypes.Repo,
    required: true
  },
  {
    name: 'spec.tags',
    type: ValidationFieldTypes.Tags,
    required: true
  },
  {
    name: 'spec.labels',
    type: ValidationFieldTypes.Labels
  },
  {
    name: 'spec.buildArgs',
    type: ValidationFieldTypes.BuildArgs
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

export const DockerHubStepWidget: React.FC<DockerHubStepWidgetProps> = ({ initialValues, onUpdate }): JSX.Element => {
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
  // const values = getInitialValuesInCorrectFormat<DockerHubStepData, DockerHubStepDataUI>(initialValues, transformValuesFields, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<DockerHubStepData, DockerHubStepDataUI>(
    initialValues,
    transformValuesFields
  )

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<DockerHubStepDataUI>(validateFields, {
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
        {getString('pipelineSteps.dockerHub.title')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validate={validate}
        onSubmit={(_values: DockerHubStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<DockerHubStepDataUI, DockerHubStepData>(
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
                label={
                  <Text style={{ display: 'flex', alignItems: 'center' }}>
                    {getString('pipelineSteps.dockerHubConnectorLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.dockerHubConnectorInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                type={'DockerRegistry'}
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
                name="spec.repo"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('repository')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.repoInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
              />
              <MultiTypeList
                name="spec.tags"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('tagsLabel')}
                      <Button icon="question" minimal tooltip={getString('tagsInfo')} iconProps={{ size: 14 }} />
                    </Text>
                  )
                }}
                style={{ marginTop: 'var(--spacing-xsmall)' }}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getString('pipelineSteps.optionalConfiguration')}
              </Text>
              <MultiTypeTextField
                name="spec.dockerfile"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('pipelineSteps.dockerfileLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.dockerfileInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
              />
              <MultiTypeTextField
                name="spec.context"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('pipelineSteps.contextLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.contextInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
              />
              <MultiTypeMap
                name="spec.labels"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.labelsLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.labelsInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
                style={{ marginTop: 'var(--spacing-xsmall)', marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeMap
                name="spec.buildArgs"
                multiTypeFieldSelectorProps={{
                  label: (
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.buildArgsLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.buildArgsInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  )
                }}
              />
              <MultiTypeTextField
                name="spec.target"
                label={
                  <Text margin={{ top: 'small' }}>
                    {getString('pipelineSteps.targetLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.targetInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
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

export class DockerHubStep extends PipelineStep<DockerHubStepData> {
  renderStep(
    initialValues: DockerHubStepData,
    onUpdate?: (data: DockerHubStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <DockerHubStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.DockerHub
  protected stepName = 'Build and Push to DockerHub'
  protected stepIcon: IconName = 'docker-hub-step'

  protected defaultValues: DockerHubStepData = {
    identifier: '',
    type: StepType.DockerHub as string,
    spec: {
      connectorRef: '',
      repo: '',
      tags: []
    }
  }
}
