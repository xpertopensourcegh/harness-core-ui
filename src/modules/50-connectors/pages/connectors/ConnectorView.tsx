import React, { useState, useEffect } from 'react'
import { Button, Layout, Container } from '@wings-software/uicore'
import { parse } from 'yaml'
import cx from 'classnames'
import { useToaster, useConfirmationDialog } from 'modules/10-common/exports'
import {
  ConnectorInfoDTO,
  ConnectorRequestBody,
  ConnectorResponse,
  useGetYamlSnippetMetadata,
  useGetYamlSnippet,
  ResponseJsonNode,
  ConnectorConnectivityDetails,
  ResponseYamlSnippets,
  ResponseString
} from 'services/cd-ng'
import YamlBuilder from 'modules/10-common/components/YAMLBuilder/YamlBuilder'
import { getValidationErrorMessagesForToaster } from 'modules/10-common/components/YAMLBuilder/YAMLBuilderUtils'
import TestConnection from '@connectors/components/TestConnection/TestConnection'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/10-common/interfaces/YAMLBuilderProps'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import { useGetYamlSchema } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import { PageSpinner } from '@common/components'
import { useStrings } from 'framework/exports'
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
  mockSchemaData?: UseGetMockData<ResponseJsonNode>
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
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const { getString } = useStrings()

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
    setIsUpdating(true)
    try {
      const data = await props.updateConnector(connectorPayload)
      if (data) {
        showSuccess(i18n.SaveConnector.SUCCESS)
        props.refetchConnector()
        state.setEnableEdit(false)
      }
    } catch (error) {
      if (error.data?.message) {
        showError(error.data?.message)
      } else {
        showError(getString('somethingWentWrong'))
      }
    }
    setIsUpdating(false)
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

  /* excluding below method from coverage since it's called only by YAMLBuilder */
  /* istanbul ignore next */
  const handleSaveYaml = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.stopPropagation()
    event.preventDefault()
    const { getLatestYaml, getYAMLValidationErrorMap } = yamlHandler || {}
    const yamlString = getLatestYaml?.() || ''
    try {
      const connectorJSONEq = parse(yamlString)
      if (connectorJSONEq) {
        const errorMap = getYAMLValidationErrorMap?.()
        if (errorMap && errorMap.size > 0) {
          showError(getString('connectors.yamlError'))
        } else {
          onSubmit(connectorJSONEq)
        }
        setConnector(connectorJSONEq?.connector)
        setConnectorForYaml(connectorJSONEq?.connector)
      }
    } catch (err) {
      if (err?.toString().includes('YAMLSemanticError')) {
        showError(getString('connectors.yamlError'))
        return
      }
      const { name, message } = err
      if (name && message) {
        showError(`${name}: ${message}`)
      } else {
        showError(getString('somethingWentWrong'))
      }
    }
  }

  const yamlBuilderReadOnlyModeProps: YamlBuilderProps = {
    fileName: `${connectorForYaml?.identifier ?? 'Connector'}.yaml`,
    entityType: 'Connectors',
    existingJSON: { connector: connectorForYaml },
    bind: setYamlHandler,
    isReadOnlyMode: true
  }

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      state.setEnableEdit(false)
      props.refetchConnector()
    },
    onClose: () => {
      state.setEnableEdit(false)
      props.refetchConnector()
    }
  })

  useEffect(() => {
    if (props.response.connector) {
      setConnector(props.response.connector)
      setConnectorForYaml(props.response.connector)
    }
  }, [props.response])

  const { data: snippet, refetch } = useGetYamlSnippet({
    identifier: '',
    requestOptions: { headers: { accept: 'application/json' } },
    lazy: true,
    mock: props.mockSnippetData
  })

  useEffect(() => {
    setSnippetYaml(snippet?.data)
  }, [snippet])

  const onSnippetCopy = async (identifier: string): Promise<void> => {
    await refetch({
      pathParams: {
        identifier
      }
    })
  }

  const { data: snippetMetaData, loading: isFetchingSnippets } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags('Connectors', props.type)
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } },
    mock: props.mockMetaData
  })

  const { data: connectorSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Connectors'
    },
    mock: props.mockSchemaData
  })

  const renderDetailsSection = (): JSX.Element => {
    return (
      <RenderDetailsSection
        title={i18n.title.connectorActivity}
        data={getActivityDetails({
          createdAt: props.response.createdAt || 0,
          lastTested: lastTested || props.response.status?.lastTestedAt || 0,
          lastUpdated: (props.response.lastModifiedAt as number) || 0,
          lastConnectionSuccess: lastConnected || props.response.status?.lastConnectedAt || 0,
          status: status || props.response.status?.status || ''
        })}
      />
    )
  }

  const { openDialog } = useConfirmationDialog({
    cancelButtonText: getString('cancel'),
    contentText: getString('continueWithoutSavingText'),
    titleText: getString('continueWithoutSavingTitle'),
    confirmButtonText: getString('confirm'),
    onCloseDialog: isConfirmed => {
      if (isConfirmed) {
        setEnableEdit(false)
      }
    }
  })

  const resetEditor = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.preventDefault()
    event.stopPropagation()
    openDialog()
  }

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
            id="editDetailsBtn"
            className={css.editButton}
            text={i18n.EDIT_DETAILS}
            icon="edit"
            onClick={() => {
              state.setEnableEdit(true)
              selectedView === SelectedView.VISUAL ? openConnectorModal(true, props.type, connector) : undefined
            }}
          />
        )}
      </Container>

      <Layout.Horizontal>
        {isUpdating ? <PageSpinner message={getString('connectors.updating')} /> : null}
        {enableEdit ? (
          selectedView === SelectedView.VISUAL ? null : isFetchingSnippets ? (
            <PageSpinner />
          ) : (
            <div className={css.fullWidth}>
              <YamlBuilder
                {...Object.assign(yamlBuilderReadOnlyModeProps, { height: 550 })}
                snippets={snippetMetaData?.data?.yamlSnippets}
                onSnippetCopy={onSnippetCopy}
                snippetYaml={snippetYaml}
                schema={connectorSchema?.data}
                isReadOnlyMode={false}
              />
              <Layout.Horizontal spacing="small">
                <Button
                  id="saveYAMLChanges"
                  intent="primary"
                  text={getString('saveChanges')}
                  onClick={handleSaveYaml}
                  margin={{ top: 'large' }}
                  title={isValidYAML ? '' : i18n.invalidYAML}
                />
                <Button text={getString('cancel')} margin={{ top: 'large' }} onClick={resetEditor} />
              </Layout.Horizontal>
            </div>
          )
        ) : selectedView === SelectedView.VISUAL ? (
          <>
            <SavedConnectorDetails connector={connector}></SavedConnectorDetails>
            <Container className={css.connectorDetailsWrapper}>
              <Layout.Vertical>
                {renderDetailsSection()}
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
          <Layout.Horizontal spacing="medium" className={css.fullWidth}>
            <div className={css.yamlView}>
              <YamlBuilder {...yamlBuilderReadOnlyModeProps} showSnippetSection={false} />
            </div>
            <div className={css.fullWidth}>{renderDetailsSection()}</div>
          </Layout.Horizontal>
        )}
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default ConnectorView
