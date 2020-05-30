import React, { FormEvent, useCallback, useContext, useState } from 'react'
import { Layout, Heading, TextInput, Button, Text, SelectWithSubviewContext } from '@wings-software/uikit'
import { Formik, Form, FormikErrors } from 'formik'
import { RadioGroup, Radio } from '@blueprintjs/core'

interface EnvironmentTypeSubFormProps {
  onSubmit: (data: EnvironmentTypeFormData) => void
  onHide?: () => void
}
type EnvironmentTypeFormData = {
  environment: string
  envType: string
}

const EnvTypes = {
  PROD: 'liveMonitoring',
  NON_PROD: 'preProd'
}

const initialValues: EnvironmentTypeFormData = {
  environment: '',
  envType: EnvTypes.PROD
}

function validateForm(values: EnvironmentTypeFormData): FormikErrors<EnvironmentTypeFormData> {
  const errors: { environment?: string } = {}
  if (!values.environment) {
    errors.environment = 'Environment is required.'
  }

  return errors
}

export function EnvironmentTypeSubForm(props: EnvironmentTypeSubFormProps): JSX.Element {
  const { toggleSubview } = useContext(SelectWithSubviewContext)
  const [error, setError] = useState('')
  const { onSubmit, onHide } = props
  const onSubmitCallBack = useCallback(
    () => (values: EnvironmentTypeFormData) => {
      const errorMsg = toggleSubview({ label: values.environment, value: JSON.stringify(values) })
      if (errorMsg) {
        setError(errorMsg)
      } else {
        onSubmit(values)
      }
    },
    [toggleSubview, onSubmit]
  )
  const onHideCallBack = useCallback(
    () => () => {
      toggleSubview()
      if (onHide) {
        onHide()
      }
    },
    [toggleSubview, onHide]
  )
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmitCallBack()}
      validate={validateForm}
      validateOnChange={false}
      validateOnBlur={false}
    >
      {formikProps => {
        const { setFieldValue, errors, values } = formikProps
        return (
          <Form style={{ padding: '10px' }}>
            <TextInput
              placeholder="Enter Environment Name"
              name="environment"
              style={{ marginBottom: '10px' }}
              onChange={(e: FormEvent<HTMLInputElement>) => setFieldValue('environment', e.currentTarget.value)}
            />
            {errors && errors.environment && (
              <Text margin={{ bottom: 'small' }} intent="danger">
                {errors.environment}
              </Text>
            )}
            <Heading level={3} margin={{ bottom: 'small' }} style={{ color: 'var(--black)' }}>
              Select Environment Type
            </Heading>
            <RadioGroup
              name="envType"
              selectedValue={values.envType}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setFieldValue('envType', e.currentTarget.value)
              }}
            >
              <Radio label="Live Monitoring (Production Types)" value={EnvTypes.PROD} />
              <Radio label="Pre-Production" value={EnvTypes.NON_PROD} />
            </RadioGroup>
            <Layout.Horizontal spacing="medium" style={{ justifyContent: 'flex-end' }}>
              <Button data-name="Cancel" onClick={onHideCallBack()}>
                Cancel
              </Button>
              <Button type="submit" intent="primary">
                Submit
              </Button>
            </Layout.Horizontal>
            {error && <Text intent="danger">{error}</Text>}
          </Form>
        )
      }}
    </Formik>
  )
}
