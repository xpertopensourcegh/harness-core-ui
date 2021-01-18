import React from 'react'
import {
  Text,
  Formik,
  FormInput,
  Button,
  getMultiTypeFromValue,
  MultiTypeInputType,
  FormikForm
} from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { isPlainObject } from 'lodash-es'
import type { FormikProps } from 'formik'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { useConnectorRef } from '@connectors/common/StepsUseConnectorRef'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat,
  Types as TransformValuesTypes
} from '../StepsTransformValuesUtils'
import { useValidate, Types as ValidationFieldTypes } from '../StepsValidateUtils'
import type { SaveCacheS3StepProps, SaveCacheS3StepData, SaveCacheS3StepDataUI } from './SaveCacheS3Step'
import css from '../Steps.module.scss'

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
    name: 'spec.region',
    type: TransformValuesTypes.Text
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
    name: 'spec.endpoint',
    type: TransformValuesTypes.Text
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
    type: ValidationFieldTypes.AWSConnectorRef,
    required: true
  },
  {
    name: 'spec.region',
    type: ValidationFieldTypes.Region,
    required: true
  },
  {
    name: 'spec.bucket',
    type: ValidationFieldTypes.Bucket,
    required: true
  },
  {
    name: 'spec.key',
    type: ValidationFieldTypes.Key,
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

export const SaveCacheS3StepBase = (
  { initialValues, onUpdate }: SaveCacheS3StepProps,
  formikRef: StepFormikFowardRef<SaveCacheS3StepData>
): JSX.Element => {
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

  const values = getInitialValuesInCorrectFormat<SaveCacheS3StepData, SaveCacheS3StepDataUI>(
    initialValues,
    transformValuesFields
  )

  if (!loading) {
    values.spec.connectorRef = connector
  }

  const validate = useValidate<SaveCacheS3StepDataUI>(validateFields, {
    initialValues,
    steps: currentStage?.stage?.spec?.execution?.steps || {},
    serviceDependencies: currentStage?.stage?.spec?.serviceDependencies || {}
  })

  const handleCancelClick = (): void => {
    updatePipelineView({
      ...pipelineView,
      isDrawerOpened: false,
      drawerData: { type: DrawerTypes.StepConfig }
    })
  }

  const isConnectorLoaded =
    initialValues.spec.connectorRef &&
    getMultiTypeFromValue(initialValues.spec.connectorRef) === MultiTypeInputType.FIXED
      ? isPlainObject(values.spec.connectorRef)
      : true

  return (
    <>
      <Text className={css.boldLabel} font={{ size: 'medium' }}>
        {getString('pipelineSteps.saveCacheS3.title')}
      </Text>
      {!isConnectorLoaded ? (
        getString('loading')
      ) : (
        <Formik
          initialValues={values}
          validate={validate}
          onSubmit={(_values: SaveCacheS3StepDataUI) => {
            const schemaValues = getFormValuesInCorrectFormat<SaveCacheS3StepDataUI, SaveCacheS3StepData>(
              _values,
              transformValuesFields
            )
            onUpdate?.(schemaValues)
          }}
        >
          {(formik: FormikProps<SaveCacheS3StepData>) => {
            // This is required
            setFormikRef?.(formikRef, formik)

            return (
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
                        {getString('pipelineSteps.awsConnectorLabel')}
                        <Button
                          icon="question"
                          minimal
                          tooltip={getString('pipelineSteps.awsConnectorInfo')}
                          iconProps={{ size: 14 }}
                        />
                      </Text>
                    }
                    type={'Aws'}
                    width={
                      getMultiTypeFromValue(formik.values.spec.connectorRef) === MultiTypeInputType.RUNTIME ? 515 : 560
                    }
                    name="spec.connectorRef"
                    placeholder={getString('select')}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    style={{ marginBottom: 'var(--spacing-small)' }}
                  />
                  <MultiTypeTextField
                    name="spec.region"
                    label={
                      <Text>
                        {getString('pipelineSteps.regionLabel')}
                        <Button
                          icon="question"
                          minimal
                          tooltip={getString('pipelineSteps.regionInfo')}
                          iconProps={{ size: 14 }}
                        />
                      </Text>
                    }
                    multiTextInputProps={{
                      placeholder: getString('pipelineSteps.regionPlaceholder')
                    }}
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
                          tooltip={getString('pipelineSteps.S3BucketInfo')}
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
                          tooltip={getString('pipelineSteps.keyInfo')}
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
                            tooltip={getString('pipelineSteps.cacheSourcePathsInfo')}
                            iconProps={{ size: 14 }}
                          />
                        </Text>
                      )
                    }}
                  />
                </div>
                <div className={css.fieldsSection}>
                  <Text
                    className={css.optionalConfiguration}
                    font={{ weight: 'semi-bold' }}
                    margin={{ bottom: 'small' }}
                  >
                    {getString('pipelineSteps.optionalConfiguration')}
                  </Text>
                  <MultiTypeTextField
                    name="spec.endpoint"
                    label={
                      <Text>
                        {getString('pipelineSteps.endpointLabel')}
                        <Button
                          icon="question"
                          minimal
                          tooltip={getString('pipelineSteps.endpointInfo')}
                          iconProps={{ size: 14 }}
                        />
                      </Text>
                    }
                    multiTextInputProps={{
                      placeholder: getString('pipelineSteps.endpointPlaceholder')
                    }}
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
            )
          }}
        </Formik>
      )}
    </>
  )
}

export const SaveCacheS3StepBaseWithRef = React.forwardRef(SaveCacheS3StepBase)
