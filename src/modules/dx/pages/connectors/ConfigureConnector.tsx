import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout, OptionsButtonGroup } from '@wings-software/uikit'
import { getValidationSchemaByType, getFormByType } from './ConnectorHelper'
import css from './ConfigureConnector.module.scss'
import SavedConnectorDetails from './SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import i18n from './ConfigureConnector.i18n'
import type { ConnectorSchema } from './ConnectorSchema'

export interface ConfigureConnectorProps {
  enableEdit: boolean
  connector: ConnectorSchema
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: ConnectorSchema
  setConnector: (object: ConnectorSchema) => void
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

const renderConnectorForm = (state: ConfigureConnectorState, props: ConfigureConnectorProps) => {
  const fieldsByType = getFormByType(props)
  const { connector } = state
  const validationSchema = getValidationSchemaByType('KUBERNETES_CLUSTER')
  return (
    <Formik
      initialValues={connector}
      onSubmit={formData => {
        state.setEnableEdit(false)
        state.setConnector(formData)
      }}
      validationSchema={validationSchema}
    >
      {() => (
        <Form className={css.formField}>
          {fieldsByType}
          <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
        </Form>
      )}
    </Formik>
  )
}

const renderSavedDetails = (state: ConfigureConnectorState) => {
  return <SavedConnectorDetails connector={state.connector} />
}

const renderSubHeader = (state: ConfigureConnectorState) => {
  return (
    <Layout.Horizontal className={css.header}>
      <span className={css.name}>Kubernetes Connector Details</span>
      {!state.enableEdit ? <Button text="Edit Details" icon="edit" onClick={() => state.setEnableEdit(true)} /> : null}
    </Layout.Horizontal>
  )
}

const renderConnectorStats = () => {
  return <ConnectorStats />
}

const ConfigureConnector = (props: ConfigureConnectorProps): JSX.Element => {
  const [enableEdit, setEnableEdit] = useState(false)
  const [connector, setConnector] = useState(props.connector)

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector
  }
  useEffect(() => {
    setEnableEdit(props.enableEdit)
    setConnector(props.connector)
  }, [props])

  return (
    <Layout.Horizontal>
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
