import React from 'react'
import * as Yup from 'yup'
import { Button, Container, Formik, FormikForm, FormInput, Layout, StepProps, Text } from '@wings-software/uikit'

import type { SecretManagerWizardData } from '../CreateSecretManager'

import i18n from '../CreateSecretManager.i18n'

export interface SecretEngineData {
  secretEngineName: string
  secretEngineVersion: string
  renewIntervalHours: number
}

const StepSecretEngine: React.FC<StepProps<SecretManagerWizardData> & { loading: boolean }> = ({
  nextStep,
  prevStepData,
  previousStep,
  loading
}) => {
  return (
    <Container padding={{ top: 'xxxlarge' }} width="64%">
      <Text font={{ size: 'medium' }} padding={{ bottom: 'xlarge' }}>
        {i18n.titleSecretEngine}
      </Text>
      <Formik<SecretEngineData>
        initialValues={{
          secretEngineName: '',
          secretEngineVersion: '',
          renewIntervalHours: 1,
          ...prevStepData?.secretEngineData
        }}
        validationSchema={Yup.object().shape({
          secretEngineName: Yup.string().required(i18n.validationEngine),
          secretEngineVersion: Yup.number().positive(i18n.validationVersionNumber).required(i18n.validationVersion),
          renewIntervalHours: Yup.number().positive(i18n.validationRenewalNumber).required(i18n.validationRenewal)
        })}
        onSubmit={data => {
          nextStep?.({ ...prevStepData, secretEngineData: data })
        }}
      >
        {() => (
          <FormikForm>
            <FormInput.Text name="secretEngineName" label={i18n.labelSecretEngineName} />
            <FormInput.Text name="secretEngineVersion" label={i18n.labelSecretEngineVersion} />
            <FormInput.Text name="renewIntervalHours" label={i18n.labelRenewal} />
            <Layout.Horizontal spacing="medium">
              <Button
                text={i18n.buttonBack}
                onClick={() => {
                  previousStep?.(prevStepData)
                }}
              />
              <Button
                type="submit"
                intent="primary"
                text={loading ? i18n.buttonSaving : i18n.buttonSubmit}
                disabled={loading}
              />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default StepSecretEngine
