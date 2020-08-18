import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import { parse as parseQueryString } from 'query-string'
import { stringify, parse } from 'yaml'
import cx from 'classnames'
import { Layout, Text, Color, Container, Button, IconName } from '@wings-software/uikit'

import { useGetSecret, usePutSecretTextViaYaml, usePutSecretFileViaYaml } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import { linkTo } from 'framework/exports'
import { routeResources } from 'modules/common/routes'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { YAMLService } from 'modules/dx/services'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import { useToaster } from 'modules/common/exports'
import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import { routeSecretDetails } from 'modules/dx/routes'

import ViewSecretDetails from './views/ViewSecretDetails'

import i18n from './SecretDetails.i18n'
import css from './SecretDetails.module.scss'

enum Mode {
  VISUAL,
  YAML
}

const SecretDetails: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier, secretId } = useParams()
  const { search: queryParams, pathname } = useLocation()
  const { showSuccess, showError } = useToaster()
  const history = useHistory()
  const { edit } = parseQueryString(queryParams)
  const [mode, setMode] = useState<Mode>(Mode.VISUAL)
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { loading, data, refetch, error } = useGetSecret({
    identifier: secretId,
    queryParams: { account: accountId, project: projectIdentifier, org: orgIdentifier }
  })
  const { mutate: updateSecretText } = usePutSecretTextViaYaml({
    identifier: secretId,
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })
  const { mutate: updateSecretFile } = usePutSecretFileViaYaml({
    identifier: secretId,
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const [secretData, setSecretData] = useState(data?.data)

  const handleSaveYaml = async (): Promise<void> => {
    const yamlData = yamlHandler?.getLatestYaml()
    let jsonData
    try {
      jsonData = parse(yamlData || '')
    } catch (err) {
      showError(err.message)
    }

    if (yamlData && jsonData) {
      try {
        if (jsonData['type'] === 'SecretText') {
          await updateSecretText(yamlData as any)
        }
        if (jsonData['type'] === 'SecretFile') {
          await updateSecretFile(yamlData as any)
        }
        showSuccess('Secret updated successfully')
        history.push(linkTo(routeSecretDetails, { secretId }))
      } catch (err) {
        showError(err.message)
      }
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
    const { error: apiError, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.SECRET, query)
    if (apiError) {
      showError(apiError)
      return
    }
    addIconInfoToSnippets(snippetsList, 'command-shell-script')
    setSnippets(snippetsList)
  }

  React.useEffect(() => {
    fetchSnippets()
  })

  useEffect(() => {
    setSecretData(data?.data)
  }, [data?.data])

  useEffect(() => {
    if (mode === Mode.VISUAL) {
      const yamlData = parse(yamlHandler?.getLatestYaml() || '')
      if (yamlData) {
        setSecretData(yamlData)
      }
    }
  }, [mode, yamlHandler?.getLatestYaml])

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!secretData) return <div>No Data</div>

  return (
    <>
      <PageHeader
        title={
          <Layout.Vertical>
            <div>
              <Link to={linkTo(routeResources)}>{i18n.linkResources}</Link> /{' '}
              <Link to={linkTo(routeResources) + '/secrets'}>{i18n.linkSecrets}</Link>
            </div>
            <Text font={{ size: 'medium' }} color={Color.BLACK}>
              {secretData.name}
            </Text>
          </Layout.Vertical>
        }
      />
      <Container padding="large">
        <div className={css.switch}>
          <div className={cx(css.item, { [css.selected]: mode === Mode.VISUAL })} onClick={() => setMode(Mode.VISUAL)}>
            Visual
          </div>
          <div className={cx(css.item, { [css.selected]: mode === Mode.YAML })} onClick={() => setMode(Mode.YAML)}>
            YAML
          </div>
        </div>
        <Layout.Horizontal spacing="medium" margin={{ bottom: 'large', top: 'large' }} style={{ alignItems: 'center' }}>
          <Text font={{ size: 'medium' }} color={Color.BLACK}>
            {i18n.title}
          </Text>
          {edit ? null : (
            <Button
              text={i18n.buttonEdit}
              icon="edit"
              onClick={() => {
                history.push({
                  pathname,
                  search: '?edit=true'
                })
              }}
            />
          )}
        </Layout.Horizontal>
        {edit ? (
          mode === Mode.VISUAL ? (
            <Container width="400px">
              <CreateUpdateSecret secret={secretData} type={secretData.type} />
            </Container>
          ) : (
            <Container>
              <YamlBuilder
                entityType={YamlEntity.SECRET}
                fileName={`${secretData.name}.yaml`}
                existingYaml={stringify(secretData)}
                snippets={snippets}
                bind={setYamlHandler}
              />
              <Button intent="primary" text="Save" />
            </Container>
          )
        ) : mode === Mode.VISUAL ? (
          <ViewSecretDetails secret={secretData} />
        ) : (
          <Container>
            <YamlBuilder
              entityType={YamlEntity.SECRET}
              fileName={`${secretData.name}.yaml`}
              existingYaml={stringify(secretData)}
              isReadOnlyMode={true}
              showSnippetsSection={false}
            />
            <Button intent="primary" text="Save" onClick={handleSaveYaml} />
          </Container>
        )}
      </Container>
    </>
  )
}

export default SecretDetails
