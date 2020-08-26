import React, { useContext } from 'react'
import { Formik } from 'formik'
import { FormInput, SelectWithSubviewContext, Layout, Button, FormikForm } from '@wings-software/uikit'
import { Toaster, Intent } from '@blueprintjs/core'
import * as Yup from 'yup'
import { SettingsService } from 'modules/cv/services'
import { routeParams } from 'framework/exports'
import i18n from './CreateNewEntitySeubform.i18n'

const toaster = Toaster.create()

const serviceSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required')
})

const envSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
  type: Yup.string().trim().required('Required')
})

export default function CreateNewEntitySubform({ entityType }: { entityType: 'service' | 'environment' }) {
  const {
    params: { accountId, projectIdentifier: routeProjectIdentifier, orgId: routeOrgIdentifier }
  } = routeParams()
  const { toggleSubview } = useContext(SelectWithSubviewContext)
  const projectIdentifier = routeProjectIdentifier as string
  const orgIdentifier = routeOrgIdentifier as string
  const onSubmit = async ({ name, ...rest }: { name: string }) => {
    let response
    if (entityType === 'service') {
      response = await SettingsService.createService(name, accountId, orgIdentifier, projectIdentifier)
    } else {
      response = await SettingsService.createEnvironment(
        name,
        accountId,
        orgIdentifier,
        projectIdentifier,
        (rest as any).type
      )
    }
    const { error, status } = response
    if (status !== 200) {
      toaster.show({ intent: Intent.DANGER, timeout: 5000, message: error + '' })
    }
    toggleSubview({
      label: name,
      value: name
    })
  }

  let formProps: any
  let formInputs: JSX.Element
  if (entityType === 'service') {
    formProps = {
      initialValues: { name: '' },
      validationSchema: serviceSchema
    }
    formInputs = <FormInput.Text name="name" label="Service Name" />
  } else if (entityType === 'environment') {
    formProps = {
      initialValues: { name: '', type: 'PreProduction' },
      validationSchema: envSchema
    }
    formInputs = (
      <>
        <FormInput.Text name="name" label="Environment" />
        <FormInput.Select
          name="type"
          label="Type"
          items={[
            { label: 'Pre Production', value: 'PreProduction' },
            { label: 'Production', value: 'Production' }
          ]}
        />
      </>
    )
  }

  return (
    <Formik {...(formProps as any)} onSubmit={onSubmit}>
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
                const error = await formikProps.validateForm()
                if (!error || !Object.keys(error).length) {
                  await onSubmit(formikProps.values as { name: string })
                }
              }}
            >
              {i18n.formButtonText.submit}
            </Button>
          </Layout.Horizontal>
        </FormikForm>
      )}
    </Formik>
  )
}
