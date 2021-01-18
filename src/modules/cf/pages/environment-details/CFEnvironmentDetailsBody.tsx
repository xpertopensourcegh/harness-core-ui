import React, { useContext, useMemo, useRef, useState } from 'react'
import { Tabs, Tab, Text, Container, Layout, Button, Heading, Color } from '@wings-software/uicore'
import { get } from 'lodash-es'
import type { Column } from 'react-table'
import type { EnvironmentResponseDTO } from 'services/cd-ng'
import { ApiKey, useGetAllAPIKeys, useDeleteApiKey } from 'services/cf'
import { useToaster } from '@common/exports'
import Table from '@common/components/Table/Table'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { PageError } from '@common/components/Page/PageError'
import { useEnvStrings } from '@cf/hooks/environment'
import { withTableData } from '../../utils/table-utils'
import { default as Nav } from './VerticalNav'
import AddKeyDialog from '../../components/AddKeyDialog/AddKeyDialog'
import css from './CFEnvironmentDetails.module.scss'

type CustomColumn<T extends Record<string, any>> = Column<T>

const PAGE_SIZE = 5
const CLIENT = 'Client'

type RowFunctions = {
  isNew: (id: string) => boolean
  onDelete: (id: string) => void
  getSecret: (id: string, fallback: string) => string
}
const defaultContext = { isNew: () => false, onDelete: () => false, getSecret: () => '' }
const RowContext = React.createContext<RowFunctions>(defaultContext)

const withApiKey = withTableData<ApiKey, { apiKey: ApiKey }>(({ row }) => ({ apiKey: row.original }))

const NameCell = withApiKey(({ apiKey }) => <Text font={{ weight: 'bold' }}>{apiKey.name}</Text>)
const TypeCell = withApiKey(({ apiKey }) => {
  const { getEnvString } = useEnvStrings()

  return <Text>{getEnvString(`apiKeys.${apiKey.type.toLowerCase()}Type`)}</Text>
})

const ApiInfoCell = withApiKey(({ apiKey }) => {
  const { isNew, onDelete, getSecret } = useContext(RowContext) ?? defaultContext
  const { getString, getEnvString } = useEnvStrings()
  const textRef = useRef<HTMLDivElement>(null)

  const showCopy = isNew(apiKey.identifier) || apiKey.type === CLIENT

  const handleCopy = () => {
    navigator.clipboard.writeText(textRef.current?.innerText || '')
  }

  return (
    <Layout.Horizontal flex={{ distribution: 'space-between' }}>
      <Layout.Horizontal spacing="small" style={{ alignItems: 'center' }}>
        <Text font={{ weight: 'bold' }}>
          {apiKey.type === CLIENT ? getEnvString(`apiKeys.clientId`) : getString('secretType')}
        </Text>
        {showCopy ? (
          <div ref={textRef}>
            <Text
              rightIcon="copy"
              rightIconProps={{ onClick: handleCopy, color: Color.GREY_600, style: { cursor: 'pointer' } }}
              background={Color.GREY_200}
              padding="xsmall"
              style={{ borderRadius: '4px' }}
            >
              {getSecret(apiKey.identifier, apiKey.apiKey)}
            </Text>
          </div>
        ) : (
          <Text>{apiKey.apiKey}</Text>
        )}
      </Layout.Horizontal>
      <Container>
        <Button
          minimal
          icon="trash"
          tooltip={
            <Container width="350px" padding="medium">
              <Heading level={2} font={{ weight: 'semi-bold' }} margin={{ bottom: 'small' }}>
                {getEnvString('apiKeys.deleteTitle')}
              </Heading>
              <Text margin={{ bottom: 'medium' }}>
                {getEnvString('apiKeys.deleteMessage', { keyName: apiKey.name })}
              </Text>
              <Container flex>
                <span />
                <Layout.Horizontal spacing="small">
                  <Button text={getString('cancel')} className="bp3-popover-dismiss" />
                  <Button
                    intent="danger"
                    text={getString('delete')}
                    className="bp3-popover-dismiss"
                    onClick={() => onDelete(apiKey.identifier)}
                  />
                </Layout.Horizontal>
              </Container>
            </Container>
          }
          tooltipProps={{
            interactionKind: 'click'
          }}
        />
      </Container>
    </Layout.Horizontal>
  )
})

