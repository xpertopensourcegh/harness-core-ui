import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout, OptionsButtonGroup } from '@wings-software/uikit'
import { getValidationSchemaByType, getFormByType } from './ConnectorHelper'
import css from './ConfigureConnector.module.scss'
import SavedConnectorDetails from './SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import i18n from './ConfigureConnector.i18n'
// import type { ConnectorSchema } from './ConnectorSchema'
import { ConnectorService} from 'modules/dx/services'

export interface ConfigureConnectorProps {
  enableCreate: boolean
  connector: any
  setInitialConnector:(connector:any)=>void
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: any
  setConnector: (object: any) => void
  enableCreate: boolean
  setEnableCreate: (val: boolean) => void
}
interface Options {
  text: string
  value: string
  selected?: boolean
}

const getOptions = (): Options[] => {
  return [
    {
      text: 'Visual',
      value: 'visual',
      selected: true
    },
    {
      text: 'Yaml',
      value: 'yaml'
    }
  ]
}

export const buildKubPayload = (formData: any) => {
  console.log(formData)
  const savedData = {
    name: formData.name,
    identifier: formData.identifier,
    k8sCluster: {
      inheritConfigFromDelegate: formData.inheritConfigFromDelegate,
      config: {
        masterUrl: formData.masterUrl,
        auth: {
          userPassword: {
            username: formData.username,
            password: formData.password,
            cacert: 'okk'
          }
        }
      }
    }
  }
  return savedData
}

const buildFormData = (connector:any) => {
return {
  name:connector.name,
  description:connector.description,
  identifier: connector.identifier,
  tags:connector.tags,
  authType: Object.keys(connector.connectorConfig)[0],
  masterUrl:connector.connectorConfig.masterUrl,
  inheritConfigFromDelegate:connector.connectorConfig.inheritConfigFromDelegate
}
}
const createConnectorByType = async (data:any, state: ConfigureConnectorState) => {
  const xhrGroup='create-connector'
  const { connector, error } = await ConnectorService.createConnector({xhrGroup,connector:data})
  if(!error){
     state.setConnector(connector)
     const formData = buildFormData(connector)
     state.setConnector(formData )
    //  props.setInitialConnector(formData)
  }
  else {

  }
}

const onSubmitForm = (formData: any, state: ConfigureConnectorState) => {
  state.setEnableEdit(false)
  state.setEnableCreate(false)
 state.setConnector(formData)
  const data = buildKubPayload(formData)
  createConnectorByType(data, state)

}

const renderConnectorForm = (state: ConfigureConnectorState, props: ConfigureConnectorProps): JSX.Element => {
  const { connector,enableCreate } = state
  const fieldsByType = getFormByType(props)

  const validationSchema = getValidationSchemaByType('KUBERNETES_CLUSTER')
  return (
    <Formik
      initialValues={enableCreate ? {} : connector}
      onSubmit={formData => onSubmitForm(formData, state)}
      validationSchema={validationSchema}
    >
      {() => (
        <Form className={css.formCustomCss}>
          {fieldsByType}
          <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
        </Form>
      )}
    </Formik>
  )
}

const renderSavedDetails = (state: ConfigureConnectorState): JSX.Element => {
  return <SavedConnectorDetails connector={state.connector} />
}

const renderSubHeader = (state: ConfigureConnectorState): JSX.Element => {
  return (
    <Layout.Horizontal className={css.header} spacing="medium">
      <span className={css.name}>Kubernetes Connector Details</span>
      {!state.enableEdit ? <Button text="Edit Details" icon="edit" onClick={() => state.setEnableEdit(true)} /> : null}
    </Layout.Horizontal>
  )
}

const renderConnectorStats = (): JSX.Element => {
  return (
    <ConnectorStats
      createdAt="24.08.2020, 11:58 PM"
      lastTested="a minute ago"
      lastUpdated="31.08.2020, 10:00 AM "
      connectionSuccesful="a minute ago"
      status="SUCCESS"
    />
  )
}


const ConfigureConnector = (props: ConfigureConnectorProps): JSX.Element => {
  const [enableEdit, setEnableEdit] = useState(props.enableCreate)
  const [enableCreate, setEnableCreate] = useState(props.enableCreate)
  const [connector, setConnector] = useState(props.connector)

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    enableCreate,
    setEnableCreate
  }
  useEffect(() => {
  //  / setEnableEdit()
    if (props.connector) {
      setConnector(props.connector)
    }
  }, [props])

  return (
    <Layout.Horizontal className={css.mainDetails}>
      <div className={css.connectorDetails}>
        <OptionsButtonGroup options={getOptions()} onChange={value => alert('Select ' + value)} />
        {renderSubHeader(state)}
        {!enableEdit ? renderSavedDetails(state) : null}
        {enableEdit ? renderConnectorForm(state, props) : null}
      </div>
      {renderConnectorStats()}
    </Layout.Horizontal>
  )
}

export default ConfigureConnector
