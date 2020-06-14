import { Button, Container, Layout } from '@wings-software/uikit'
import xhr from '@wings-software/xhr-async'
import { OrganizationCard } from 'modules/common/components/OrganizationCard/OrganizationCard'
import { Page } from 'modules/common/exports'
import { useOrganizationModal } from 'modules/common/modals/OrganizationModal/useOrganizationModal'
import * as OrganizationService from 'modules/common/services/OrganizationService'
import type { OrganizationDTO } from 'modules/common/types/dto/OrganizationDTO'
import React, { useCallback, useEffect, useState } from 'react'
import i18n from './OrganizationsPage.i18n'
import { routeParams } from 'framework/exports'
import { orderBy } from 'lodash-es'

const OrganizationsPage: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [organizations, setOrganizations] = useState<OrganizationDTO[]>([])
  const xhrGroup = 'OrganizationsPage'

  const {
    params: { accountId }
  } = routeParams()

  // TODO: API contracts are not finalized, can't use useService() for now
  const fetchData = useCallback(async () => {
    setLoading(true)
    const { response, error: _error } = await OrganizationService.getOrganizations({ accountId, xhrGroup })
    setLoading(false)

    if (_error) {
      setError(_error)
    } else if (response) {
      setOrganizations(response)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const { openOrganizationModal } = useOrganizationModal({
    onSuccess: fetchData
  })

  // const { data: organizations, loading, error, ref: refetchOrganizations } = useService(
  //   OrganizationService.getOrganizations,
  //   {
  //     accountId: 'kmpySmUISimoRrJL6NL73w'
  //   }
  // )

  useEffect(() => {
    fetchData()
    return () => xhr.abort(xhrGroup)
  }, [fetchData])

  return (
    <>
      <Page.Header
        title={i18n.organizations}
        toolbar={
          <Container>
            <Button
              text={i18n.newOrganization}
              onClick={() => openOrganizationModal()}
              style={{ color: 'var(--blue-500)', borderColor: 'var(--blue-500)' }}
            />
          </Container>
        }
      />
      <Page.Body
        loading={loading}
        error={error}
        retryOnError={fetchData}
        noData={{
          when: () => !organizations?.length,
          icon: 'nav-dashboard',
          message: i18n.noDataMessage,
          buttonText: i18n.newOrganizationButtonText,
          onClick: () => openOrganizationModal()
        }}
      >
        <Layout.Masonry
          gutter={25}
          items={orderBy(organizations, 'name')}
          renderItem={(org: OrganizationDTO) => (
            <OrganizationCard data={org} onClick={() => openOrganizationModal(org)} />
          )}
          keyOf={(org: OrganizationDTO) => org.id}
        />
      </Page.Body>
    </>
  )
}

export default OrganizationsPage
