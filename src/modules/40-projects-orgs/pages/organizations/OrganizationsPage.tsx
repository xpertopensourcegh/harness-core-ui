import React, { useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'

import { Button, Layout, TextInput } from '@wings-software/uikit'
import { Page } from '@common/exports'
import routes from '@common/RouteDefinitions'
import { ResponsePageOrganization, useGetOrganizationList } from 'services/cd-ng'
import type { Organization } from 'services/cd-ng'

import type { UseGetMockData } from '@common/utils/testUtils'
import { useOrganizationModal } from '@projects-orgs/modals/OrganizationModal/useOrganizationModal'
import { OrganizationCard } from '@projects-orgs/components/OrganizationCard/OrganizationCard'
import { useCollaboratorModal } from '@projects-orgs/modals/ProjectModal/useCollaboratorModal'
import i18n from './OrganizationsPage.i18n'
import css from './OrganizationsPage.module.scss'

interface OrganizationsPageData {
  orgMockData?: UseGetMockData<ResponsePageOrganization>
}

const OrganizationsPage: React.FC<OrganizationsPageData> = ({ orgMockData }) => {
  const { accountId } = useParams()
  const [searchParam, setSearchParam] = useState<string>()
  const history = useHistory()
  const { loading, data: organizations, refetch, error } = useGetOrganizationList({
    queryParams: { accountIdentifier: accountId, searchTerm: searchParam },
    mock: orgMockData,
    debounce: 300
  })
  const { openOrganizationModal } = useOrganizationModal({
    onSuccess: () => refetch()
  })
  const { openCollaboratorModal } = useCollaboratorModal()

  return (
    <>
      <Page.Header title={i18n.organizations} />
      <Page.Header
        title={
          <Layout.Horizontal padding="small">
            <Button intent="primary" icon="plus" text={i18n.newOrganization} onClick={() => openOrganizationModal()} />
          </Layout.Horizontal>
        }
        toolbar={
          <Layout.Horizontal padding={{ right: 'large' }}>
            <TextInput
              leftIcon="search"
              placeholder="Search by project, tags, members"
              value={searchParam}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchParam(e.target.value.trim())
              }}
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
        className={css.orgPage}
      >
        <Layout.Masonry
          center
          gutter={20}
          items={organizations?.data?.content || []}
          renderItem={(org: Organization) => (
            <OrganizationCard
              data={org}
              editOrg={() => openOrganizationModal(org)}
              inviteCollab={() => openCollaboratorModal({ orgIdentifier: org.identifier })}
              reloadOrgs={() => refetch()}
              onClick={() =>
                history.push(
                  routes.toOrganizationDetails({
                    orgIdentifier: org.identifier as string,
                    accountId: org.accountIdentifier || ''
                  })
                )
              }
            />
          )}
          keyOf={(org: Organization) => org?.identifier as string}
        />
      </Page.Body>
    </>
  )
}

export default OrganizationsPage
