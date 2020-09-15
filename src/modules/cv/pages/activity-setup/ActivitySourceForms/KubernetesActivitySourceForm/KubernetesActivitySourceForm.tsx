import React from 'react'
import { Formik, FormikForm } from '@wings-software/uikit'
import KubCluster from 'modules/dx/pages/connectors/Forms/KubCluster'
import type { ConnectorDTO } from 'services/cd-ng'
import css from './KubernetesActivitySourceForm.module.scss'

export default function KubernetesActivitySourceForm(): JSX.Element {
  return (
    <Formik onSubmit={() => undefined} initialValues={{}}>
      {() => (
        <FormikForm className={css.main}>
          {/* Temporary accountid - replace with real one */}
          <KubCluster
            enableCreate={true}
            connector={{} as ConnectorDTO}
            onSubmit={() => undefined}
            setConnector={() => undefined}
          />
        </FormikForm>
      )}
    </Formik>
  )
}
