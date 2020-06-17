import { Button, Layout } from '@wings-software/uikit'
import { orderBy } from 'lodash-es'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import { Page } from 'modules/common/exports'
import { useOrganizationModal } from 'modules/common/modals/OrganizationModal/useOrganizationModal'
import React from 'react'
import { useGetOrganizations, OrganizationDTO } from 'services/cd-ng'
import i18n from './OrganizationsPage.i18n'

const OrganizationsPage: React.FC = () => {
  const { loading, data: organizations, refetch, error } = useGetOrganizations({})
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
            <Button minimal onClick={() => refetch()} icon="refresh" />
          </Layout.Horizontal>
        }
      />
      <Page.Body
        loading={loading}
        error={error?.message}
        retryOnError={() => refetch()}
        noData={{
          when: () => !(organizations as [])?.length,
          icon: 'nav-dashboard',
          message: i18n.noDataMessage,
          buttonText: i18n.newOrganizationButtonText,
          onClick: () => openOrganizationModal()
        }}
      >
        {(organizations as [])?.length && (
          <Layout.Masonry
            gutter={25}
            items={orderBy(organizations as [], 'name')}
            renderItem={(org: OrganizationDTO) => (
              <OrganizationCard data={org} onClick={() => openOrganizationModal(org)} />
            )}
            keyOf={(org: OrganizationDTO) => org.id}
          />
        )}
      </Page.Body>
    </>
  )
}

export default OrganizationsPage
