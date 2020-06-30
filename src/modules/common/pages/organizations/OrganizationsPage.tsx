import React from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Button, Layout } from '@wings-software/uikit'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import { Page } from 'modules/common/exports'
import { linkTo } from 'framework/exports'
import { routeOrgProjects } from 'modules/common/routes'
import { useOrganizationModal } from 'modules/common/modals/OrganizationModal/useOrganizationModal'
import { useGetOrganizationList } from 'services/cd-ng'
import type { OrganizationDTO } from 'services/cd-ng'

import i18n from './OrganizationsPage.i18n'

const OrganizationsPage: React.FC = () => {
  const { accountId } = useParams()
  const history = useHistory()
  const { loading, data: organizations, refetch, error } = useGetOrganizationList({ accountIdentifier: accountId })
  const { openOrganizationModal } = useOrganizationModal({
    onSuccess: () => refetch()
  })

  return (
    <>
      <Page.Header
        title={i18n.organizations}
        toolbar={
          <Layout.Horizontal spacing="xsmall">
            <Button
              text={i18n.newOrganization}
              onClick={() => openOrganizationModal()}
              style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
            />
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
          renderItem={(org: OrganizationDTO) => (
            <OrganizationCard
              data={org}
              editOrg={() => openOrganizationModal(org)}
              reloadOrgs={() => refetch()}
              onClick={() => history.push(linkTo(routeOrgProjects, { orgId: org.identifier }))}
            />
          )}
          keyOf={(org: OrganizationDTO) => org.identifier}
        />
      </Page.Body>
    </>
  )
}

export default OrganizationsPage
