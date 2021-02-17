import React, { useState } from 'react'
import { Button, Container, ExpandingSearchInput, Layout, Pagination } from '@wings-software/uicore'

import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/exports'
import { PageHeader } from '@common/components/Page/PageHeader'
import { PageBody } from '@common/components/Page/PageBody'
import { Role, RoleResponse, useGetRoleList } from 'services/rbac'
import RoleCard from '@rbac/components/RoleCard/RoleCard'
import { useRoleModal } from '@rbac/modals/RoleModal/useRoleModal'
import css from './Roles.module.scss'

const Roles: React.FC = () => {
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { getString } = useStrings()
  const [page, setPage] = useState(0)
  const { data, loading, error, refetch } = useGetRoleList({
    queryParams: {
      accountIdentifier: accountId,
      projectIdentifier,
      orgIdentifier,
      pageIndex: page
    }
  })

  const { openRoleModal } = useRoleModal({ onSuccess: refetch })

  const editRoleModal = (role: Role): void => {
    openRoleModal(role)
  }

  return (
    <>
      <PageHeader
        title={
          <Layout.Horizontal padding={{ left: 'large' }}>
            <Button text={getString('newRole')} intent="primary" icon="plus" onClick={() => openRoleModal()} />
          </Layout.Horizontal>
        }
        toolbar={
          <Layout.Horizontal margin={{ right: 'small' }} height="xxxlarge">
            <ExpandingSearchInput placeholder={getString('usersPage.search')} />
          </Layout.Horizontal>
        }
      />
      <PageBody
        loading={loading}
        retryOnError={() => refetch()}
        error={(error?.data as Error)?.message}
        className={css.pageContainer}
      >
        <Container className={css.masonry}>
          <Layout.Masonry
            center
            gutter={25}
            width={900}
            className={css.centerContainer}
            items={data?.data?.content || []}
            renderItem={(roleResponse: RoleResponse) => (
              <RoleCard data={roleResponse} reloadRoles={refetch} editRoleModal={editRoleModal} />
            )}
            keyOf={(roleResponse: RoleResponse) => roleResponse.role.identifier}
          />
        </Container>
        <Container className={css.pagination}>
          <Pagination
            itemCount={data?.data?.totalItems || 0}
            pageSize={data?.data?.pageSize || 10}
            pageCount={data?.data?.totalPages || 0}
            pageIndex={data?.data?.pageIndex || 0}
            gotoPage={(pageNumber: number) => setPage(pageNumber)}
          />
        </Container>
      </PageBody>
    </>
  )
}

export default Roles
