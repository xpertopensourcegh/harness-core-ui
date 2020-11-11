import React, { useState, useEffect } from 'react'

import cx from 'classnames'
import {
  Layout,
  Text,
  Container,
  Card,
  CardBody,
  FormikForm,
  Formik,
  FormInput,
  Icon,
  IconName,
  Color,
  Link,
  Button
} from '@wings-software/uikit'

import * as Yup from 'yup'
import { useParams, useHistory } from 'react-router-dom'
import { StringUtils } from '@common/exports'
import { routeCVAdminSetup } from 'navigation/cv/routes'
import type { ConnectorInfoDTO } from 'services/cd-ng'
import { FormMultiTypeConnectorField } from '@connectors/components/ConnectorReferenceField/FormMultiTypeConnectorField'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import i18n from './SelectProduct.i18n'
import css from './SelectProduct.module.scss'

interface SelectProductProps {
  type: string
  stepData?: { [key: string]: string }
  onCompleteStep: (data: { [key: string]: string }) => void
}
interface ProductOption {
  value: string
  label: string
}

interface MonitoringSourceInfo {
  icon: string
  iconLabel: string
  connectToMonitoringSource: string
  firstTimeText: string
  connector: ConnectorInfoDTO['type']
  createConnector: string
  selectProduct: string
  products: ProductOption[]
}

const getInfoSchemaByType = (type: string): MonitoringSourceInfo => {
  switch (type) {
    case 'AppDynamics':
      return {
        icon: 'service-appdynamics',
        iconLabel: 'AppDynamics',
        connectToMonitoringSource: i18n.AppD.connectToMonitoringSource,
        firstTimeText: i18n.AppD.firstTimeText,
        connector: 'AppDynamics',
        createConnector: i18n.AppD.createConnector,
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
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>()
  const [monitoringSource, setMonitoringSource] = useState<MonitoringSourceInfo | undefined>()

  const { openConnectorModal } = useCreateConnectorModal({})

  useEffect(() => {
    setMonitoringSource(getInfoSchemaByType(props.type))
  }, [props.type])

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
            <Layout.Vertical width={'40%'} style={{ margin: 'auto' }}>
              <Text font={{ size: 'medium' }} margin={{ top: 'large', bottom: 'large' }}>
                {i18n.heading}
              </Text>
              <Layout.Vertical margin={{ bottom: 'large' }} spacing="small">
                <Card interactive={true} className={css.card} selected>
                  <div className={css.triangle}>
                    <Icon name="tick" size={12} className={css.tick} color={Color.WHITE} />
                  </div>
                  <CardBody.Icon
                    icon={monitoringSource?.icon as IconName}
                    iconSize={40}
                    className={cx(css.cardIcon, css.cardIconSelected)}
                  />
                </Card>
                <Text>{monitoringSource?.iconLabel}</Text>
              </Layout.Vertical>
              <Container className={css.connectorForm}>
                <div className={css.connectorFormNameWarpper}>
                  <div className={css.connectorFormNameElm}>
                    <FormInput.InputWithIdentifier inputLabel={i18n.name} />
                  </div>

                  <Layout.Vertical margin="small" padding={{ left: 'large', top: 'small' }} spacing="xsmall">
                    {isDescriptionOpen ? null : (
                      <Text className="link" onClick={() => setIsDescriptionOpen(true)}>
                        {i18n.addDescription}
                      </Text>
                    )}
                    {isTagsOpen ? null : (
                      <Text className="link" onClick={() => setIsTagsOpen(true)}>
                        {i18n.addTags}
                      </Text>
                    )}
                  </Layout.Vertical>
                </div>

                <div className={css.connectorFormElm}>
                  {isDescriptionOpen ? (
                    <>
                      <Container className={css.headerRow}>
                        <Text inline>{i18n.description}</Text>
                        <Text inline className="link" onClick={() => setIsDescriptionOpen(false)}>
                          {i18n.remove}
                        </Text>
                      </Container>

                      <FormInput.TextArea className={css.description} name="description" />
                    </>
                  ) : null}
                </div>
                <div className={css.connectorFormElm}>
                  {isTagsOpen ? (
                    <>
                      <Container className={css.headerRow}>
                        <Text inline>{i18n.tags}</Text>
                        <Text inline className="link" onClick={() => setIsTagsOpen(false)}>
                          {i18n.remove}
                        </Text>
                      </Container>
                      <FormInput.TagInput
                        name="tags"
                        labelFor={name => (typeof name === 'string' ? name : '')}
                        itemFromNewTag={newTag => newTag}
                        items={[]}
                        className={css.tags}
                        tagInputProps={{
                          noInputBorder: true,
                          openOnKeyDown: false,
                          showAddTagButton: true,
                          showClearAllButton: true,
                          allowNewTag: true
                        }}
                      />
                    </>
                  ) : null}
                </div>
              </Container>

              <Layout.Vertical spacing="small" margin={{ bottom: 'large' }}>
                <Text>{monitoringSource?.connectToMonitoringSource}</Text>
                <Text color={Color.GREY_350}>{monitoringSource?.firstTimeText}</Text>
                <Layout.Horizontal spacing="medium">
                  <FormMultiTypeConnectorField
                    name="connectorRef"
                    label=""
                    placeholder={i18n.selectConnector}
                    accountIdentifier={accountId}
                    projectIdentifier={projectIdentifier}
                    orgIdentifier={orgIdentifier}
                    width={300}
                    isNewConnectorLabelVisible={false}
                    type={monitoringSource?.connector}
                    className={css.connectorReference}
                  />
                  <Link
                    withoutHref
                    onClick={() => openConnectorModal(monitoringSource?.connector || ('' as ConnectorInfoDTO['type']))}
                    height={'30px'}
                  >
                    {monitoringSource?.createConnector}
                  </Link>
                </Layout.Horizontal>
              </Layout.Vertical>
              <Layout.Vertical spacing="large">
                <Text>{monitoringSource?.selectProduct}</Text>
                <Layout.Horizontal spacing="medium">
                  {monitoringSource?.products.map((item, index) => {
                    return (
                      <Card
                        selected={selectedProduct === item.value}
                        key={`${index}${item}`}
                        interactive={true}
                        className={cx(css.cardProduct, { [css.cardProductSelected]: selectedProduct === item.value })}
                        onClick={() => setSelectedProduct(item.value)}
                      >
                        {selectedProduct === item.value ? (
                          <div className={css.triangle}>
                            <Icon name="tick" size={14} className={css.tickProduct} color={Color.WHITE} />
                          </div>
                        ) : null}

                        <CardBody.Icon
                          icon={monitoringSource?.icon as IconName}
                          iconSize={30}
                          className={cx(css.cardIcon, { [css.cardIconSelected]: selectedProduct === item.value })}
                        />
                        <div className={css.labelProduct}>{item.label}</div>
                      </Card>
                    )
                  })}
                </Layout.Horizontal>
              </Layout.Vertical>
            </Layout.Vertical>
            <Layout.Horizontal>
              <Button
                text={i18n.PREVIOUS}
                margin="large"
                icon="chevron-left"
                onClick={() =>
                  history.push(
                    routeCVAdminSetup.url({
                      projectIdentifier,
                      orgIdentifier
                    })
                  )
                }
              />
              <Button text={i18n.NEXT} intent="primary" type="submit" margin="large" rightIcon="chevron-right" />
            </Layout.Horizontal>
          </FormikForm>
        )}
      </Formik>
    </Container>
  )
}

export default SelectProduct
