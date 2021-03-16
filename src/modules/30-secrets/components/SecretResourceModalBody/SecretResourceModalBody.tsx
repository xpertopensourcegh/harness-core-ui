import React, { useState } from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { CellProps, Renderer } from 'react-table'
import ResourceHandlerTable from '@rbac/components/ResourceHandlerTable/ResourceHandlerTable'
import { useListSecretsV2, SecretDTOV2, SecretTextSpecDTO } from 'services/cd-ng'
import { PageSpinner } from '@common/components'
import type { RbacResourceModalProps } from '@rbac/factories/RbacFactory'
import { getStringForType } from '@secrets/utils/SSHAuthUtils'

const RenderColumnSecret: Renderer<CellProps<SecretDTOV2>> = ({ row }) => {
  const data = row.original
  return (
    <Layout.Vertical padding={{ left: 'small' }}>
      <Text color={Color.BLACK} lineClamp={1}>
        {data.name}
      </Text>
      <Text color={Color.GREY_400} lineClamp={1}>
        {data.description}
      </Text>
    </Layout.Vertical>
  )
}

const RenderColumnDetails: Renderer<CellProps<SecretDTOV2>> = ({ row }) => {
  const data = row.original
  return (
    <>
      {data.type === 'SecretText' || data.type === 'SecretFile' ? (
        <Text color={Color.BLACK} lineClamp={1} width={230}>
          {(data.spec as SecretTextSpecDTO).secretManagerIdentifier}
        </Text>
      ) : null}
      {/* TODO {Abhinav} display SM name */}
      <Text color={Color.GREY_400}>{getStringForType(data.type)}</Text>
    </>
  )
}

const SecretResourceModalBody: React.FC<RbacResourceModalProps> = ({ searchTerm, onSelectChange, selectedData }) => {
  const { accountId, orgIdentifier, projectIdentifier } = useParams()
  const [page, setPage] = useState(0)
  const { data, loading } = useListSecretsV2({
    queryParams: {
      accountIdentifier: accountId,
      searchTerm,
      pageIndex: page,
      pageSize: 10,
      orgIdentifier,
      projectIdentifier
    },
    debounce: 300
  })
  const secretData = data?.data?.content?.map(secretResponse => secretResponse.secret)

  if (loading) return <PageSpinner />
  return secretData ? (
    <Container>
      <ResourceHandlerTable
        data={secretData}
        selectedData={selectedData}
        columns={[
          {
            id: 'name',
            accessor: 'name',
            width: '25%',
            Cell: RenderColumnSecret,
            disableSortBy: true
          },
          {
            accessor: 'description',
            id: 'details',
            width: '25%',
            Cell: RenderColumnDetails,
            disableSortBy: true
          }
        ]}
        pagination={{
          itemCount: data?.data?.totalItems || 0,
          pageSize: data?.data?.pageSize || 10,
          pageCount: data?.data?.totalPages || -1,
          pageIndex: data?.data?.pageIndex || 0,
          gotoPage: pageNumber => setPage(pageNumber)
        }}
        onSelectChange={onSelectChange}
      />
    </Container>
  ) : null
}

export default SecretResourceModalBody
