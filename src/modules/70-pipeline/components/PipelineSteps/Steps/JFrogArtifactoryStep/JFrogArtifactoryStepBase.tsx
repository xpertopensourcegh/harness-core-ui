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
import { isPlainObject, isEmpty } from 'lodash-es'
import type { FormikProps } from 'formik'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { PipelineContext, getStageFromPipeline } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import { useConnectorRef } from '@connectors/common/StepsUseConnectorRef'
import { getInitialValuesInCorrectFormat, getFormValuesInCorrectFormat } from '../StepsTransformValuesUtils'
import { validate } from '../StepsValidateUtils'
import { transformValuesFieldsConfig, editViewValidateFieldsConfig } from './JFrogArtifactoryStepFunctionConfigs'
import type {
  JFrogArtifactoryStepProps,
  JFrogArtifactoryStepData,
  JFrogArtifactoryStepDataUI
} from './JFrogArtifactoryStep'
import css from '../Steps.module.scss'

export const JFrogArtifactoryStepBase = (
  { initialValues, onUpdate }: JFrogArtifactoryStepProps,
  formikRef: StepFormikFowardRef<JFrogArtifactoryStepData>
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
  // const values = getInitialValuesInCorrectFormat<JFrogArtifactoryStepData, JFrogArtifactoryStepDataUI>(initialValues, transformValuesFieldsConfig, {
  //   pullOptions
  // })
  const values = getInitialValuesInCorrectFormat<JFrogArtifactoryStepData, JFrogArtifactoryStepDataUI>(
    initialValues,
    transformValuesFieldsConfig
  )

  if (!loading) {
    values.spec.connectorRef = connector
  }

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
        {getString('pipelineSteps.jFrogArtifactory.title')}
      </Text>
      {!isConnectorLoaded ? (
        getString('loading')
      ) : (
        <Formik
          initialValues={values}
          validate={valuesToValidate => {
            return validate(valuesToValidate, editViewValidateFieldsConfig, {
              initialValues,
              steps: currentStage?.stage?.spec?.execution?.steps || {},
              serviceDependencies: currentStage?.stage?.spec?.serviceDependencies || {},
              getString
            })
          }}
          onSubmit={(_values: JFrogArtifactoryStepDataUI) => {
            const schemaValues = getFormValuesInCorrectFormat<JFrogArtifactoryStepDataUI, JFrogArtifactoryStepData>(
              _values,
              transformValuesFieldsConfig
            )
            onUpdate?.(schemaValues)
          }}
        >
          {(formik: FormikProps<JFrogArtifactoryStepData>) => {
            // This is required
            setFormikRef?.(formikRef, formik)

            return (
              <FormikForm>
                <div className={css.fieldsSection}>
                  <FormInput.InputWithIdentifier
                    inputName="name"
                    idName="identifier"
                    isIdentifierEditable={isEmpty(values.identifier)}
                    inputLabel={getString('pipelineSteps.stepNameLabel')}
                  />
                  <FormMultiTypeTextAreaField
                    className={css.removeBpLabelMargin}
                    name="description"
                    label={<Text margin={{ bottom: 'xsmall' }}>{getString('description')}</Text>}
                  />
                  <FormMultiTypeConnectorField
                    label={<Text margin={{ bottom: 'xsmall' }}>{getString('pipelineSteps.connectorLabel')}</Text>}
                    type={'Artifactory'}
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
                  <MultiTypeTextField
                    name="spec.sourcePath"
                    label={
                      <Text>
                        {getString('pipelineSteps.sourcePathLabel')}
                        <Button
                          icon="question"
                          minimal
                          tooltip={getString('pipelineSteps.sourcePathInfo')}
                          iconProps={{ size: 14 }}
                        />
                      </Text>
                    }
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

export const JFrogArtifactoryStepBaseWithRef = React.forwardRef(JFrogArtifactoryStepBase)
