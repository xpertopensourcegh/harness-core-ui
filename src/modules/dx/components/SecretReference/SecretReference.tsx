import React from 'react'
import {
  ListSecretsQueryParams,
  Failure,
  listSecretsV2Promise,
  SecretDTOV2,
  SecretTextSpecDTO,
  ResponsePageSecretResponseWrapper
} from 'services/cd-ng'
import { EntityReference } from 'modules/common/exports'
import type { EntityReferenceResponse } from 'modules/common/components/EntityReference/EntityReference'
import { Scope } from 'modules/common/interfaces/SecretsInterface'
import i18n from './SecretReference.i18n'
import css from './SecretReference.module.scss'

export interface SecretRef extends SecretDTOV2 {
  scope: Scope
}

interface SecretReferenceProps {
  onSelect: (secret: SecretRef) => void
  accountIdentifier: string
  projectIdentifier?: string
  orgIdentifier?: string
  defaultScope?: Scope
  type?: ListSecretsQueryParams['type']
  mock?: ResponsePageSecretResponseWrapper
}

const fetchRecords = (
  scope: Scope,
  search: string | undefined,
  done: (records: EntityReferenceResponse<SecretRef>[]) => void,
  type: ListSecretsQueryParams['type'],
  accountIdentifier: string,
  projectIdentifier?: string,
  orgIdentifier?: string,
  mock?: ResponsePageSecretResponseWrapper
): void => {
  listSecretsV2Promise({
    queryParams: {
      accountIdentifier,
      type,
      searchTerm: search?.trim(),
      projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
      orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined
    },
    mock
  })
    .then(responseData => {
      if (responseData?.data?.content) {
        const secrets = responseData.data.content
        const response: EntityReferenceResponse<SecretRef>[] = []
        secrets.forEach(secret => {
          response.push({
            name: secret.secret.name || '',
            identifier: secret.secret.identifier || '',
            record: { ...secret.secret, scope }
          })
        })
        done(response)
      } else {
        done([])
      }
    })
    .catch((err: Failure) => {
      throw err.message
    })
}

const SecretReference: React.FC<SecretReferenceProps> = props => {
  const { defaultScope, accountIdentifier, projectIdentifier, orgIdentifier, type = 'SecretText', mock } = props
  return (
    <EntityReference<SecretRef>
      onSelect={(secret, scope) => {
        secret.scope = scope
        props.onSelect(secret)
      }}
      defaultScope={defaultScope}
      recordClassName={css.listItem}
      fetchRecords={(scope, search = '', done) => {
        fetchRecords(scope, search, done, type, accountIdentifier, projectIdentifier, orgIdentifier, mock)
      }}
      projectIdentifier={projectIdentifier}
      orgIdentifier={orgIdentifier}
      noRecordsText={i18n.noSecretsFound}
      recordRender={item => (
        <>
          <div>{item.record.name}</div>
          {item.record.type === 'SecretText' || item.record.type === 'SecretFile' ? (
            <div className={css.meta}>
              {item.identifier} . {(item.record.spec as SecretTextSpecDTO).secretManagerIdentifier}
            </div>
          ) : null}
          {item.record.type === 'SSHKey' ? <div className={css.meta}>{item.identifier}</div> : null}
        </>
      )}
    />
  )
}

export default SecretReference
