import React, { useContext } from 'react'
import { Formik } from 'formik'
import { FormInput, FormikForm, SelectWithSubviewContext, Layout, Button } from '@wings-software/uikit'
import { Toaster, Intent } from '@blueprintjs/core'
import * as Yup from 'yup'
import { SettingsService } from 'modules/cv/services'
import { routeParams } from 'framework/exports'

const toaster = Toaster.create()

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required('Required')
})

export default function CreateNewEntitySubform({ entityType }: { entityType: 'service' | 'environment' }) {
  const {
    params: { accountId }
  } = routeParams()
  const { toggleSubview } = useContext(SelectWithSubviewContext)
  const onHide = () => {
    toggleSubview()
  }
  const onSubmit = async ({ name }: { name: string }) => {
    let response
    if (entityType === 'service') {
      response = await SettingsService.createService(name, accountId, 'org', 'project')
    } else {
      response = await SettingsService.createEnvironment(name, accountId, 'org', 'project')
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

  return (
    <Formik initialValues={{ name: '' }} validationSchema={validationSchema} onSubmit={onSubmit}>
      {() => (
        <FormikForm style={{ padding: 'var(--spacing-small' }}>
          <FormInput.Text name="name" label={entityType === 'service' ? 'Service Name' : 'Environment Name'} />
          <Layout.Horizontal spacing="medium">
            <Button data-name="Cancel" onClick={onHide}>
              Cancel
            </Button>
            <Button type="submit" intent="primary">
              Submit
            </Button>
          </Layout.Horizontal>
        </FormikForm>
      )}
    </Formik>
  )
}
