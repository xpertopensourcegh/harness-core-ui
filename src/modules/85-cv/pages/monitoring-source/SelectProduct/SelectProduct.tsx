import React, { useState } from 'react'
import { Layout, Text, Container, FormikForm, Formik } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams, useHistory } from 'react-router-dom'
import { StringUtils } from '@common/exports'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import {
  SelectOrCreateConnector,
  SelectOrCreateConnectorProps
} from '@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { CVSelectionCard } from '@cv/components/CVSelectionCard/CVSelectionCard'
import i18n from './SelectProduct.i18n'

interface SelectProductProps {
  type: string
  stepData?: { [key: string]: string }
  onCompleteStep: (data: { [key: string]: string }) => void
}
interface ProductOption {
  value: string
  label: string
}

interface MonitoringSourceInfo extends SelectOrCreateConnectorProps {
  selectProduct: string
  products: ProductOption[]
}

const getInfoSchemaByType = (type: string): MonitoringSourceInfo => {
  switch (type) {
    case 'AppDynamics':
      return {
        iconName: 'service-appdynamics',
        iconLabel: 'AppDynamics',
        connectToMonitoringSourceText: i18n.AppD.connectToMonitoringSource,
        firstTimeSetupText: i18n.AppD.firstTimeText,
        connectorType: 'AppDynamics',
        createConnectorText: i18n.AppD.createConnector,
        selectProduct: i18n.AppD.selectProduct,

        products: [
          { value: 'Application_Monitoring', label: i18n.AppD.product.applicationMonitoring },
          { value: 'Business_Performance_Monitoring', label: i18n.AppD.product.businessMonitoring },
          { value: 'Machine_Monitoring', label: i18n.AppD.product.machineMonitoring },
          { value: 'End_User_Moniorting', label: i18n.AppD.product.endUserMonitoring }
        ]
      }
    default:
      return {} as MonitoringSourceInfo
  }
}

const SelectProduct: React.FC<SelectProductProps> = props => {
  const history = useHistory()
  const { projectIdentifier, orgIdentifier } = useParams()
  const [selectedProduct, setSelectedProduct] = useState<string>()
  const monitoringSource = getInfoSchemaByType(props.type)

  return (
    <Container>
      <Formik
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: [],
          ...props.stepData
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(i18n.validation.name),
          identifier: Yup.string().when('name', {
            is: val => val?.length,
            then: Yup.string()
              .trim()
              .required(i18n.validation.identifier)
              .matches(/^(?![0-9])[0-9a-zA-Z_$]*$/, i18n.validation.validIdRegex)
              .notOneOf(StringUtils.illegalIdentifiers)
          })
        })}
        onSubmit={formData => {
          const stepData = { ...formData, product: selectedProduct }
          // Temp. replace in second pr for integration
          props.onCompleteStep(stepData as {})
        }}
      >
        {() => (
          <FormikForm>
            <Layout.Vertical width="40%" style={{ margin: 'auto' }}>
              <SelectOrCreateConnector
                iconName={monitoringSource.iconName}
                iconLabel={monitoringSource.iconLabel}
                connectorType={monitoringSource.connectorType}
                createConnectorText={monitoringSource.createConnectorText}
                firstTimeSetupText={monitoringSource.firstTimeSetupText}
                connectToMonitoringSourceText={monitoringSource.connectToMonitoringSourceText}
              />
              <Layout.Vertical spacing="large">
                <Text>{monitoringSource?.selectProduct}</Text>
                <Layout.Horizontal spacing="medium">
                  {monitoringSource?.products?.map((item, index) => {
                    return (
                      <CVSelectionCard
                        isSelected={selectedProduct === item.value}
                        key={`${index}${item}`}
                        isLarge
                        cardLabel={item.label}
                        iconProps={{
                          name: monitoringSource.iconName,
                          size: 30
                        }}
                        onCardSelect={isSelected => setSelectedProduct(isSelected ? item.value : undefined)}
                      />
                    )
                  })}
                </Layout.Horizontal>
              </Layout.Vertical>
            </Layout.Vertical>
            <SubmitAndPreviousButtons
              onPreviousClick={() =>
                history.push(
                  routeCVAdminSetup.url({
                    projectIdentifier,
                    orgIdentifier
                  })
                )
              }
            />
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default SelectProduct
