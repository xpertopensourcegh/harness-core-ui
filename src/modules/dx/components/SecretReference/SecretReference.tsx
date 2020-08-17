import React, { useState } from 'react'
import cx from 'classnames'
import { Container, TextInput, Button, Layout, Text } from '@wings-software/uikit'
import { Classes } from '@blueprintjs/core'

import { useListSecrets, ListSecretsQueryParams } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'

import { PageSpinner } from 'modules/common/components/Page/PageSpinner'
import { PageError } from 'modules/common/components/Page/PageError'

import css from './SecretReference.module.scss'

export enum Scope {
  PROJECT,
  ORG,
  ACCOUNT
}

interface SecretReferenceProps {
  onSelect: (secret: EncryptedDataDTO) => void
  accountIdentifier: string
  projectIdentifier?: string
  orgIdentifier?: string
  defaultScope?: Scope
  type?: ListSecretsQueryParams['type']
}

const SecretReference: React.FC<SecretReferenceProps> = props => {
  const { defaultScope, accountIdentifier, projectIdentifier, orgIdentifier, type = 'SecretText' } = props
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedScope, setSelectedScope] = useState<Scope>(defaultScope || Scope.ACCOUNT)

  const { loading, data, error, refetch } = useListSecrets({
    queryParams: {
      account: accountIdentifier,
      type,
      searchTerm: searchTerm.trim(),
      project: selectedScope === Scope.PROJECT ? projectIdentifier : undefined,
      org: selectedScope === Scope.PROJECT || selectedScope === Scope.ORG ? orgIdentifier : undefined
    },
    debounce: 300
  })

  return (
    <Container padding="large" className={css.container}>
      <Layout.Vertical spacing="medium">
        <Layout.Horizontal spacing="small">
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.PROJECT ? 'primary' : 'none'}
            text="Project"
            icon="cube"
            onClick={() => setSelectedScope(Scope.PROJECT)}
            disabled={!projectIdentifier}
          />
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.ORG ? 'primary' : 'none'}
            text="Organization"
            icon="diagram-tree"
            onClick={() => setSelectedScope(Scope.ORG)}
            disabled={!orgIdentifier}
          />
          <Button
            className={css.scopeButton}
            intent={selectedScope == Scope.ACCOUNT ? 'primary' : 'none'}
            text="Account"
            icon="layers"
            onClick={() => setSelectedScope(Scope.ACCOUNT)}
          />
        </Layout.Horizontal>
        <TextInput
          placeholder="Search"
          leftIcon="search"
          value={searchTerm}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSearchTerm(e.target.value)
          }}
        />
      </Layout.Vertical>
      {loading ? (
        <PageSpinner />
      ) : error ? (
        <Container padding={{ top: 'large' }}>
          <PageError message={error.message} onClick={() => refetch()} />
        </Container>
      ) : data?.data?.content?.length ? (
        <div className={css.secretList}>
          {data.data.content.map((item: EncryptedDataDTO) => (
            <div
              key={item.identifier}
              className={cx(css.listItem, Classes.POPOVER_DISMISS)}
              onClick={() => props.onSelect(item)}
            >
              <div>{item.name}</div>
              <div className={css.meta}>
                {item.identifier} . {item.secretManager}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Container padding={{ top: 'xlarge' }} flex={{ align: 'center-center' }}>
          <Text>No Secrets Found</Text>
        </Container>
      )}
    </Container>
  )
}

export default SecretReference
