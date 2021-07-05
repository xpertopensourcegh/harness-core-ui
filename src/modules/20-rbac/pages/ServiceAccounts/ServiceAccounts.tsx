import React, { useState } from 'react'
import { Button, ExpandingSearchInput, Layout } from '@wings-software/uicore'
import { useParams } from 'react-router-dom'
import { useStrings } from 'framework/strings'
import { Page } from '@common/exports'
import type { PipelineType, ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useDocumentTitle } from '@common/hooks/useDocumentTitle'
import { useServiceAccountModal } from '@rbac/modals/ServiceAccountModal/useServiceAccountModal'
import { useRoleAssignmentModal } from '@rbac/modals/RoleAssignmentModal/useRoleAssignmentModal'
import { useListAggregatedServiceAccounts } from 'services/cd-ng'
import ServiceAccountsListView from '@rbac/pages/ServiceAccounts/views/ServiceAccountsListView'
import css from './ServiceAccounts.module.scss'

const ServiceAccountsPage: React.FC = () => {
  const { getString } = useStrings()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<PipelineType<ProjectPathProps>>()
  useDocumentTitle(getString('rbac.serviceAccounts.label'))
  const [searchTerm, setsearchTerm] = useState<string>()
  const [page, setPage] = useState(0)

  const { data, loading, error, refetch } = useListAggregatedServiceAccounts({
    queryParams: {
      accountIdentifier: accountId,
      orgIdentifier,
      projectIdentifier,
      searchTerm,
      pageIndex: page,
      pageSize: 10
    }
  })

  const { openServiceAccountModal } = useServiceAccountModal({ onSuccess: () => refetch() })
  const { openRoleAssignmentModal } = useRoleAssignmentModal({ onSuccess: refetch })

  return (
    <>
      <Page.Header
        title={
          <Layout.Horizontal padding={{ left: 'large' }} spacing="small">
            <Button
              text={getString('rbac.serviceAccounts.newServiceAccount')}
              intent="primary"
              icon="plus"
              onClick={() => openServiceAccountModal()}
            />
          </Layout.Horizontal>
        }
        toolbar={
          <Layout.Horizontal margin={{ right: 'small' }} height="xxxlarge">
            <ExpandingSearchInput
              placeholder={getString('rbac.serviceAccounts.search')}
              onChange={text => {
                setsearchTerm(text.trim())
              }}
              className={css.search}
            />
          </Layout.Horizontal>
        }
      />

      <Page.Body
        loading={loading}
        error={(error as any)?.data?.message || error?.message}
        retryOnError={() => refetch()}
        noData={
          !searchTerm
            ? {
                when: () => !data?.data?.content?.length,
                icon: 'nav-project',
                message: getString('rbac.serviceAccounts.noDataDescription'),
                button: (
                  <Button
                    text={getString('rbac.serviceAccounts.newServiceAccount')}
                    intent="primary"
                    icon="plus"
                    onClick={() => openServiceAccountModal()}
                  />
                )
              }
            : {
                when: () => !data?.data?.content?.length,
                icon: 'nav-project',
                message: getString('rbac.serviceAccounts.noServiceAccounts')
              }
        }
      >
        <ServiceAccountsListView
          data={data?.data}
          reload={refetch}
          openRoleAssignmentModal={openRoleAssignmentModal}
          openServiceAccountModal={openServiceAccountModal}
          gotoPage={(pageNumber: number) => setPage(pageNumber)}
        />
      </Page.Body>
    </>
  )
}

export default ServiceAccountsPage
