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
import { isEmpty } from 'lodash-es'
import type { FormikProps } from 'formik'
import type { StepFormikFowardRef } from '@pipeline/components/AbstractSteps/Step'
import { setFormikRef } from '@pipeline/components/AbstractSteps/Step'
import { PipelineContext } from '@pipeline/exports'
import { useStrings } from 'framework/exports'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import { FormMultiTypeTextAreaField } from '@common/components/MultiTypeTextArea/MultiTypeTextArea'
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import { getInitialValuesInCorrectFormat, getFormValuesInCorrectFormat } from '../StepsTransformValuesUtils'
import { validate } from '../StepsValidateUtils'
import type { RunStepProps, RunStepData, RunStepDataUI } from './RunStep'
import { transformValuesFieldsConfig, editViewValidateFieldsConfig } from './RunStepFunctionConfigs'
import css from '../Steps.module.scss'

export const RunStepBase = (
  { initialValues, onUpdate }: RunStepProps,
  formikRef: StepFormikFowardRef<RunStepData>
): JSX.Element => {
  const {
    state: { pipelineView },
    updatePipelineView,
    getStageFromPipeline
  } = React.useContext(PipelineContext)

  const { getString } = useStrings()

  const { accountId, projectIdentifier, orgIdentifier } = useParams<{
    projectIdentifier: string
    orgIdentifier: string
    accountId: string
  }>()

  const { stage: currentStage } = getStageFromPipeline(pipelineView.splitViewData.selectedStageId || '')

  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // const pullOptions = usePullOptions()

  // TODO: Right now we do not support Image Pull Policy but will do in the future
  // const values = getInitialValuesInCorrectFormat<RunStepData, RunStepDataUI>(initialValues, transformValuesFieldsConfig, {
  //   pullOptions
  // })
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
        initialValues={getInitialValuesInCorrectFormat<RunStepData, RunStepDataUI>(
          initialValues,
          transformValuesFieldsConfig
        )}
        validate={valuesToValidate => {
          return validate(valuesToValidate, editViewValidateFieldsConfig, {
            initialValues,
            steps: currentStage?.stage?.spec?.execution?.steps || {},
            serviceDependencies: currentStage?.stage?.spec?.serviceDependencies || {},
            getString
          })
        }}
        onSubmit={(_values: RunStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<RunStepDataUI, RunStepData>(
            _values,
            transformValuesFieldsConfig
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
                  isIdentifierEditable={isEmpty(initialValues.identifier)}
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
                <Text className={css.optionalConfiguration} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                  {getString('pipelineSteps.optionalConfiguration')}
                </Text>
                <MultiTypeList
                  name="spec.reportPaths"
                  placeholder={getString('pipelineSteps.reportPathsPlaceholder')}
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
    </>
  )
}

export const RunStepBaseWithRef = React.forwardRef(RunStepBase)
