import React, { useContext, useState } from 'react'
import { Formik } from 'formik'
import { FormInput, SelectWithSubviewContext, Layout, Button, FormikForm, Text } from '@wings-software/uicore'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { useCreateService, useCreateEnvironment, EnvironmentRequestDTO, ServiceRequestDTO, Error } from 'services/cd-ng'
import i18n from './CreateNewEntitySeubform.i18n'

const serviceSchema = Yup.object().shape({
  name: Yup.string().trim().required(i18n.formValidationText.serviceName)
})

const envSchema = Yup.object().shape({
  name: Yup.string().trim().required(i18n.formValidationText.envName),
  type: Yup.string().trim().required(i18n.formValidationText.type)
})

const ENVIRONMENT_TYPE_OPTIONS = [
  { label: i18n.environmentTypeLabels.preProd, value: i18n.environmentTypeValues.predProd },
  { label: i18n.environmentTypeLabels.prod, value: i18n.environmentTypeValues.prod }
]

export default function CreateNewEntitySubform({ entityType }: { entityType: 'service' | 'environment' }): JSX.Element {
  const { accountId, projectIdentifier: routeProjectIdentifier, orgIdentifier: routeOrgIdentifier } = useParams()
  const { toggleSubview } = useContext(SelectWithSubviewContext)
  const projectIdentifier = routeProjectIdentifier as string
  const orgIdentifier = routeOrgIdentifier as string
  const [error, setError] = useState<string | undefined>()
  const { mutate: createService } = useCreateService({ queryParams: { accountId } })
  const { mutate: createEnvironment } = useCreateEnvironment({ queryParams: { accountId } })

  const onSubmit = async (values: EnvironmentRequestDTO | ServiceRequestDTO): Promise<void> => {
    let response
    try {
      if (entityType === 'service') {
        const { name = '' } = values as ServiceRequestDTO
        response = await createService({ name, identifier: name, orgIdentifier, projectIdentifier })
      } else {
        const { name = '', type = 'PreProduction' } = values as EnvironmentRequestDTO
        response = await createEnvironment({
          name,
          identifier: name,
          orgIdentifier,
          projectIdentifier,
          type
        })
      }
      if (response?.status === 'SUCCESS') {
        toggleSubview({
          label: values.name || '',
          value: values.name || ''
        })
      }
    } catch (errorResponse) {
      setError((errorResponse as Error).message)
    }
  }

  let initialValues: EnvironmentRequestDTO | ServiceRequestDTO = { name: '' } as ServiceRequestDTO
  let formInputs: JSX.Element = <FormInput.Text name="name" label={i18n.formLabelText.service} />
  let validationSchema = serviceSchema
  if (entityType === 'environment') {
    initialValues = { name: '', type: 'PreProduction' } as EnvironmentRequestDTO
    validationSchema = envSchema
    formInputs = (
      <>
        <FormInput.Text name="name" label={i18n.formLabelText.environment} />
        <FormInput.Select name="type" label={i18n.formLabelText.environmentType} items={ENVIRONMENT_TYPE_OPTIONS} />
      </>
    )
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      {formikProps => (
        <FormikForm style={{ padding: 'var(--spacing-small' }}>
          {formInputs}
          <Layout.Horizontal spacing="medium">
            <Button data-name={i18n.formButtonText.cancel} onClick={() => toggleSubview() as void}>
              {i18n.formButtonText.cancel}
            </Button>
            <Button
              type="submit"
              intent="primary"
              onClick={async e => {
                e.preventDefault()
                const validationError = await formikProps.validateForm()
                if (!validationError || !Object.keys(validationError).length) {
                  await onSubmit(formikProps.values)
                }
              }}
            >
              {i18n.formButtonText.submit}
            </Button>
          </Layout.Horizontal>
          {Boolean(error?.length) && (
            <Text intent="danger" margin={{ top: 'small' }}>
              {error}
            </Text>
          )}
        </FormikForm>
      )}
    </Formik>
  )
}
