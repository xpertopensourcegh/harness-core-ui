import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import Table from 'modules/common/components/Table/Table'

import { useListSecretsForAccount } from 'services/cd-ng'
import type { EncryptedDataDTO } from 'services/cd-ng'
import type { Column } from 'react-table'

const SecretsList: React.FC = () => {
  const { accountId } = useParams()
  const { data: secretsResponse, loading } = useListSecretsForAccount({
    queryParams: { accountIdentifier: accountId, type: 'SECRET_TEXT', includeDetails: true }
  })

  const columns: Column<EncryptedDataDTO>[] = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        width: '40%'
      },
      {
        Header: 'Secret Manager',
        accessor: 'encryptedBy',
        width: '60%'
      }
    ],
    []
  )

  // TODO: remove `any` once backend fixes the type
  const data: EncryptedDataDTO[] = useMemo(() => (secretsResponse?.data as any)?.response || [], [secretsResponse])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <Table<EncryptedDataDTO> columns={columns} data={data} />
    </div>
  )
}

export default SecretsList
