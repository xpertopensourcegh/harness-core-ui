import React from 'react'
import { Formik, FormikForm } from '@wings-software/uikit'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import { accountId } from 'modules/cv/constants'
import css from './KubernetesActivitySourceForm.module.scss'

export default function KubernetesActivitySourceForm(): JSX.Element {
  return (
    <Formik onSubmit={() => undefined} initialValues={{}}>
      {formikProps => (
        <FormikForm className={css.main}>
          {/* Temporary accountid - replace with real one */}
          <KubCluster
            formikProps={formikProps}
            enableCreate={true}
            connector={{} as FormData}
            accountId={accountId}
            orgIdentifier={''}
            projectIdentifier={''}
          />
        </FormikForm>
      )}
    </Formik>
  )
}
