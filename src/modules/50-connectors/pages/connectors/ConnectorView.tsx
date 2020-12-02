import React, { useState, useEffect } from 'react'
import { Button, Layout, Container } from '@wings-software/uikit'
import { parse } from 'yaml'
import cx from 'classnames'
import { useToaster } from 'modules/10-common/exports'
import {
  ConnectorInfoDTO,
  ConnectorRequestBody,
  ConnectorResponse,
  useGetYamlSnippetMetadata,
  useGetYamlSnippet
} from 'services/cd-ng'
import YamlBuilder from 'modules/10-common/components/YAMLBuilder/YamlBuilder'
import { getValidationErrorMessagesForToaster } from 'modules/10-common/components/YAMLBuilder/YAMLBuilderUtils'
import { YamlEntity } from 'modules/10-common/constants/YamlConstants'
import TestConnection from '@connectors/components/TestConnection/TestConnection'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/10-common/interfaces/YAMLBuilderProps'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import type { ConnectorConnectivityDetails, ResponseYamlSnippets, ResponseString } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import SavedConnectorDetails, {
  RenderDetailsSection,
  getActivityDetails
} from './views/savedDetailsView/SavedConnectorDetails'
import i18n from './ConnectorView.i18n'
import css from './ConnectorView.module.scss'

export interface ConnectorViewProps {
  type: ConnectorInfoDTO['type']
  response: ConnectorResponse
  updateConnector: (data: ConnectorRequestBody) => Promise<unknown>
  refetchConnector: () => Promise<any>
  mockMetaData?: UseGetMockData<ResponseYamlSnippets>
  mockSnippetData?: UseGetMockData<ResponseString>
}

interface ConnectorViewState {
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

const ConnectorView: React.FC<ConnectorViewProps> = props => {
  const [enableEdit, setEnableEdit] = useState(false)
  const [lastTested, setLastTested] = useState<number>(props.response?.status?.lastTestedAt || 0)
  const [lastConnected, setLastConnected] = useState<number>(props.response?.status?.lastTestedAt || 0)
  const [selectedView, setSelectedView] = useState(SelectedView.VISUAL)
  const [connector, setConnector] = useState<ConnectorInfoDTO>(props.response?.connector || ({} as ConnectorInfoDTO))
  const [connectorForYaml, setConnectorForYaml] = useState<ConnectorInfoDTO>(
    props.response?.connector || ({} as ConnectorInfoDTO)
  )
  const [status, setStatus] = useState<ConnectorConnectivityDetails['status']>(props.response?.status?.status)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const [isValidYAML] = React.useState<boolean>(true)
  const [snippetYaml, setSnippetYaml] = React.useState<string>()

  const state: ConnectorViewState = {
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

  const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
    fileName: `${connectorForYaml?.identifier ?? 'Connector'}.yaml`,
    entityType: YamlEntity.CONNECTOR,
    existingJSON: { connector: connectorForYaml },
    bind: setYamlHandler,
    width: 900
  }

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      state.setEnableEdit(false)
      props.refetchConnector()
    },
    onClose: () => {
      state.setEnableEdit(false)
    }
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

  const { data: snippet, refetch, loading } = useGetYamlSnippet({
    identifier: '',
    requestOptions: { headers: { accept: 'application/json' } },
    lazy: true,
    mock: props.mockSnippetData
  })

  useEffect(() => {
    setSnippetYaml(snippet?.data)
  }, [loading])

  const onSnippetCopy = (_identifier: string): void => {
    refetch({
      pathParams: {
        identifier: _identifier
      }
    })
  }

  const { data: snippetMetaData } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags(YamlEntity.CONNECTOR, props.type)
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } },
    mock: props.mockMetaData
  })

  return (
    <Layout.Vertical padding={{ top: 'large', left: 'huge', bottom: 'large', right: 'huge' }}>
      <Container className={css.buttonContainer}>
        {state.enableEdit ? null : (
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
        )}
        {state.enableEdit ? null : (
          <Button
            className={css.editButton}
            text={i18n.EDIT_DETAILS}
            icon="edit"
            onClick={() => {
              state.setEnableEdit(true)
              selectedView === SelectedView.VISUAL ? openConnectorModal(false, props.type, connector) : undefined
            }}
          />
        )}
      </Container>

      <Layout.Horizontal>
        {enableEdit ? (
          selectedView === SelectedView.VISUAL ? null : (
            <div className={css.editor}>
              <YamlBuilder
                {...Object.assign(yamlBuilderReadOnlyModeProps, { height: 550 })}
                snippets={snippetMetaData?.data?.yamlSnippets}
                onSnippetCopy={onSnippetCopy}
                snippetYaml={snippetYaml}
              />
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
          <>
            <SavedConnectorDetails connector={connector}></SavedConnectorDetails>
            <Container className={css.connectorDetailsWrapper}>
              <Layout.Vertical>
                <RenderDetailsSection
                  title={i18n.title.connectorActivity}
                  data={getActivityDetails({
                    createdAt: props.response.createdAt || 0,
                    lastTested: lastTested || props.response.status?.lastTestedAt || 0,
                    lastUpdated: (props.response.lastModifiedAt as number) || 0,
                    lastConnectionSuccess: lastConnected || props.response.status?.lastConnectedAt || 0,
                    status: status || props.response.status?.status || ''
                  })}
                ></RenderDetailsSection>
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
            </Container>
          </>
        ) : (
          <div className={css.editor}>
            <YamlBuilder {...yamlBuilderReadOnlyModeProps} isReadOnlyMode={true} showSnippetSection={false} />
          </div>
        )}
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default ConnectorView
