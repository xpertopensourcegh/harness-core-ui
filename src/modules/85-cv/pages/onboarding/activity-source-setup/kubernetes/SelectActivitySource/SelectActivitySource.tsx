import React from 'react'
import { Formik, FormikForm, Container, Text } from '@wings-software/uikit'
import { object as yupObject, string as yupString } from 'yup'
import {
  ConnectorSelection,
  SelectOrCreateConnectorFieldNames
} from '@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import i18n from './SelectActivitySource.i18n'
import css from './SelectActivitySource.module.scss'

interface SelectActivitySource {
  onSubmit: (data: any) => void
}

const ValidationSchema = yupObject().shape({
  [SelectOrCreateConnectorFieldNames.CONNECTOR_REF]: yupString().trim().required('Connector Reference is required.')
})

export function SelectActivitySource(props: SelectActivitySource): JSX.Element {
  return (
    <Container className={css.main}>
      <Formik initialValues={{}} validationSchema={ValidationSchema} onSubmit={values => props.onSubmit(values)}>
        <FormikForm id="onBoardingForm">
          <Text font={{ size: 'medium' }} margin={{ top: 'large', bottom: 'large' }}>
            {i18n.selectConnectorHeading}
          </Text>
          <CVSelectionCard
            isSelected={true}
            className={css.monitoringCard}
            iconProps={{
              name: 'service-kubernetes',
              size: 40
            }}
            cardLabel={i18n.iconLabel}
            renderLabelOutsideCard={true}
          />
          <ConnectorSelection
            connectorType="K8sCluster"
            createConnectorText={i18n.createConnectorText}
            firstTimeSetupText={i18n.firstTimeSetupText}
            connectToMonitoringSourceText={i18n.kubernetesConnectionText}
          />
        </FormikForm>
      </Formik>
    </Container>
  )
}
