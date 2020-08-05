import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout } from '@wings-software/uikit'
import * as YAML from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/common/exports'
import { useUpdateConnector } from 'services/cd-ng'
import YAMLBuilderPage from 'modules/dx/pages/yamlBuilder/YamlBuilderPage'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { getValidationSchemaByType, getFormByType } from './utils/ConnectorHelper'
import SavedConnectorDetails from './SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import i18n from './ConfigureConnector.i18n'
// import type { ConnectorSchema } from './ConnectorSchema'
import { buildKubPayload, buildKubFormData } from './utils/ConnectorUtils'
import css from './ConfigureConnector.module.scss'

export interface ConfigureConnectorProps {
  accountId: string
  type: string
  connector: any
  setInitialConnector: (connector: any) => void
  isCreationThroughYamlBuilder: boolean
  connectorJson: any
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: any
  setConnector: (object: any) => void
  selectedView: string
  setSelectedView: (selection: string) => void
}

const SelectedView = {
  VISUAL: 'visual',
  YAML: 'yaml'
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

const getYamlFromJson = (json: string): string | undefined => {
  try {
    return YAML.stringify(json)
  } catch (error) {
    //TODO show a popover or alert. Need to confirm the error-handling behaviour
    // console.log(error)
  }
}

const ConfigureConnector = (props: ConfigureConnectorProps): JSX.Element => {
  const [enableEdit, setEnableEdit] = useState(false)
  const [connector, setConnector] = useState(props.connector)
  const [selectedView, setSelectedView] = useState(
    props.isCreationThroughYamlBuilder ? SelectedView.YAML : SelectedView.VISUAL
  )

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    selectedView,
    setSelectedView
  }
  const { showSuccess, showError } = useToaster()

  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })

  const onSubmitForm = async (formData: any) => {
    state.setEnableEdit(false)
    const connectorPayload = buildKubPayload(formData)

    try {
      const data = await updateConnector(connectorPayload as any) // Incompatible BE types
      const formatedData = buildKubFormData(data)
      state.setConnector(formatedData)
      showSuccess(i18n.SaveConnector.SUCCESS)
    } catch (error) {
      showError(error.message)
    }
  }

  const renderConnectorForm = (): JSX.Element => {
    const validationSchema = getValidationSchemaByType(props.type)
    return (
      <Formik
        initialValues={connector}
        onSubmit={formData => onSubmitForm(formData)}
        validationSchema={validationSchema}
      >
        {formikProps => (
          <Form className={css.formCustomCss}>
            {getFormByType(props, formikProps)}
            <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
          </Form>
        )}
      </Formik>
    )
  }

  useEffect(() => {
    if (props.connector) {
      setConnector(props.connector)
    }
  }, [props])

  return (
    <div className={css.connectorWrp}>
      <div className={css.optionBtns}>
        <div
          className={cx(css.item, { [css.selected]: selectedView === SelectedView.VISUAL })}
          onClick={() => setSelectedView(SelectedView.VISUAL)}
        >
          {i18n.VISUAL}
        </div>
        <div
          className={cx(css.item, { [css.selected]: selectedView === SelectedView.YAML })}
          onClick={() => setSelectedView(SelectedView.YAML)}
        >
          {i18n.YAML}
        </div>
      </div>
      <Layout.Horizontal className={css.mainDetails}>
        {selectedView === SelectedView.VISUAL ? (
          <React.Fragment>
            <div className={css.connectorDetails}>
              {renderSubHeader(state)}
              {!enableEdit ? renderSavedDetails(state) : null}
              {enableEdit ? renderConnectorForm() : null}
            </div>
            {renderConnectorStats()}
          </React.Fragment>
        ) : (
          <div className={css.editor}>
            <YAMLBuilderPage
              fileName={`${connector?.identifier ?? 'Connector'}.yaml`}
              entityType={YamlEntity.CONNECTOR}
              existingYaml={getYamlFromJson(props.connectorJson)}
            />
          </div>
        )}
      </Layout.Horizontal>
    </div>
  )
}

export default ConfigureConnector
