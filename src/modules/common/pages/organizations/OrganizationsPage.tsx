import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Button, Layout } from '@wings-software/uikit'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import { Page } from 'modules/common/exports'
import { routeOrgProjects } from 'navigation/accounts/routes'
import { useOrganizationModal } from 'modules/common/modals/OrganizationModal/useOrganizationModal'
import { ResponsePageOrganization, useGetOrganizationList } from 'services/cd-ng'
import type { Organization } from 'services/cd-ng'

import type { UseGetMockData } from 'modules/common/utils/testUtils'
import i18n from './OrganizationsPage.i18n'

interface OrganizationsPageData {
  orgMockData?: UseGetMockData<ResponsePageOrganization>
}

const OrganizationsPage: React.FC<OrganizationsPageData> = ({ orgMockData }) => {
  const { accountId } = useParams()
  const history = useHistory()
  const { loading, data: organizations, refetch, error } = useGetOrganizationList({
    queryParams: { accountIdentifier: accountId },
    mock: orgMockData
  })
  const { openOrganizationModal } = useOrganizationModal({
    onSuccess: () => refetch()
  })

  return (
    <>
      <Page.Header
        title={i18n.organizations}
        toolbar={
          <Layout.Horizontal spacing="xsmall">
            <Button text={i18n.newOrganization} onClick={() => openOrganizationModal()} />
          </Layout.Horizontal>
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => !organizations?.data?.content?.length,
          icon: 'nav-dashboard',
          message: i18n.noDataMessage,
          buttonText: i18n.newOrganizationButtonText,
          onClick: () => openOrganizationModal()
        }}
      >
        <Layout.Masonry
          center
          gutter={20}
          items={organizations?.data?.content || []}
          renderItem={(org: Organization) => (
            <OrganizationCard
              data={org}
              editOrg={() => openOrganizationModal(org)}
              reloadOrgs={() => refetch()}
              onClick={() => history.push(routeOrgProjects.url({ orgIdentifier: org.identifier as string }))}
            />
          )}
          keyOf={(org: Organization) => org?.identifier as string}
        />
      </Page.Body>
    </>
  )
}

export default OrganizationsPage
