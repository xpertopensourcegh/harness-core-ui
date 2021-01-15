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
import type { FormikProps } from 'formik'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import { useConnectorRef } from '@connectors/common/StepsUseConnectorRef'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat,
  Types as TransformValuesTypes
} from '../StepsTransformValuesUtils'
import { useValidate, Types as ValidationFieldTypes } from '../StepsValidateUtils'
import type { RunStepProps, RunStepData, RunStepDataUI } from './RunStep'
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

export const RunStepBase = (
  { initialValues, onUpdate }: RunStepProps,
  formikRef: StepFormikFowardRef<RunStepData>
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
      {loading ? (
        getString('loading')
      ) : (
        <Formik
          initialValues={values}
          validate={validate}
          onSubmit={(_values: RunStepDataUI) => {
            const schemaValues = getFormValuesInCorrectFormat<RunStepDataUI, RunStepData>(
              _values,
              transformValuesFields
            )
            onUpdate?.(schemaValues)
          }}
        >
          {(formik: FormikProps<RunStepData>) => {
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
                    width={
                      getMultiTypeFromValue(formik.values.spec.connectorRef) === MultiTypeInputType.RUNTIME ? 515 : 560
                    }
                    name="spec.connectorRef"
                    placeholder={getString('select')}
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
                  <Text
                    className={css.optionalConfiguration}
                    font={{ weight: 'semi-bold' }}
                    margin={{ bottom: 'small' }}
                  >
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
                    style={{ marginBottom: 'var(--spacing-small)' }}
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
                    style={{ marginBottom: 'var(--spacing-small)' }}
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
            )
          }}
        </Formik>
      )}
    </>
  )
}

export const RunStepBaseWithRef = React.forwardRef(RunStepBase)
