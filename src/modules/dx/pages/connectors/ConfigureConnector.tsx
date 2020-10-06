import React, { useState, useEffect } from 'react'
import { Button, Layout } from '@wings-software/uikit'
import { parse } from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/common/exports'
import type { ConnectorInfoDTO, ConnectorRequestBody, ConnectorResponse } from 'services/cd-ng'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import {
  addIconInfoToSnippets,
  pickIconForEntity,
  getValidationErrorMessagesForToaster
} from 'modules/common/components/YAMLBuilder/YAMLBuilderUtils'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import { YAMLService } from 'modules/dx/services'
import TestConnection from 'modules/dx/components/connectors/TestConnection/TestConnection'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/common/interfaces/YAMLBuilderProps'
import ConnectorForm from 'modules/dx/components/connectors/ConnectorForm/ConnectorForm'
import type { ConnectorConnectivityDetails } from 'services/cd-ng'
import SavedConnectorDetails from './views/savedDetailsView/SavedConnectorDetails'
import ConnectorStats from './ConnectorStats'
import { getHeadingByType } from './utils/ConnectorHelper'
import i18n from './ConfigureConnector.i18n'
import css from './ConfigureConnector.module.scss'

export interface ConfigureConnectorProps {
  type: string
  response: ConnectorResponse
  updateConnector: (data: ConnectorRequestBody) => Promise<unknown>
  refetchConnector: () => Promise<any>
}

interface ConfigureConnectorState {
  enableEdit: boolean
  setEnableEdit: (val: boolean) => void
  connector: ConnectorInfoDTO
  setConnector: (object: ConnectorInfoDTO) => void
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

const ConfigureConnector: React.FC<ConfigureConnectorProps> = props => {
  const [enableEdit, setEnableEdit] = useState(false)
  const [lastTested, setLastTested] = useState<number>(props.response?.status?.lastTestedAt || 0)
  const [lastConnected, setLastConnected] = useState<number>(props.response?.status?.lastTestedAt || 0)
  const [selectedView, setSelectedView] = useState(SelectedView.VISUAL)

  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [connector, setConnector] = useState<ConnectorInfoDTO>(props.response?.connector || ({} as ConnectorInfoDTO))
  const [connectorForYaml, setConnectorForYaml] = useState<ConnectorInfoDTO>(
    props.response?.connector || ({} as ConnectorInfoDTO)
  )
  const [status, setStatus] = useState<ConnectorConnectivityDetails['status']>(props.response?.status?.status)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const [isValidYAML] = React.useState<boolean>(true)

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

  const onSubmit = async (connectorPayload: ConnectorRequestBody) => {
    try {
      const data = await props.updateConnector(connectorPayload)
      if (data) {
        showSuccess(i18n.SaveConnector.SUCCESS)
        props.refetchConnector()
        state.setEnableEdit(false)
      }
    } catch (error) {
      showError(error.data?.message)
    }
  }

  const handleModeSwitch = (targetMode: string): void => {
    const { getLatestYaml, getYAMLValidationErrorMap } = yamlHandler || {}
    if (targetMode === SelectedView.VISUAL) {
      const yamlString = getLatestYaml?.() || ''
      try {
        const connectorJSONEq = parse(yamlString)?.connector
        if (connectorJSONEq) {
          const errorMap = getYAMLValidationErrorMap?.()
          if (errorMap && errorMap.size > 0) {
            showError(getValidationErrorMessagesForToaster(errorMap), 5000)
          } else {
            if (connectorJSONEq.identifier != props.response.connector?.identifier) {
              throw i18n.idError
            }
            setSelectedView(targetMode)
          }
          setConnector(connectorJSONEq)
          setConnectorForYaml(connectorJSONEq)
        }
      } catch (err) {
        showError(err.name ? `${err.name}: ${err.message}` : err)
      }
    } else {
      setSelectedView(targetMode)
    }
  }

  const handleSaveYaml = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.preventDefault()
    const { getLatestYaml, getYAMLValidationErrorMap } = yamlHandler || {}
    const yamlString = getLatestYaml?.() || ''
    try {
      const connectorJSONEq = parse(yamlString)
      if (connectorJSONEq) {
        const errorMap = getYAMLValidationErrorMap?.()
        if (errorMap && errorMap.size > 0) {
          showError(getValidationErrorMessagesForToaster(errorMap), 5000)
        } else {
          onSubmit(connectorJSONEq)
        }
        setConnector(connectorJSONEq?.connector)
        setConnectorForYaml(connectorJSONEq?.connector)
      }
    } catch (err) {
      showError(`${err.name}: ${err.message}`)
    }
  }

