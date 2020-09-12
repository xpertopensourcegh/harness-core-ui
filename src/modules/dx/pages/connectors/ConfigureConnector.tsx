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
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
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
  VISUAL: 'VISUAL',
  YAML: 'YAML'
}

const ConfigureConnector = (props: ConfigureConnectorProps): JSX.Element => {
  const { isCreationThroughYamlBuilder } = props
  const [enableEdit, setEnableEdit] = useState(false)
  const [lastTested, setLastTested] = useState(props.connector.status?.lastTestedAt || 0)
  const [lastConnected, setLastConnected] = useState(props.connector.status?.lastTestedAt || 0)
  const [selectedView, setSelectedView] = useState(
    isCreationThroughYamlBuilder ? SelectedView.YAML : SelectedView.VISUAL
  )

  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [connector, setConnector] = useState(props.connector)
  const [status, setStatus] = useState(props.connector.status?.status || '')
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()

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

  const handleModeSwitch = (targetMode: string): void => {
    if (targetMode === SelectedView.VISUAL) {
      const yamlString = yamlHandler?.getLatestYaml() || ''
      try {
        const yamlData = YAML.parse(yamlString)
        if (yamlData) {
          setConnector(yamlData)
          setSelectedView(targetMode)
        }
      } catch (err) {
        showError(`${err.name}: ${err.message}`)
      }
    } else {
      setSelectedView(targetMode)
    }
  }

  const saveConnector = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.preventDefault()
    const yamlString = yamlHandler?.getLatestYaml() || ''
    try {
      const yamlData = YAML.parse(yamlString)
      if (yamlData) {
        onSubmitForm(yamlData)
        setConnector(yamlData)
      }
    } catch (err) {
      showError(`${err.name}: ${err.message}`)
    }
  }

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

  const yamlBuilderReadOnlyModeProps = {
    fileName: `${connector?.identifier ?? 'Connector'}.yaml`,
    entityType: YamlEntity.CONNECTOR,
    existingYaml: isCreationThroughYamlBuilder ? '' : YAML.stringify(connector),
    snippets: snippets,
    onSnippetSearch: fetchSnippets,
    bind: setYamlHandler
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
          onClick={() => handleModeSwitch(SelectedView.VISUAL)}
        >
          {i18n.VISUAL}
        </div>
        <div
          className={cx(css.item, { [css.selected]: selectedView === SelectedView.YAML })}
          onClick={() => handleModeSwitch(SelectedView.YAML)}
        >
          {i18n.YAML}
        </div>
      </div>
      <Layout.Horizontal className={css.mainDetails}>
        <div className={css.connectorDetails}>
          <Layout.Horizontal className={css.header}>
            {connector?.type ? <span className={css.name}>{getHeadingByType(connector?.type)}</span> : null}
            {state.enableEdit ? null : (
              <Button
                text={isCreationThroughYamlBuilder ? 'Create Connector' : 'Edit Details'}
                icon="edit"
                onClick={() => state.setEnableEdit(true)}
              />
            )}
          </Layout.Horizontal>
          {enableEdit ? (
            selectedView === SelectedView.VISUAL ? (
              <Formik
                initialValues={buildKubFormData(connector)}
                // Todo: validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={formData => {
                  onSubmitForm(buildKubPayload(formData))
                }}
                validate={data => setConnector(buildKubPayload(data))}
              >
                {formikProps => (
                  <Form>
                    <ConnectorForm
                      accountId={props.accountId}
                      orgIdentifier={props.orgIdentifier}
                      projectIdentifier={props.projectIdentifier}
                      type={props.type}
                      connector={buildKubFormData(connector)}
                      formikProps={formikProps}
                    />

                    <Layout.Horizontal>
                      <Button intent="primary" type="submit" text={i18n.submit} className={css.submitBtn} />
                    </Layout.Horizontal>
                  </Form>
                )}
              </Formik>
            ) : (
              <div className={css.editor}>
                <YamlBuilder {...yamlBuilderReadOnlyModeProps} />
                <Button
                  intent="primary"
                  type="submit"
                  text={i18n.submit}
                  className={css.submitBtn}
                  onClick={saveConnector}
                />
              </div>
            )
          ) : selectedView === SelectedView.VISUAL ? (
            <SavedConnectorDetails connector={connector} />
          ) : (
            <div className={css.editor}>
              <YamlBuilder {...yamlBuilderReadOnlyModeProps} isReadOnlyMode={true} showSnippetSection={false} />
            </div>
          )}
        </div>
        {selectedView === SelectedView.VISUAL && connector ? (
          <Layout.Vertical width={'50%'}>
            <ConnectorStats
              createdAt={connector.createdAt || 0}
              lastTested={lastTested || 0}
              lastUpdated={connector.lastModifiedAt as number}
              lastConnected={lastConnected || 0}
              status={status || ''}
            />
            <TestConnection
              accountId={props.accountId}
              orgIdentifier={props.orgIdentifier}
              projectIdentifier={props.projectIdentifier}
              connectorName={connector?.name || ''}
              connectorIdentifier={connector?.identifier || ''}
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
