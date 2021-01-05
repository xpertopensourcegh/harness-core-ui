import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { parse } from 'yaml'
import cx from 'classnames'
import { omit, without } from 'lodash-es'
import { Layout, Text, Color, Container, Button } from '@wings-software/uicore'

import {
  useGetSecretV2,
  SecretTextSpecDTO,
  usePutSecretViaYaml,
  ResponseSecretResponseWrapper,
  ResponsePageConnectorResponse,
  useGetYamlSchema
} from 'services/cd-ng'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { PageError } from '@common/components/Page/PageError'
import { PageHeader } from '@common/components/Page/PageHeader'
import YamlBuilder from '@common/components/YAMLBuilder/YamlBuilder'
import type { YamlBuilderHandlerBinding } from '@common/interfaces/YAMLBuilderProps'
import { useToaster } from '@common/exports'
import routes from '@common/RouteDefinitions'

import type { UseGetMockData } from '@common/utils/testUtils'
import useCreateSSHCredModal from '@secrets/modals/CreateSSHCredModal/useCreateSSHCredModal'
import useCreateUpdateSecretModal from '@secrets/modals/CreateSecretModal/useCreateUpdateSecretModal'
import ViewSecretDetails from './views/ViewSecretDetails'

import i18n from './SecretDetails.i18n'
import css from './SecretDetails.module.scss'

enum Mode {
  VISUAL,
  YAML
}

interface OptionalIdentifiers {
  orgIdentifier?: string
  accountId: string
}

interface SecretDetailsProps {
  mockSecretDetails?: UseGetMockData<ResponseSecretResponseWrapper>
  connectorListMockData?: UseGetMockData<ResponsePageConnectorResponse>
  mockKey?: ResponseSecretResponseWrapper
  mockPassword?: ResponseSecretResponseWrapper
  mockPassphrase?: ResponseSecretResponseWrapper
}

const getConnectorsUrl = ({ orgIdentifier, accountId }: OptionalIdentifiers): string => {
  if (orgIdentifier) return routes.toOrgResourcesConnectors({ orgIdentifier, accountId })
  return routes.toResourcesConnectors({ accountId })
}

const getSecretsUrl = ({ orgIdentifier, accountId }: OptionalIdentifiers): string => {
  if (orgIdentifier) return routes.toOrgResourcesSecretsListing({ orgIdentifier, accountId })
  return routes.toResourcesSecretsListing({ accountId })
}

const SecretDetails: React.FC<SecretDetailsProps> = props => {
  const { accountId, projectIdentifier, orgIdentifier, secretId } = useParams()
  const { showSuccess, showError } = useToaster()
  const [edit, setEdit] = useState<boolean>()
  const [mode, setMode] = useState<Mode>(Mode.VISUAL)
  const [fieldsRemovedFromYaml, setFieldsRemovedFromYaml] = useState(['draft', 'createdAt', 'updatedAt'])
  const [yamlHandler, setYamlHandler] = React.useState<YamlBuilderHandlerBinding | undefined>()
  const { loading, data, refetch, error } = useGetSecretV2({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId, projectIdentifier: projectIdentifier, orgIdentifier: orgIdentifier },
    mock: props.mockSecretDetails
  })
  const { mutate: updateSecretYaml } = usePutSecretViaYaml({
    identifier: secretId,
    queryParams: { accountIdentifier: accountId },
    requestOptions: { headers: { 'content-type': 'application/yaml' } }
  })

  const { data: secretSchema } = useGetYamlSchema({
    queryParams: {
      entityType: 'Secrets'
    }
  })

  const [secretData, setSecretData] = useState(data?.data)
  const { openCreateSSHCredModal } = useCreateSSHCredModal({ onSuccess: refetch })
  const { openCreateSecretModal } = useCreateUpdateSecretModal({ onSuccess: refetch })
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
        setEdit(false)
        refetch()
      } catch (err) {
        showError(err.data.message)
      }
    }
  }

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

  if (loading) return <PageSpinner />
  if (error) return <PageError message={error.message} onClick={() => refetch()} />
  if (!secretData) return <div>No Data</div>

  return (
    <>
      <PageHeader
        title={
          <Layout.Vertical>
            <div>
              <Link to={getConnectorsUrl({ orgIdentifier, accountId })}>{i18n.linkResources}</Link> /{' '}
              <Link to={getSecretsUrl({ orgIdentifier, accountId })}>{i18n.linkSecrets}</Link>
            </div>
            <Text font={{ size: 'medium' }} color={Color.BLACK}>
              {data?.data?.secret.name || 'Secret Details'}
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
                mode === Mode.VISUAL
                  ? secretData.secret.type === 'SSHKey'
                    ? openCreateSSHCredModal(data?.data?.secret)
                    : openCreateSecretModal(secretData.secret.type, secretData)
                  : setEdit(true)
              }}
            />
          )}
        </Layout.Horizontal>
        {mode === Mode.YAML ? (
          edit ? (
            <Container>
              <YamlBuilder
                entityType={'Secrets'}
                fileName={`${secretData.secret.name}.yaml`}
                // existingJson={}
                // fieldRemovedFromYaml={[]}
                existingJSON={omit(secretData, fieldsRemovedFromYaml)}
                bind={setYamlHandler}
                schema={secretSchema?.data || ''}
              />
              <Button intent="primary" text="Save" onClick={handleSaveYaml} margin={{ top: 'large' }} />
            </Container>
          ) : (
            <Container>
              <YamlBuilder
                entityType={'Secrets'}
                existingJSON={omit(secretData, fieldsRemovedFromYaml)}
                fileName={`${secretData.secret.name}.yaml`}
                isReadOnlyMode={true}
                showSnippetSection={false}
                bind={setYamlHandler}
              />
            </Container>
          )
        ) : (
          //View in Visual Mode
          <ViewSecretDetails secret={secretData} />
        )}
      </Container>
    </>
  )
}

export default SecretDetails