  const fetchSnippets = (connectorType: string, query?: string): void => {
    const { error, response: snippetsList } =
      YAMLService.fetchSnippets(YamlEntity.CONNECTOR, connectorType, query) || {}
    if (error) {
      showError(error)
      return
    }
    addIconInfoToSnippets(pickIconForEntity(connectorType), snippetsList)
    setSnippets(snippetsList)
  }

  const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
    fileName: `${connectorForYaml?.identifier ?? 'Connector'}.yaml`,
    entityType: YamlEntity.CONNECTOR,
    existingJSON: { connector: connectorForYaml },
    snippets: snippets,
    onSnippetSearch: fetchSnippets,
    bind: setYamlHandler,
    width: 900
  }

  useEffect(() => {
    fetchSnippets(connector?.type)
  })

  useEffect(() => {
    if (props.response.connector) {
      setConnector(props.response.connector)
      setConnectorForYaml(props.response.connector)
    }
  }, [props.response])

  //TODO enable it later on
  // useEffect(() => {
  //   const enableBtn =
  //     yamlHandler && yamlHandler.getYAMLValidationErrorMap()
  //       ? yamlHandler?.getYAMLValidationErrorMap()?.size === 0
  //       : true
  //   setIsValidYAML(enableBtn)
  // }, [enableEdit])

  return (
    <div className={css.connectorWrp}>
      <div className={css.optionBtns}>
        <div
          className={cx(
            css.item,
            { [css.selected]: selectedView === SelectedView.VISUAL },
            { [css.disabled]: !isValidYAML }
          )}
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
              <Button text={i18n.EDIT_DETAILS} icon="edit" onClick={() => state.setEnableEdit(true)} />
            )}
          </Layout.Horizontal>
          {enableEdit ? (
            selectedView === SelectedView.VISUAL ? (
              <ConnectorForm
                type={props.type}
                connector={connector}
                setConnector={setConnector}
                setConnectorForYaml={setConnectorForYaml}
                onSubmit={onSubmit}
              />
            ) : (
              <div className={css.editor}>
                <YamlBuilder {...Object.assign(yamlBuilderReadOnlyModeProps, { height: 550 })} />
                <Button
                  intent="primary"
                  text={i18n.submit}
                  onClick={handleSaveYaml}
                  margin={{ top: 'large' }}
                  title={isValidYAML ? '' : i18n.invalidYAML}
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
        {selectedView === SelectedView.VISUAL && props.response ? (
          <Layout.Vertical width={'50%'}>
            <ConnectorStats
              createdAt={props.response.createdAt || 0}
              lastTested={lastTested || props.response.status?.lastTestedAt}
              lastUpdated={props.response.lastModifiedAt as number}
              lastConnected={lastConnected || props.response.status?.lastConnectedAt}
              status={status || props.response.status?.status}
            />
            <TestConnection
              connectorName={connector?.name || ''}
              connectorIdentifier={connector?.identifier || ''}
              delegateName={connector?.spec?.credential?.spec?.delegateName || ''}
              setLastTested={setLastTested}
              setLastConnected={setLastConnected}
              setStatus={setStatus}
              connectorType={connector?.type || ''}
            />
          </Layout.Vertical>
        ) : null}
      </Layout.Horizontal>
    </div>
  )
}

export default ConfigureConnector
