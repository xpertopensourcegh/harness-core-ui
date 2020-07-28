import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import cx from 'classnames'
import { Container, TextInput, Button, Layout } from '@wings-software/uikit'

import { useListSecrets } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'

import css from './SecretReference.module.scss'
import { Classes } from '@blueprintjs/core'

export enum Scope {
  PROJECT,
  ORG,
  ACCOUNT
}

interface SecretReferenceProps {
  onSelect: (secret: EncryptedDataDTO) => void
  project?: string
  organization?: string
  defaultScope?: Scope
}

const SecretReference: React.FC<SecretReferenceProps> = props => {
  const { defaultScope } = props
  const { accountId } = useParams()
  const { loading, data } = useListSecrets({
    queryParams: { accountIdentifier: accountId, type: 'SECRET_TEXT' }
  })
  const [selectedScope, setSelectedScope] = useState<Scope>(defaultScope || Scope.ACCOUNT)

  return (
    <Container padding="large" className={css.container}>
      {loading ? (
        'Loading...'
      ) : (
        <Layout.Vertical spacing="medium">
          <Layout.Horizontal spacing="small">
            <Button
              className={css.scopeButton}
              intent={selectedScope == Scope.PROJECT ? 'primary' : 'none'}
              text="Project"
              icon="cube"
              onClick={() => setSelectedScope(Scope.PROJECT)}
              disabled
            />
            <Button
              className={css.scopeButton}
              intent={selectedScope == Scope.ORG ? 'primary' : 'none'}
              text="Organization"
              icon="diagram-tree"
              onClick={() => setSelectedScope(Scope.ORG)}
              disabled
            />
            <Button
              className={css.scopeButton}
              intent={selectedScope == Scope.ACCOUNT ? 'primary' : 'none'}
              text="Account"
              icon="layers"
              onClick={() => setSelectedScope(Scope.ACCOUNT)}
            />
          </Layout.Horizontal>
          <TextInput placeholder="Search" leftIcon="search" disabled />
          <div className={css.secretList}>
            {/* TODO: remove any once API fixes type */}
            {(data?.data as any)?.response?.map((item: EncryptedDataDTO) => (
              <div
                key={item.identifier}
                className={cx(css.listItem, Classes.POPOVER_DISMISS)}
                onClick={() => props.onSelect(item)}
              >
                <div>{item.name}</div>
                <div className={css.meta}>
                  {item.identifier} . {item.secretManagerIdentifier}
                </div>
              </div>
            ))}
          </div>
        </Layout.Vertical>
      )}
    </Container>
  )
}

export default SecretReference
