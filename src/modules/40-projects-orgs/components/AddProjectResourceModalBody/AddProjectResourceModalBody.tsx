import React, { useState } from 'react'
import { Color, Container, Layout, Text } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import type { CellProps, Renderer } from 'react-table'
import ResourceHandlerTable from '@rbac/components/ResourceHandlerTable/ResourceHandlerTable'
import { Project, useGetProjectList } from 'services/cd-ng'
import { PageSpinner } from '@common/components'
import type { RbacResourceModalProps } from '@rbac/factories/RbacFactory'

const RenderColumnProject: Renderer<CellProps<Project>> = ({ row }) => {
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

const AddProjectResourceModalBody: React.FC<RbacResourceModalProps> = ({
  searchTerm,
  onSelectChange,
  selectedData
}) => {
  const { accountId } = useParams()
  const [page, setPage] = useState(0)
  const { data, loading } = useGetProjectList({
    queryParams: {
      accountIdentifier: accountId,
      searchTerm,
      pageIndex: page,
      pageSize: 5
    },
    debounce: 300
  })
  const projectData = data?.data?.content?.map(projectResponse => projectResponse.project)

  if (loading) return <PageSpinner />
  return projectData ? (
    <Container>
      <ResourceHandlerTable
        data={projectData}
        selectedData={selectedData}
        columns={[
          {
            id: 'name',
            accessor: 'name',
            width: '25%',
            Cell: RenderColumnProject,
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

export default AddProjectResourceModalBody
