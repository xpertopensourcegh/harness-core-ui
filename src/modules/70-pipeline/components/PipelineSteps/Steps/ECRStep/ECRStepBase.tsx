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
import { isEmpty } from 'lodash-es'
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
import { getInitialValuesInCorrectFormat, getFormValuesInCorrectFormat } from '../StepsTransformValuesUtils'
import { validate } from '../StepsValidateUtils'
import { transformValuesFieldsConfig, editViewValidateFieldsConfig } from './ECRStepFunctionConfigs'
import type { ECRStepProps, ECRStepData, ECRStepDataUI } from './ECRStep'
import css from '../Steps.module.scss'

export const ECRStepBase = (
  { initialValues, onUpdate }: ECRStepProps,
  formikRef: StepFormikFowardRef<ECRStepData>
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
  // const values = getInitialValuesInCorrectFormat<ECRStepData, ECRStepDataUI>(initialValues, transformValuesFieldsConfig, {
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
        {getString('pipelineSteps.ecr.title')}
      </Text>
      <Formik
        initialValues={getInitialValuesInCorrectFormat<ECRStepData, ECRStepDataUI>(
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
        onSubmit={(_values: ECRStepDataUI) => {
          const schemaValues = getFormValuesInCorrectFormat<ECRStepDataUI, ECRStepData>(
            _values,
            transformValuesFieldsConfig
          )
          onUpdate?.(schemaValues)
        }}
      >
        {(formik: FormikProps<ECRStepData>) => {
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
                      {getString('pipelineSteps.awsConnectorLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.ecrConnectorInfo')}
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
                  style={{ marginBottom: 0 }}
                />
                <MultiTypeTextField
                  name="spec.region"
                  label={
                    <Text margin={{ top: 'small' }}>
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
                />
                <MultiTypeTextField
                  name="spec.account"
                  label={
                    <Text margin={{ top: 'small' }}>
                      {getString('pipelineSteps.accountLabel')}
                      <Button
                        icon="question"
                        minimal
                        tooltip={getString('pipelineSteps.accountInfo')}
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

export const ECRStepBaseWithRef = React.forwardRef(ECRStepBase)
