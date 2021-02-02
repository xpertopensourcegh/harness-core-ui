import React, { useState, useEffect } from 'react'
import { Container, Button, Layout } from '@wings-software/uicore'
import { parse } from 'yaml'
import { useHistory, useParams } from 'react-router-dom'
import { CompletionItemKind } from 'vscode-languageserver-types'

import YAMLBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import { PageBody } from '@common/components/Page/PageBody'
import { PageHeader } from '@common/components/Page/PageHeader'
import type {
  CompletionItemInterface,
  InvocationMapFunction,
  YamlBuilderHandlerBinding,
  YamlBuilderProps
} from '@common/interfaces/YAMLBuilderProps'
import {
  useCreateConnector,
  useGetYamlSnippetMetadata,
  useGetYamlSchema,
  useGetYamlSnippet,
  useListSecretsV2
} from 'services/cd-ng'
import { getReference } from '@secrets/utils/SSHAuthUtils'
import { useToaster, useConfirmationDialog } from '@common/exports'
import { getSnippetTags } from '@common/utils/SnippetUtils'
import routes from '@common/RouteDefinitions'
import { PageSpinner } from '@common/components'
import { useStrings } from 'framework/exports'
import { getScopeFromDTO } from '@common/components/EntityReference/EntityReference'
import { getInvocationPathsForSecrets } from '../connectors/utils/ConnectorUtils'
import i18n from './CreateConnectorFromYaml.i18n'

const CreateConnectorFromYamlPage: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const [yamlHandler, setYamlHandler] = useState<YamlBuilderHandlerBinding | undefined>()
  const history = useHistory()
  const { showSuccess, showError } = useToaster()
  const { mutate: createConnector } = useCreateConnector({ queryParams: { accountIdentifier: accountId } })
  const [snippetYaml, setSnippetYaml] = React.useState<string>()
  const [needEditorReset, setNeedEditorReset] = React.useState<boolean>(false)
  const { getString } = useStrings()

  const rerouteBasedOnContext = (connectorId: string): void => {
    if (projectIdentifier && orgIdentifier) {
      history.push(routes.toCDResourcesConnectorDetails({ projectIdentifier, orgIdentifier, connectorId, accountId }))
    } else if (orgIdentifier) {
      history.push(routes.toOrgResourcesConnectorDetails({ orgIdentifier, connectorId, accountId }))
    } else {
      history.push(routes.toResourcesConnectorDetails({ connectorId, accountId }))
    }
  }

  const handleCreate = async (): Promise<void> => {
    const yamlData = yamlHandler?.getLatestYaml()
    let jsonData
    try {
      jsonData = parse(yamlData || '')
    } catch (err) {
      showError(err.message)
    }

    if (yamlData && jsonData) {
      try {
        const { status } = await createConnector(jsonData as any)
        if (status !== 'ERROR') {
          showSuccess(i18n.successfullyCreated)
          rerouteBasedOnContext(jsonData.connector?.['identifier'])
        } else {
          showError(getString('somethingWentWrong'))
        }
      } catch (err) {
        if (err?.data?.message) {
          showError(err?.data?.message)
          return
        }
        if (err?.message) {
          showError(err?.message)
          return
        }
      }
    }
  }

  const { data: snippet, refetch } = useGetYamlSnippet({
    identifier: '',
    requestOptions: { headers: { accept: 'application/json' } },
    lazy: true,
    queryParams: {
      projectIdentifier,
      orgIdentifier,
      scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
    }
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

  const { data: snippetData, loading } = useGetYamlSnippetMetadata({
    queryParams: {
      tags: getSnippetTags('Connectors')
    },
    queryParamStringifyOptions: {
      arrayFormat: 'repeat'
    },
    requestOptions: { headers: { accept: 'application/json' } }
  })

  const { data: connectorSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Connectors',
      projectIdentifier,
      orgIdentifier,
      scope: getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })
    }
  })

  const { openDialog } = useConfirmationDialog({
    cancelButtonText: getString('cancel'),
    contentText: getString('continueWithoutSavingText'),
    titleText: getString('continueWithoutSavingTitle'),
    confirmButtonText: getString('confirm'),
    onCloseDialog: isConfirmed => {
      if (isConfirmed) {
        setNeedEditorReset(true)
      }
    }
  })

  const resetEditor = (event: React.MouseEvent<Element, MouseEvent>): void => {
    event.preventDefault()
    event.stopPropagation()
    openDialog()
  }

  const { data: secretsResponse } = useListSecretsV2({
    queryParams: {
      accountIdentifier: accountId,
      pageIndex: 0,
      pageSize: 100,
      orgIdentifier,
      projectIdentifier
    },
    debounce: 300
  })

  const currentScope = getScopeFromDTO({ accountIdentifier: accountId, orgIdentifier, projectIdentifier })

  const secrets: CompletionItemInterface[] = React.useMemo(() => {
    return (
      secretsResponse?.data?.content?.map(item => ({
        label: getReference(currentScope, item.secret.name) || /* istanbul ignore next */ '',
        insertText: getReference(currentScope, item.secret.identifier) || /* istanbul ignore next */ '',
        kind: CompletionItemKind.Enum,
        key: item.secret.identifier
      })) || []
    )
  }, [secretsResponse?.data?.content?.map])

  const invocationMap: YamlBuilderProps['invocationMap'] = new Map<RegExp, InvocationMapFunction>()
  getInvocationPathsForSecrets('Unknown')?.forEach((path: RegExp) =>
    invocationMap.set(
      path,
      (_matchingPath: string, _currentYaml: string): Promise<CompletionItemInterface[]> => Promise.resolve(secrets)
    )
  )

  return (
    <>
      <PageHeader title={i18n.title} />
      <PageBody>
        <Container padding="xlarge">
          {loading ? (
            <PageSpinner />
          ) : (
            <YAMLBuilder
              fileName={i18n.newConnector}
              entityType="Connectors"
              bind={setYamlHandler}
              showIconMenu={true}
              snippets={snippetData?.data?.yamlSnippets}
              schema={connectorSchema?.data || ''}
              onSnippetCopy={onSnippetCopy}
              snippetYaml={snippetYaml}
              needEditorReset={needEditorReset}
              invocationMap={invocationMap}
            />
          )}
          <Layout.Horizontal spacing="small">
            <Button
              text={getString('saveChanges')}
              intent="primary"
              margin={{ top: 'xlarge' }}
              onClick={handleCreate}
            />
            <Button text={getString('cancel')} margin={{ top: 'xlarge' }} onClick={resetEditor} />
          </Layout.Horizontal>
        </Container>
      </PageBody>
    </>
  )
}

export default CreateConnectorFromYamlPage
