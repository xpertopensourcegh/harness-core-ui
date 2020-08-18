import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout, IconName } from '@wings-software/uikit'
import * as YAML from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/common/exports'
import { useUpdateConnector, ConnectorDTO, ConnectorConnectivityDetails } from 'services/cd-ng'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import { YAMLService } from 'modules/dx/services'
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
  lastTested: number
  setLastTested: (val: number) => void
  lastConnected: number
  setLastConnected: (val: number) => void
}

const SelectedView = {
  VISUAL: 'visual',
  YAML: 'yaml'
}

const renderSubHeader = (state: ConfigureConnectorState): JSX.Element => {
  return (
    <Layout.Horizontal className={css.header} spacing="medium">
      <span className={css.name}>{state.connectorResponse?.type + ' Connector Details'}</span>
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
  const [lastTested, setLastTested] = useState(0) // props.connectorDetails?.lastTested ||
  const [lastConnected, setLastConnected] = useState(0) // props.connectorDetails?.lastConnected ||
  const [selectedView, setSelectedView] = useState(
    props.isCreationThroughYamlBuilder ? SelectedView.YAML : SelectedView.VISUAL
  )
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [connectorResponse, setConnectorResponse] = useState(props.connectorDetails)

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    selectedView,
    setSelectedView,
    connectorResponse,
    setConnectorResponse,
    lastTested,
    setLastTested,
    lastConnected,
    setLastConnected
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

  const addIconInfoToSnippets = (snippetsList: SnippetInterface[], iconName: IconName): void => {
    if (!snippetsList) {
      return
    }
    const snippetsClone = snippetsList.slice()
    snippetsClone.forEach(snippet => {
      snippet['iconName'] = iconName
    })
  }

  const fetchSnippets = (query?: string): void => {
    const { error, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.PIPELINE, query)
    if (error) {
      showError(error)
      return
    }
    addIconInfoToSnippets(snippetsList, 'command-shell-script')
    setSnippets(snippetsList)
  }

  useEffect(() => {
    fetchSnippets()
  })

  useEffect(() => {
    if (props.connector) {
      setConnector(props.connector)
    }
    if (props.connectorDetails) {
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
        <div className={css.connectorDetails}>
          {selectedView === SelectedView.VISUAL ? renderSubHeader(state) : null}
          {enableEdit ? (
            <Formik
              initialValues={connector}
              // Todo: validationSchema={validationSchema}
              onSubmit={formData => {
                onSubmitForm(formData)
              }}
            >
              {formikProps => (
                <Form>
                  {selectedView === SelectedView.VISUAL ? (
                    <ConnectorForm
                      accountId={props.accountId}
                      orgIdentifier={props.orgIdentifier}
                      projectIdentifier={props.projectIdentifier}
                      type={props.type}
                      connector={props.connector}
                      formikProps={formikProps}
                    />
                  ) : (
                    <div className={css.editor}>
                      <YamlBuilder
                        fileName={`${connector?.identifier ?? 'Connector'}.yaml`}
                        entityType={YamlEntity.CONNECTOR}
                        existingYaml={getYamlFromJson(props.connectorJson)}
                        snippets={snippets}
                        onSnippetSearch={fetchSnippets}
                      />
                    </div>
                  )}
                  <Layout.Horizontal>
                    <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
                  </Layout.Horizontal>
                </Form>
              )}
            </Formik>
          ) : selectedView === SelectedView.VISUAL ? (
            <SavedConnectorDetails connector={props.connector} />
          ) : (
            <div className={css.editor}>
              <YamlBuilder
                fileName={`${connector?.identifier ?? 'Connector'}.yaml`}
                entityType={YamlEntity.CONNECTOR}
                existingYaml={getYamlFromJson(props.connectorJson)}
                snippets={snippets}
                onSnippetSearch={fetchSnippets}
              />
            </div>
          )}
        </div>
        {selectedView === SelectedView.VISUAL ? (
          <Layout.Vertical width={'50%'}>
            <ConnectorStats
              createdAt={connectorResponse?.createdAt || 0}
              lastTested={lastTested || 0} // Todo: add { || connectorResponse?.lastTested}
              lastUpdated={connectorResponse?.lastModifiedAt || 0}
              lastConnected={lastConnected || 0} // Todo: add {|| connectorResponse?.lastConnected}
              status={connectorResponse?.status || ({} as ConnectorConnectivityDetails)}
            />

            <TestConnection
              delegateType={connector.delegateType}
              accountId={props.accountId}
              orgIdentifier={props.orgIdentifier}
              projectIdentifier={props.projectIdentifier}
              connectorName={connector.name}
              connectorIdentifier={connector.identifier}
              delegateName={connector.delegateName}
              setLastTested={setLastTested}
              setLastConnected={setLastConnected}
            />
          </Layout.Vertical>
        ) : null}
      </Layout.Horizontal>
    </div>
  )
}

export default ConfigureConnector
