import React, { useState, useEffect } from 'react'
import { Formik, FormikForm as Form, Button, Layout, IconName } from '@wings-software/uikit'
import * as YAML from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/common/exports'
import type { ConnectorDTO } from 'services/cd-ng'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import { YAMLService } from 'modules/dx/services'
import TestConnection from 'modules/dx/components/connectors/TestConnection/TestConnection'
import ConnectorForm from 'modules/dx/components/connectors/ConnectorForm/ConnectorForm'
import SavedConnectorDetails from './SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import { buildKubPayload, buildKubFormData } from './utils/ConnectorUtils'
import { getHeadingByType } from './utils/ConnectorHelper'
import i18n from './ConfigureConnector.i18n'
import css from './ConfigureConnector.module.scss'

export interface ConfigureConnectorProps {
  accountId: string
  projectIdentifier: string
  orgIdentifier: string
  type: string
  connector: ConnectorDTO
  updateConnector: (data: ConnectorDTO) => Promise<unknown>
  refetchConnector: () => Promise<any>
  isCreationThroughYamlBuilder: boolean
  connectorJson: any
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: ConnectorDTO
  setConnector: (object: ConnectorDTO) => void
  selectedView: string
  setSelectedView: (selection: string) => void
  lastTested: number
  setLastTested: (val: number) => void
  lastConnected: number
  setLastConnected: (val: number) => void
}

const SelectedView = {
  VISUAL: 'visual',
  YAML: 'yaml'
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
  const [lastTested, setLastTested] = useState(props.connector.status?.lastTestedAt || 0)
  const [lastConnected, setLastConnected] = useState(props.connector.status?.lastTestedAt || 0)
  const [selectedView, setSelectedView] = useState(
    props.isCreationThroughYamlBuilder ? SelectedView.YAML : SelectedView.VISUAL
  )
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [connector, setConnector] = useState(props.connector)
  const [status, setStatus] = useState(props.connector.status?.status || '')

  const state: ConfigureConnectorState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    selectedView,
    setSelectedView,
    lastTested,
    setLastTested,
    lastConnected,
    setLastConnected
  }
  const { showSuccess, showError } = useToaster()

  const onSubmitForm = async (connectorPayload: ConnectorDTO) => {
    try {
      const data = await props.updateConnector(connectorPayload)
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
  }, [props.connector])
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
          {selectedView === SelectedView.VISUAL ? (
            <Layout.Horizontal className={css.header} spacing="medium">
              <span className={css.name}>{getHeadingByType(props.connector?.type)}</span>
              {!state.enableEdit ? (
                <Button text="Edit Details" icon="edit" onClick={() => state.setEnableEdit(true)} />
              ) : null}
            </Layout.Horizontal>
          ) : null}
          {enableEdit ? (
            <Formik
              initialValues={buildKubFormData(props.connector)}
              // Todo: validationSchema={validationSchema}
              onSubmit={formData => {
                onSubmitForm(buildKubPayload(formData))
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
                      connector={buildKubFormData(props.connector)}
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
        {selectedView === SelectedView.VISUAL && props.connector ? (
          <Layout.Vertical width={'50%'}>
            <ConnectorStats
              createdAt={props.connector.createdAt || 0}
              lastTested={lastTested || 0}
              lastUpdated={props.connector.lastModifiedAt as number}
              lastConnected={lastConnected || 0}
              status={status || ''}
            />

            <TestConnection
              accountId={props.accountId}
              orgIdentifier={props.orgIdentifier}
              projectIdentifier={props.projectIdentifier}
              connectorName={props.connector?.name || ''}
              connectorIdentifier={props.connector?.identifier || ''}
              delegateName={connector.spec?.spec?.delegateName || ''}
              setLastTested={setLastTested}
              setLastConnected={setLastConnected}
              setStatus={setStatus}
            />
          </Layout.Vertical>
        ) : null}
      </Layout.Horizontal>
    </div>
  )
}

export default ConfigureConnector