const PlaceholderComp: React.FC<{}> = () => <Text>To be implemented</Text>
const FeatureFlagsTab: React.FC<{ environment: EnvironmentResponseDTO }> = ({ environment }) => {
  const { showSuccess, showError } = useToaster()
  const { getString, getEnvString } = useEnvStrings()
  const [recents, setRecents] = useState<ApiKey[]>([])
  const [page, setPage] = useState<number>(0)

  const queryParams = {
    project: environment.projectIdentifier as string,
    environment: environment.identifier as string,
    account: environment.accountId as string,
    org: environment.orgIdentifier as string
  }

  const { data, loading, error, refetch } = useGetAllAPIKeys({
    queryParams: {
      ...queryParams,
      pageSize: PAGE_SIZE,
      pageNumber: page
    }
  })

  const { mutate: deleteKey } = useDeleteApiKey({ queryParams })
  const handleDelete = (id: string) => {
    deleteKey(id)
      .then(() => showSuccess(`Succesfuly deleted Key: ${id}`))
      .then(() => refetch())
      .catch(deleteError => showError(get(deleteError, 'data.error', deleteError?.message)))
  }

  const { apiKeys, ...pagination } = data ?? {
    itemCount: 0,
    pageCount: 0,
    pageIndex: 0,
    pageSize: PAGE_SIZE
  }
  const hasData = (apiKeys || []).length > 0 || recents.length > 0
  const emptyData = (apiKeys || []).length === 0 && recents.length === 0

  const columns: CustomColumn<ApiKey>[] = useMemo(
    () => [
      {
        Header: getString('name').toUpperCase(),
        width: '25%',
        Cell: NameCell
      },
      {
        Header: getString('typeLabel').toUpperCase(),
        width: '25%',
        Cell: TypeCell
      },
      {
        id: 'info',
        width: '50%',
        Cell: ApiInfoCell
      }
    ],
    []
  )

  return (
    <Container width="100%" height="100%" padding={{ top: 'huge', left: 'xxlarge' }}>
      {hasData && (
        <Layout.Vertical spacing="medium" style={{ justifyContent: 'flex-start', alignItems: 'flex-start' }}>
          <Heading level={2} font={{ weight: 'bold' }}>
            {getEnvString('apiKeys.title')}
          </Heading>
          <Text>{getEnvString('apiKeys.message')}</Text>
          <Container width="100%" padding={{ right: 'xxlarge' }}>
            <RowContext.Provider
              value={{
                isNew: (id: string) => Boolean(recents.find(r => r.identifier === id)),
                onDelete: handleDelete,
                getSecret: (id: string, fallback: string) => recents.find(r => r.identifier === id)?.apiKey || fallback
              }}
            >
              <Table<ApiKey>
                data={apiKeys as ApiKey[]}
                columns={columns}
                pagination={{
                  itemCount: pagination.itemCount,
                  pageCount: pagination.pageCount,
                  pageIndex: pagination.pageIndex,
                  pageSize: PAGE_SIZE,
                  gotoPage: (index: number) => {
                    setPage(index)
                    refetch({ queryParams: { ...queryParams, pageNumber: index } })
                  }
                }}
              />
            </RowContext.Provider>
          </Container>
          <AddKeyDialog
            environment={environment}
            onCreate={(newKey: ApiKey, hideCreate) => {
              setRecents([...recents, newKey])
              hideCreate()
              refetch()
            }}
          />
        </Layout.Vertical>
      )}

      {emptyData && (
        <Layout.Vertical
          spacing="medium"
          style={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <Text>{getEnvString('apiKeys.noKeysFound')}</Text>
          <AddKeyDialog
            primary
            environment={environment}
            onCreate={(newKey: ApiKey, hideCreate) => {
              setRecents([...recents, newKey])
              hideCreate()
              refetch()
            }}
          />
        </Layout.Vertical>
      )}

      {loading && (
        <Container
          style={{
            position: 'relative',
            display: 'flex',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          <ContainerSpinner />
        </Container>
      )}

      {error && (
        <PageError
          message={get(error, 'data.message', error?.message)}
          onClick={() => {
            setPage(0)
            refetch()
          }}
        />
      )}
    </Container>
  )
}

enum SettingsTabs {
  FeatureFlags = 'featureFlags',
  Deployments = 'deployments',
  Builds = 'builds',
  CloudCosts = 'cloudCosts',
  ChangeVerification = 'changeVerification'
}

const EnvironmentSettings: React.FC<{ environment: EnvironmentResponseDTO }> = ({ environment }) => {
  const { getString } = useEnvStrings()
  return (
    <Nav initialTab={SettingsTabs.Deployments} sharedProps={{ environment }}>
      <Nav.Option id={SettingsTabs.Deployments} name={getString('deploymentsText')} component={PlaceholderComp} />
      <Nav.Option id={SettingsTabs.Builds} name={getString('buildsText')} component={PlaceholderComp} />
      <Nav.Option id={SettingsTabs.FeatureFlags} name={getString('featureFlagsText')} component={FeatureFlagsTab} />
      <Nav.Option id={SettingsTabs.CloudCosts} name={getString('cloudCostsText')} component={PlaceholderComp} />
      <Nav.Option
        id={SettingsTabs.ChangeVerification}
        name={getString('changeVerificationText')}
        component={PlaceholderComp}
      />
    </Nav>
  )
}

const CFEnvironmentDetailsBody: React.FC<{
  environment: EnvironmentResponseDTO
}> = ({ environment }) => {
  return (
    <Container className={css.envTabs}>
      <Tabs id="envDetailsTabs">
        <Tab id="summary" title="Summary" panel={<Text>To be implemented</Text>} />
        <Tab id="settings" title="Settings" panel={<EnvironmentSettings environment={environment} />} />
      </Tabs>
    </Container>
  )
}

export default CFEnvironmentDetailsBody
