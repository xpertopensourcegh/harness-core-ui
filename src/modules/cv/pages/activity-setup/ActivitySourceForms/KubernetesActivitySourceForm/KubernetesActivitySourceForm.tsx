import React from 'react'
import { Formik, FormikForm } from '@wings-software/uikit'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import css from './KubernetesActivitySourceForm.module.scss'

export default function KubernetesActivitySourceForm(): JSX.Element {
  return (
    <Formik onSubmit={() => undefined} initialValues={{}}>
      {formikProps => (
        <FormikForm className={css.main}>
          <KubCluster formikProps={formikProps} enableCreate={true} connector="12313" />
        </FormikForm>
      )}
    </Formik>
  )
}
