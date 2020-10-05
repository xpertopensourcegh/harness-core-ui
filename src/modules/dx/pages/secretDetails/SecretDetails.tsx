import React, { useState, useEffect } from 'react'
import { useParams, Link, useLocation, useHistory } from 'react-router-dom'
import { parse as parseQueryString } from 'query-string'
import { parse } from 'yaml'
import cx from 'classnames'
import { omit, without, pick } from 'lodash-es'
import { Layout, Text, Color, Container, Button } from '@wings-software/uikit'

import { useGetSecretV2, SecretTextSpecDTO, usePutSecretViaYaml } from 'services/cd-ng'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import { PageHeader } from 'modules/common/components/Page/PageHeader'
import { routeResources } from 'modules/common/routes'
import YamlBuilder from 'modules/common/components/YAMLBuilder/YamlBuilder'
import { addIconInfoToSnippets } from 'modules/common/components/YAMLBuilder/YAMLBuilderUtils'
import type { YamlBuilderHandlerBinding } from 'modules/common/interfaces/YAMLBuilderProps'
import { YamlEntity } from 'modules/common/constants/YamlConstants'
import { YAMLService } from 'modules/dx/services'
import type { SnippetInterface } from 'modules/common/interfaces/SnippetInterface'
import { useToaster } from 'modules/common/exports'
import CreateUpdateSecret from 'modules/dx/components/CreateUpdateSecret/CreateUpdateSecret'
import { routeSecretDetails } from 'modules/dx/routes'

import EditSSHSecret from './views/EditSSHSecret'
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
  const [fieldsRemovedFromYaml, setFieldsRemovedFromYaml] = useState(['secret.spec.draft', 'createdAt', 'updatedAt'])
  const [snippets, setSnippets] = useState<SnippetInterface[]>()
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { loading, data, refetch, error } = useGetSecretV2({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId, projectIdentifier: projectIdentifier, orgIdentifier: orgIdentifier }
  })
  const { mutate: updateSecretYaml } = usePutSecretViaYaml({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId },
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
        await updateSecretYaml(yamlData as any)
        showSuccess(i18n.updateSuccess)
        history.push(routeSecretDetails.url({ secretId }))
      } catch (err) {
        showError(err.message)
      }
    }
  }

  const fetchSnippets = (query?: string): void => {
    const { error: apiError, response: snippetsList } = YAMLService.fetchSnippets(YamlEntity.SECRET, query) || {}

    if (apiError) {
      showError(apiError)
      return
    }
    addIconInfoToSnippets('command-shell-script', snippetsList)
    setSnippets(snippetsList)
  }

  React.useEffect(() => {
    fetchSnippets()
  })

  useEffect(() => {
    setSecretData(data?.data)
  }, [data?.data])

  useEffect(() => {
    if (secretData?.secret.type === 'SecretText') {
      switch ((secretData?.secret.spec as SecretTextSpecDTO)?.valueType) {
        case 'Inline':
          setFieldsRemovedFromYaml([...fieldsRemovedFromYaml, 'secret.spec.value'])
          break
        case 'Reference':
          // 'value' field should be persisted in visual->yaml transistion for reference type
          setFieldsRemovedFromYaml(without(fieldsRemovedFromYaml, 'secret.spec.value'))
          break
      }
    }
  }, [secretData])

  const handleModeSwitch = (targetMode: Mode): void => {
    if (targetMode === Mode.VISUAL) {
      const yamlString = yamlHandler?.getLatestYaml() || ''
      try {
        const yamlData = parse(yamlString)
        if (yamlData) {
          setSecretData(yamlData)
          setMode(targetMode)
        } else {
          showError(i18n.noYaml)
        }
      } catch (err) {
        showError(`${err.name}: ${err.message}`)
      }
    } else {
      setMode(targetMode)
    }
  }

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!secretData) return <div>No Data</div>

  return (
    <>
      <PageHeader
        title={
          <Layout.Vertical>
            <div>
              <Link to={routeResources.url()}>{i18n.linkResources}</Link> /{' '}
              <Link to={routeResources.url() + '/secrets'}>{i18n.linkSecrets}</Link>
            </div>
            <Text font={{ size: 'medium' }} color={Color.BLACK}>
              {data?.data?.secret.name || 'Secret Details'}
            </Text>
          </Layout.Vertical>
        }
      />
      <Container padding="large">
        <div className={css.switch}>
          <div
            className={cx(css.item, { [css.selected]: mode === Mode.VISUAL })}
            onClick={() => handleModeSwitch(Mode.VISUAL)}
          >
            Visual
          </div>
          <div
            className={cx(css.item, { [css.selected]: mode === Mode.YAML })}
            onClick={() => handleModeSwitch(Mode.YAML)}
          >
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
          // EDIT in VISUAL mode
          mode === Mode.VISUAL ? (
            <Container>
              {secretData.secret.type === 'SSHKey' ? (
                <EditSSHSecret
                  secret={secretData}
                  onChange={secret => setSecretData({ secret, ...pick(secretData, ['createdAt', 'updatedAt']) })}
                />
              ) : null}
              {secretData.secret.type === 'SecretFile' || secretData.secret.type === 'SecretText' ? (
                <Container width="400px">
                  <CreateUpdateSecret
                    secret={secretData}
                    onChange={secret => setSecretData({ secret, ...pick(secretData, ['createdAt', 'updatedAt']) })}
                    onSuccess={() => {
                      history.push(routeSecretDetails.url({ secretId }))
                    }}
                  />
                </Container>
              ) : null}
            </Container>
          ) : (
            // EDIT in YAML mode
            <Container>
              <YamlBuilder
                entityType={YamlEntity.SECRET}
                fileName={`${secretData.secret.name}.yaml`}
                // existingJson={}
                // fieldRemovedFromYaml={[]}
                existingJSON={omit(secretData, fieldsRemovedFromYaml)}
                snippets={snippets}
                bind={setYamlHandler}
              />
              <Button intent="primary" text="Save" onClick={handleSaveYaml} margin={{ top: 'large' }} />
            </Container>
          )
        ) : mode === Mode.VISUAL ? (
          // VIEW in VISUAL mode
          <ViewSecretDetails secret={secretData} />
        ) : (
          // VIEW in YAML mode
          <Container>
            <YamlBuilder
              entityType={YamlEntity.SECRET}
              existingJSON={omit(secretData, fieldsRemovedFromYaml)}
              fileName={`${secretData.secret.name}.yaml`}
              isReadOnlyMode={true}
              showSnippetSection={false}
              bind={setYamlHandler}
            />
          </Container>
        )}
      </Container>
    </>
  )
}

export default SecretDetails
