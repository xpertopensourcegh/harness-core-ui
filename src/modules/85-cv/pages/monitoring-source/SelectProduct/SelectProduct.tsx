import React from 'react'
import { Layout, Text, Container, FormikForm, Formik, Color } from '@wings-software/uikit'
import * as Yup from 'yup'
import { useParams, useHistory } from 'react-router-dom'
import { StringUtils } from '@common/exports'
import routes from '@common/RouteDefinitions'
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
          { value: 'Application Monitoring', label: i18n.AppD.product.applicationMonitoring },
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
  const { projectIdentifier, orgIdentifier, accountId } = useParams()
  const monitoringSource = getInfoSchemaByType(props.type)

  return (
    <Container padding="small">
      <Formik
        initialValues={{
          name: '',
          description: '',
          identifier: '',
          tags: [],
          product: '',
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
          }),
          connectorRef: Yup.object().required(),
          product: Yup.string().trim().required(i18n.validation.product)
        })}
        onSubmit={formData => props?.onCompleteStep(formData as {})}
      >
        {({ values, errors, touched, submitCount, setFieldValue, setFieldTouched }) => (
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
              <Layout.Vertical spacing="small">
                <Text>{monitoringSource?.selectProduct}</Text>
                <Layout.Horizontal spacing="medium">
                  {monitoringSource?.products?.map((item, index) => {
                    return (
                      <CVSelectionCard
                        isSelected={values.product === item.value}
                        key={`${index}${item}`}
                        isLarge
                        cardLabel={item.label}
                        iconProps={{
                          name: monitoringSource.iconName,
                          size: 30
                        }}
                        onCardSelect={isSelected => {
                          setFieldValue('product', isSelected ? item.value : undefined)
                          setFieldTouched('product', true)
                        }}
                      />
                    )
                  })}
                </Layout.Horizontal>
                {errors.product && (touched.product || !!submitCount) && (
                  <Text color={Color.RED_500} font={{ size: 'small' }} margin={{ top: 'small' }}>
                    {errors.product}
                  </Text>
                )}
              </Layout.Vertical>
            </Layout.Vertical>
            <SubmitAndPreviousButtons
              onPreviousClick={() =>
                history.push(
                  routes.toCVAdminSetup({
                    projectIdentifier,
                    orgIdentifier,
                    accountId
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
