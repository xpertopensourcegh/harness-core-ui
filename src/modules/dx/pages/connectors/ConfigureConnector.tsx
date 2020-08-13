import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout } from '@wings-software/uikit'
import * as YAML from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/common/exports'
import { useUpdateConnector, ConnectorDTO } from 'services/cd-ng'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import TestConnection from 'modules/dx/components/connectors/TestConnection/TestConnection'
import ConnectorForm from 'modules/dx/components/connectors/ConnectorForm/ConnectorForm'
import type { FormData } from 'modules/dx/interfaces/ConnectorInterface'
import SavedConnectorDetails from './SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import { buildKubPayload } from './utils/ConnectorUtils'
import i18n from './ConfigureConnector.i18n'
import css from './ConfigureConnector.module.scss'

export interface ConfigureConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: string
  connectorDetails: ConnectorDTO
  connector: FormData
  refetchConnector: () => Promise<any>
  isCreationThroughYamlBuilder: boolean
  connectorJson: any
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: FormData
  setConnector: (object: FormData) => void
  selectedView: string
  setSelectedView: (selection: string) => void
  connectorResponse: ConnectorDTO
  setConnectorResponse: (data: ConnectorDTO) => void
}

const SelectedView = {
  VISUAL: 'visual',
  YAML: 'yaml'
}

const renderSubHeader = (state: ConfigureConnectorState): JSX.Element => {
  return (
    <Layout.Horizontal className={css.header} spacing="medium">
      <span className={css.name}>Kubernetes Connector Details</span>
      {!state.enableEdit ? <Button text="Edit Details" icon="edit" onClick={() => state.setEnableEdit(true)} /> : null}
    </Layout.Horizontal>
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
  const [connectorResponse, setConnectorResponse] = useState(props.connectorDetails)

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    selectedView,
    setSelectedView,
    connectorResponse,
    setConnectorResponse
  }
  const { showSuccess, showError } = useToaster()

  const { mutate: updateConnector } = useUpdateConnector({ accountIdentifier: props.accountId })

  const onSubmitForm = async (formData: any) => {
    const connectorPayload = buildKubPayload(formData)

    try {
      const data = await updateConnector(connectorPayload as any) // Incompatible BE types
      if (data) {
        showSuccess(i18n.SaveConnector.SUCCESS)
        props.refetchConnector()
        state.setEnableEdit(false)
      }
    } catch (error) {
      showError(error.message)
    }
  }

  useEffect(() => {
    if (props.connector) {
      setConnector(props.connector)
      setConnectorResponse(props.connectorDetails)
    }
  }, [props.connector, props.connectorDetails])
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
              {enableEdit ? (
                <Formik
                  initialValues={connector}
                  // Todo: validationSchema={validationSchema}
                  onSubmit={formData => {
                    onSubmitForm(formData)
                  }}
                >
                  {formikProps => (
                    <Form className={css.formCustomCss}>
                      <ConnectorForm
                        accountId={props.accountId}
                        orgIdentifier={props.orgIdentifier}
                        projectIdentifier={props.projectIdentifier}
                        type={props.type}
                        connector={props.connector}
                        formikProps={formikProps}
                      />
                      <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
                    </Form>
                  )}
                </Formik>
              ) : (
                <SavedConnectorDetails connector={state.connector} />
              )}
            </div>
            <Layout.Vertical width={'50%'}>
              <ConnectorStats
                createdAt={connector?.createdAt}
                lastTested="a minute ago"
                lastUpdated={connector?.lastModifiedAt}
                connectionSuccesful="a minute ago"
                status="SUCCESS"
              />

              <TestConnection
                delegateType={connector.delegateType}
                accountId={props.accountId}
                orgIdentifier={props.orgIdentifier}
                projectIdentifier={props.projectIdentifier}
                connectorName={connector.name}
                connectorIdentifier={connector.identifier}
                delegateName={connector.delegateName}
              />
            </Layout.Vertical>
          </React.Fragment>
        ) : (
          <div className={css.editor}>
            <YamlBuilder
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
