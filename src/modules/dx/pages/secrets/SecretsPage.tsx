import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Layout, Popover, Button, Icon, TextInput, Container } from '@wings-software/uikit'
import { Menu, Position } from '@blueprintjs/core'

import { useListSecrets } from 'services/cd-ng'
import type { ResponseDTOListEncryptedDataDTO } from 'services/cd-ng'

import useCreateSecretModal, { SecretType } from 'modules/dx/modals/CreateSecretModal/useCreateSecretModal'
import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'
import type { UseGetMockData } from 'modules/common/utils/testUtils'

import SecretsList from './views/SecretsListView/SecretsList'

import i18n from './SecretsPage.i18n'
import css from './SecretsPage.module.scss'

interface SecretsPageProps {
  mockData?: UseGetMockData<ResponseDTOListEncryptedDataDTO>
}

const SecretsPage: React.FC<SecretsPageProps> = ({ mockData }) => {
  const { accountId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: secretsResponse, loading, error, refetch } = useListSecrets({
    queryParams: { accountIdentifier: accountId, searchTerm },
    mock: mockData,
    debounce: 300
  })
  const { openCreateSecretModal } = useCreateSecretModal({
    onSuccess: () => {
      refetch()
    }
  })

  return (
    <>
      <Layout.Horizontal flex className={css.header}>
        <Popover minimal position={Position.BOTTOM_LEFT}>
          <Button intent="primary" text={i18n.newSecret.button} icon="plus" rightIcon="chevron-down" />
          <Menu large>
            <Menu.Item
              text={i18n.newSecret.text}
              labelElement={<Icon name="font" />}
              onClick={() => openCreateSecretModal(SecretType.TEXT)}
            />
            <Menu.Item
              text={i18n.newSecret.file}
              labelElement={<Icon name="document" />}
              onClick={() => openCreateSecretModal(SecretType.FILE)}
            />
            <Menu.Divider />
            <Menu.Item text={i18n.newSecret.yaml} disabled />
          </Menu>
        </Popover>
        <Layout.Horizontal spacing="small">
          <TextInput
            leftIcon="search"
            placeholder="Search"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSearchTerm(e.target.value.trim())
            }}
          />
        </Layout.Horizontal>
      </Layout.Horizontal>

      {loading ? (
        <div style={{ position: 'relative', height: 'calc(100vh - 128px)' }}>
          <PageSpinner />
        </div>
      ) : error ? (
        <div style={{ paddingTop: '200px' }}>
          <PageError message={error.message} onClick={() => refetch()} />
        </div>
      ) : secretsResponse?.data?.length ? (
        <SecretsList secrets={secretsResponse?.data} refetch={refetch} />
      ) : (
        <Container flex={{ align: 'center-center' }} padding="xxlarge">
          No Data
        </Container>
      )}
    </>
  )
}

export default SecretsPage
