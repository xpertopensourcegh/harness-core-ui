import React, { useState } from 'react'
import { Formik, FormikForm, Container, Button, Layout, Card, CardBody, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { IconName } from '@blueprintjs/core'
import * as Yup from 'yup'
import createConnectorModal from '@ce/components/Connectors/createConnectorModal'
import type { GatewayDetails } from '@ce/components/COCreateGateway/models'
import { ConnectorReferenceField } from '@connectors/components/ConnectorReferenceField/ConnectorReferenceField'
import i18n from './COGatewayBasics.i18n'
import css from './COGatewayBasics.module.scss'
interface COGatewayBasicsProps {
  nextTab: () => void
  previousTab: () => void
  gatewayDetails: GatewayDetails
  setGatewayDetails: (gwDetails: GatewayDetails) => void
}

const COGatewayBasics: React.FC<COGatewayBasicsProps> = props => {
  const { accountId } = useParams<{
    accountId: string
  }>()
  const [cloudAccountID, setCloudAccountID] = useState<string>(props.gatewayDetails.cloudAccount.id)
  const { openConnectorModal } = createConnectorModal({
    // onSuccess: () => {
    // },
    // onClose: () => {
    // }
  })
  return (
    <Layout.Vertical spacing="large" padding="large">
      <Container width="40%" style={{ marginLeft: '10%', paddingTop: 200 }}>
        <Card selected style={{ padding: '5px', width: '50px', height: '50px' }} cornerSelected={true}>
          <CardBody.Icon icon={props.gatewayDetails.provider.icon as IconName} iconSize={25}></CardBody.Icon>
        </Card>
        <Container style={{ margin: '0 auto', paddingTop: 50 }}>
          <Formik
            initialValues={{
              gatewayName: props.gatewayDetails.name,
              cloudAccount: props.gatewayDetails.cloudAccount
            }}
            onSubmit={values => alert(JSON.stringify(values))}
            render={formik => (
              <FormikForm>
                <Layout.Vertical spacing="large">
                  <ConnectorReferenceField
                    name="cloudAccount"
                    category={'CLOUD_COST'}
                    selected={formik.values.cloudAccount.name}
                    label={[i18n.connect, props.gatewayDetails.provider.name, i18n.account].join(' ')}
                    placeholder={i18n.select}
                    accountIdentifier={accountId}
                    onChange={e => {
                      formik.setFieldValue('cloudAccount', e.identifier)
                      props.gatewayDetails.cloudAccount = { id: e.identifier?.toString(), name: e.name }
                      props.setGatewayDetails(props.gatewayDetails)
                      setCloudAccountID(e.identifier?.toString())
                      formik.setFieldValue('cloudAccount', e)
                    }}
                  />
                </Layout.Vertical>
              </FormikForm>
            )}
            validationSchema={Yup.object().shape({
              cloudAccount: Yup.string().trim().required('Cloud Account is required field')
            })}
          ></Formik>
          <Text
            onClick={() => openConnectorModal(false, 'CEAws')}
            style={{ fontSize: '13px', color: '#0278D5', lineHeight: '20px', cursor: 'pointer' }}
          >
            {['+', i18n.new, props.gatewayDetails.provider.name, i18n.connector].join(' ')}
          </Text>
        </Container>
      </Container>
      <Layout.Horizontal className={css.footer} spacing="medium">
        <Button text="Previous" icon="chevron-left" onClick={props.previousTab} />
        <Button
          intent="primary"
          text="Next"
          icon="chevron-right"
          onClick={props.nextTab}
          disabled={cloudAccountID == ''}
        />
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default COGatewayBasics
