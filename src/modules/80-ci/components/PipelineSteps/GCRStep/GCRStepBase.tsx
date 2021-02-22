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
import { MultiTypeTextField } from '@common/components/MultiTypeText/MultiTypeText'
import MultiTypeMap from '@common/components/MultiTypeMap/MultiTypeMap'
import MultiTypeList from '@common/components/MultiTypeList/MultiTypeList'
import { DrawerTypes } from '@pipeline/components/PipelineStudio/PipelineContext/PipelineActions'
import StepCommonFields /*,{ /*usePullOptions }*/ from '@pipeline/components/StepCommonFields/StepCommonFields'
import {
  getInitialValuesInCorrectFormat,
  getFormValuesInCorrectFormat
} from '@pipeline/components/PipelineSteps/Steps/StepsTransformValuesUtils'
import { validate } from '@pipeline/components/PipelineSteps/Steps/StepsValidateUtils'
import { transformValuesFieldsConfig, editViewValidateFieldsConfig } from './GCRStepFunctionConfigs'
import type { GCRStepProps, GCRStepData, GCRStepDataUI } from './GCRStep'
import css from '@pipeline/components/PipelineSteps/Steps/Steps.module.scss'

export const GCRStepBase = (
  { initialValues, onUpdate }: GCRStepProps,
  formikRef: StepFormikFowardRef<GCRStepData>
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
  // const values = getInitialValuesInCorrectFormat<GCRStepData, GCRStepDataUI>(initialValues, transformValuesFieldsConfig, {
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
        {getString('pipelineSteps.gcr.title')}
      </Text>
      <Formik
        initialValues={getInitialValuesInCorrectFormat<GCRStepData, GCRStepDataUI>(
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
        onSubmit={(_values: GCRStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<GCRStepDataUI, GCRStepData>(
            _values,
            transformValuesFieldsConfig
          )
          onUpdate?.(schemaValues)
        }}
      >
        {(formik: FormikProps<GCRStepData>) => {
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
                <FormMultiTypeConnectorField
                  label={
                    <Text style={{ display: 'flex', alignItems: 'center' }}>
                      {getString('pipelineSteps.gcpConnectorLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.gcrConnectorInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  }
                  type={'Gcp'}
                  width={
                    getMultiTypeFromValue(formik.values.spec.connectorRef) === MultiTypeInputType.RUNTIME ? 515 : 560
                  }
                  name="spec.connectorRef"
                  placeholder={getString('select')}
                  accountIdentifier={accountId}
                  projectIdentifier={projectIdentifier}
                  orgIdentifier={orgIdentifier}
                  style={{ marginBottom: 0 }}
                />
                <MultiTypeTextField
                  name="spec.host"
                  label={
                    <Text margin={{ top: 'small' }}>
                      {getString('pipelineSteps.hostLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.hostInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  }
                  multiTextInputProps={{
                    placeholder: getString('pipelineSteps.hostPlaceholder')
                  }}
                />
                <MultiTypeTextField
                  name="spec.projectID"
                  label={
                    <Text margin={{ top: 'small' }}>
                      {getString('pipelineSteps.projectIDLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.projectIDInfo')}
                        iconProps={{ size: 14 }}
                      />
                    </Text>
                  }
                />
                <MultiTypeTextField
                  name="spec.imageName"
                  label={
                    <Text margin={{ top: 'small' }}>
                      {getString('imageNameLabel')}
                      <Button icon="question" minimal tooltip={getString('imageNameInfo')} iconProps={{ size: 14 }} />
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
          )
        }}
      </Formik>
    </>
  )
}

export const GCRStepBaseWithRef = React.forwardRef(GCRStepBase)
