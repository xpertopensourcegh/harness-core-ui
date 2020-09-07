import React from 'react'
import { ListSecretsQueryParams, FailureDTO, listSecretsPromise } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'
import { ReferenceSelector } from 'modules/common/exports'
import { ReferenceResponse, Scope } from 'modules/common/components/ReferenceSelector/ReferenceSelector'
import i18n from './SecretReference.i18n'
import css from './SecretReference.module.scss'

interface SecretRef extends EncryptedDataDTO {
  scope: Scope
}

interface SecretReferenceProps {
  onSelect: (secret: SecretRef) => void
  accountIdentifier: string
  projectIdentifier?: string
  orgIdentifier?: string
  defaultScope?: Scope
  type?: ListSecretsQueryParams['type']
}

const fetchRecords = (
  scope: Scope,
  search: string | undefined,
  done: (records: ReferenceResponse<SecretRef>[]) => void,
  type: ListSecretsQueryParams['type'],
  accountIdentifier: string,
  projectIdentifier?: string,
  orgIdentifier?: string
): void => {
  listSecretsPromise({
    queryParams: {
      accountIdentifier,
      type,
      searchTerm: search?.trim(),
      projectIdentifier: scope === Scope.PROJECT ? projectIdentifier : undefined,
      orgIdentifier: scope === Scope.PROJECT || scope === Scope.ORG ? orgIdentifier : undefined
    }
  })
    .then(responseData => {
      if (responseData?.data?.content) {
        const secrets = responseData.data.content
        const response: ReferenceResponse<SecretRef>[] = []
        secrets.forEach(secret => {
          response.push({
            label: secret.name || '',
            identifier: secret.identifier || '',
            record: { ...secret, scope }
          })
        })
        done(response)
      } else {
        done([])
      }
    })
    .catch((err: FailureDTO) => {
      throw err.message
    })
}

const SecretReference: React.FC<SecretReferenceProps> = props => {
  const { defaultScope, accountIdentifier, projectIdentifier, orgIdentifier, type = 'SecretText' } = props
  return (
    <ReferenceSelector<SecretRef>
      onSelect={(secret, scope) => {
        secret.scope = scope
        props.onSelect(secret)
      }}
      defaultScope={defaultScope}
      recordClassName={css.listItem}
      fetchRecords={(scope, search = '', done) => {
        fetchRecords(scope, search, done, type, accountIdentifier, projectIdentifier, orgIdentifier)
      }}
      projectIdentifier={projectIdentifier}
      orgIdentifier={orgIdentifier}
      noRecordsText={i18n.noSecretsFound}
      recordRender={item => (
        <>
          <div>{item.record.name}</div>
          <div className={css.meta}>
            {item.identifier} . {item.record.secretManager}
          </div>
        </>
      )}
    />
  )
}

export default SecretReference
