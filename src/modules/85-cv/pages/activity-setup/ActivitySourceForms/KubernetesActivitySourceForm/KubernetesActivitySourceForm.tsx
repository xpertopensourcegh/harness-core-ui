import React from 'react'
import { Formik, FormikForm } from '@wings-software/uikit'
import css from './KubernetesActivitySourceForm.module.scss'

export default function KubernetesActivitySourceForm(): JSX.Element {
  return (
    <Formik onSubmit={() => undefined} initialValues={{}}>
      {() => (
        <FormikForm className={css.main}>
          {/* Temporary accountid - replace with real one */}
          {/* Inline forms are now replaced with createWizards  */}
          {/* <KubCluster
            enableCreate={true}
            connector={{} as ConnectorInfoDTO}
            onSubmit={() => undefined}
            setConnector={() => undefined}
            setConnectorForYaml={() => undefined}
          /> */}
        </FormikForm>
      )}
    </Formik>
  )
}
