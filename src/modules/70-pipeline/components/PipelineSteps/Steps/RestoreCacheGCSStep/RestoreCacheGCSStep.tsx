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
import StepCommonFields from '@pipeline/components/StepCommonFields/StepCommonFields'
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
import type { MultiTypeListType, MultiTypeListUIType, MultiTypeConnectorRef, Resources } from '../StepsTypes'
import css from '../Steps.module.scss'

export interface RestoreCacheGCSStepSpec {
  connectorRef: string
  bucket: string
  key: string
  sourcePaths: MultiTypeListType
  target?: string
  resources?: Resources
}

export interface RestoreCacheGCSStepData {
  identifier: string
  name?: string
  type: string
  timeout?: string
  spec: RestoreCacheGCSStepSpec
}

export interface RestoreCacheGCSStepSpecUI
  extends Omit<RestoreCacheGCSStepSpec, 'connectorRef' | 'sourcePaths' | 'pull' | 'resources'> {
  connectorRef: MultiTypeConnectorRef
  sourcePaths: MultiTypeListUIType
  limitMemory?: string
  limitCPU?: string
}

// Interface for the form
export interface RestoreCacheGCSStepDataUI extends Omit<RestoreCacheGCSStepData, 'spec'> {
  spec: RestoreCacheGCSStepSpecUI
}

export interface RestoreCacheGCSStepWidgetProps {
  initialValues: RestoreCacheGCSStepData
  onUpdate?: (data: RestoreCacheGCSStepData) => void
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
    name: 'spec.bucket',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.key',
    type: TransformValuesTypes.Text
  },
  {
    name: 'spec.sourcePaths',
    type: TransformValuesTypes.List
  },
  {
    name: 'spec.target',
    type: TransformValuesTypes.Text
  },
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
    type: ValidationFieldTypes.GCPConnectorRef,
    required: true
  },
  {
    name: 'spec.bucket',
    type: ValidationFieldTypes.Bucket,
    required: true
  },
  {
    name: 'spec.key',
    type: ValidationFieldTypes.Key
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

export const RestoreCacheGCSStepWidget: React.FC<RestoreCacheGCSStepWidgetProps> = ({
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

  const values = getInitialValuesInCorrectFormat<RestoreCacheGCSStepData, RestoreCacheGCSStepDataUI>(
    initialValues,
    transformValuesFields
  )

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<RestoreCacheGCSStepDataUI>(validateFields, {
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
        {getString('pipelineSteps.restoreCacheGCS.title')}
      </Text>
      <Formik
        enableReinitialize={true}
        initialValues={values}
        validate={validate}
        onSubmit={(_values: RestoreCacheGCSStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<RestoreCacheGCSStepDataUI, RestoreCacheGCSStepData>(
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
                    {getString('pipelineSteps.gcpConnectorLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.restoreCacheGcpConnectorInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                type={'Gcp'}
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
                name="spec.bucket"
                label={
                  <Text>
                    {getString('pipelineSteps.bucketLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.GCSBucketInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                style={{ marginBottom: 'var(--spacing-small)' }}
              />
              <MultiTypeTextField
                name="spec.key"
                label={
                  <Text>
                    {getString('keyLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.restoreCacheKeyInfo')}
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
                style={{ marginBottom: 'var(--spacing-small)' }}
              />
            </div>
            <div className={css.fieldsSection}>
              <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getString('pipelineSteps.optionalConfiguration')}
              </Text>
              <MultiTypeTextField
                name="spec.target"
                label={
                  <Text>
                    {getString('pipelineSteps.targetLabel')}
                    <Button
                      icon="question"
                      minimal
                      tooltip={getString('pipelineSteps.artifactsTargetInfo')}
                      iconProps={{ size: 14 }}
                    />
                  </Text>
                }
                multiTextInputProps={{
                  placeholder: getString('pipelineSteps.artifactsTargetPlaceholder')
                }}
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

export class RestoreCacheGCSStep extends PipelineStep<RestoreCacheGCSStepData> {
  renderStep(
    initialValues: RestoreCacheGCSStepData,
    onUpdate?: (data: RestoreCacheGCSStepData) => void,
    stepViewType?: StepViewType
  ): JSX.Element {
    return <RestoreCacheGCSStepWidget initialValues={initialValues} onUpdate={onUpdate} stepViewType={stepViewType} />
  }
  validateInputSet(): object {
    return {}
  }

  protected type = StepType.RestoreCacheGCS
  protected stepName = 'Restore Cache from GCS'
  protected stepIcon: IconName = 'restore-cache-gcs'

  protected defaultValues: RestoreCacheGCSStepData = {
    identifier: '',
    type: StepType.RestoreCacheGCS as string,
    spec: {
      connectorRef: '',
      bucket: '',
      key: '',
      sourcePaths: []
    }
  }
}
