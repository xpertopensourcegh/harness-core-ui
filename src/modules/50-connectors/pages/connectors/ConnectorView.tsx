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
  ResponseYamlSnippets,
  ResponseString
} from 'services/cd-ng'
import YamlBuilder from 'modules/10-common/components/YAMLBuilder/YamlBuilder'
import TestConnection from '@connectors/components/TestConnection/TestConnection'
import type { YamlBuilderHandlerBinding, YamlBuilderProps } from 'modules/10-common/interfaces/YAMLBuilderProps'
import useCreateConnectorModal from '@connectors/modals/ConnectorModal/useCreateConnectorModal'
import { useGetYamlSchema } from 'services/cd-ng'
import type { UseGetMockData } from 'modules/10-common/utils/testUtils'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import { PageSpinner } from '@common/components'
import { useStrings } from 'framework/exports'
import { getUrlValueByType } from './utils/ConnectorUtils'
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
}

const SelectedView = {
  VISUAL: 'VISUAL',
  YAML: 'YAML'
}

export interface ConnectorContextInterface {
  setYamlHandler: (yamlHandler: YamlBuilderHandlerBinding) => void
}

const ConnectorContext = React.createContext<ConnectorContextInterface>({
  setYamlHandler: () => undefined
})

const ConnectorView: React.FC<ConnectorViewProps> = props => {
  const [enableEdit, setEnableEdit] = useState(false)

  const [selectedView, setSelectedView] = useState(SelectedView.VISUAL)
  const [connector, setConnector] = useState<ConnectorInfoDTO>(props.response?.connector || ({} as ConnectorInfoDTO))
  const [connectorForYaml, setConnectorForYaml] = useState<ConnectorInfoDTO>(
    props.response?.connector || ({} as ConnectorInfoDTO)
  )

  const { setYamlHandler: setYamlHandlerContext } = React.useContext(ConnectorContext)
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const [isValidYAML] = React.useState<boolean>(true)
  const [snippetYaml, setSnippetYaml] = React.useState<string>()
  const [isUpdating, setIsUpdating] = React.useState<boolean>(false)
  const { getString } = useStrings()
  const isHarnessManaged = props.response.harnessManaged

  React.useEffect(() => {
    if (yamlHandler) {
      setYamlHandlerContext(yamlHandler)
    }
  }, [yamlHandler, setYamlHandlerContext])

  const state: ConnectorViewState = {
    enableEdit,
    setEnableEdit,
    connector,
    setConnector,
    selectedView,
    setSelectedView
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
    } /* istanbul ignore next */ catch (error) {
      if (error.data?.message) {
        showError(error.data?.message)
      } else {
        showError(getString('somethingWentWrong'))
      }
    }
    setIsUpdating(false)
  }

  const handleModeSwitch = (targetMode: string): void => {
    if (targetMode === SelectedView.VISUAL) {
      try {
        const connectorJSONEq = props.response?.connector || ({} as ConnectorInfoDTO)
        setSelectedView(targetMode)
        setConnector(connectorJSONEq)
        setConnectorForYaml(connectorJSONEq)
      } /* istanbul ignore next */ catch (err) {
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
    } /* istanbul ignore next */ catch (err) {
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
    fileName: `${connectorForYaml?.name ?? 'Connector'}.yaml`,
    entityType: 'Connectors',
    existingJSON: { connector: connectorForYaml },
    isReadOnlyMode: true
  }

  const { openConnectorModal } = useCreateConnectorModal({
    onSuccess: () => {
      // Note: coonector successfilly created/updated but modal shold not be closed
      // as verify connection is in progress
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
    // queryParams: {
    //   projectIdentifier,
    //   orgIdentifier,
    //   scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
    // }
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
      // projectIdentifier,
      // orgIdentifier,
      // scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
    },
    mock: props.mockSchemaData
  })

  const renderDetailsSection = (): JSX.Element => {
    return (
      <RenderDetailsSection
        title={i18n.title.connectorActivity}
        data={getActivityDetails({
          createdAt: props.response.createdAt || 0,
          lastTested: props.response.status?.lastTestedAt || 0,
          lastUpdated: (props.response.lastModifiedAt as number) || 0,
          lastConnectionSuccess: props.response.status?.lastConnectedAt || 0,
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
        setConnectorForYaml(props.response?.connector || ({} as ConnectorInfoDTO))
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
        {state.enableEdit || isHarnessManaged ? null : (
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
                bind={setYamlHandler}
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
                  connectorIdentifier={connector?.identifier || ''}
                  // ToDo:  delegateName={connector?.spec?.credential?.spec?.delegateName || ''}

                  url={getUrlValueByType(connector?.type || '', connector)}
                  refetchConnector={props.refetchConnector}
                  connectorType={connector?.type || ''}
                />
              </Layout.Vertical>
            </Container>
          </>
        ) : (
          <Layout.Horizontal spacing="medium" className={css.fullWidth}>
            <div className={css.yamlView}>
              <YamlBuilder
                {...yamlBuilderReadOnlyModeProps}
                showSnippetSection={false}
                onEnableEditMode={() => setEnableEdit(true)}
              />
            </div>
            <div className={css.fullWidth}>{renderDetailsSection()}</div>
          </Layout.Horizontal>
        )}
      </Layout.Horizontal>
    </Layout.Vertical>
  )
}

export default ConnectorView
