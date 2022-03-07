/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { useCallback, useEffect, useMemo } from 'react'
import { Card, Container, SelectOption, useToaster, Utils, FormInput, ButtonVariation } from '@wings-software/uicore'
import { useHistory, useParams } from 'react-router-dom'
import { NameIdDescriptionTags } from '@common/components'
import { useStrings } from 'framework/strings'
import { HarnessServiceAsFormField } from '@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment'
import { useGetAllJourneys, useSaveUserJourney } from 'services/cv'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getCVMonitoringServicesSearchParam, getErrorMessage } from '@cv/utils/CommonUtils'
import { LIST_USER_JOURNEYS_OFFSET, LIST_USER_JOURNEYS_PAGESIZE } from '@cv/pages/slos/CVSLOsListingPage.constants'
import { SLONameProps, SLOFormFields } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.types'
import { getUserJourneyOptions } from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.utils'
import RbacButton from '@rbac/components/Button/Button'
import { PermissionIdentifier } from '@rbac/interfaces/PermissionIdentifier'
import { ResourceType } from '@rbac/interfaces/ResourceType'
import routes from '@common/RouteDefinitions'
import { useQueryParams } from '@common/hooks'
import css from '@cv/pages/slos/components/CVCreateSLO/CVCreateSLO.module.scss'

const SLOName: React.FC<SLONameProps> = ({
  children,
  formikProps,
  identifier,
  monitoredServicesLoading,
  monitoredServicesOptions
}) => {
  const { getString } = useStrings()
  const { showSuccess, showError } = useToaster()
  const { accountId, orgIdentifier, projectIdentifier } = useParams<ProjectPathProps>()
  const TEXT_USER_JOURNEY = getString('cv.slos.userJourney')
  const { monitoredServiceIdentifier } = useQueryParams<{ monitoredServiceIdentifier?: string }>()
  const history = useHistory()
  const { userJourneyRef } = formikProps.values

  const {
    data: userJourneysData,
    error: userJourneysError,
    refetch: fetchUserJourneys,
    loading: userJourneysLoading
  } = useGetAllJourneys({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier,
      offset: LIST_USER_JOURNEYS_OFFSET,
      pageSize: LIST_USER_JOURNEYS_PAGESIZE
    }
  })

  const { loading: saveUserJourneyLoading, mutate: createUserJourney } = useSaveUserJourney({
    queryParams: {
      accountId,
      orgIdentifier,
      projectIdentifier
    }
  })

  useEffect(() => {
    if (userJourneysError) {
      showError(getErrorMessage(userJourneysError))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userJourneysError])

  const handleCreateUserJourney = useCallback(async newOption => {
    if (newOption?.identifier && newOption?.name) {
      try {
        // creating new user journey
        await createUserJourney({ name: newOption.name, identifier: newOption.identifier })

        // selecting the current user journey
        formikProps.setFieldValue('userJourneyRef', newOption.identifier)

        // listing all user journeys
        await fetchUserJourneys()

        showSuccess(getString('cv.slos.userJourneyCreated'))
      } catch (e) {
        showError(getErrorMessage(e))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const key = useMemo(() => Utils.randomId(), [userJourneyRef])

  const userJourneyOptions = useMemo(
    (): SelectOption[] => getUserJourneyOptions(userJourneysData?.data?.content),
    [userJourneysData?.data?.content]
  )

  const activeUserJourney = useMemo(
    () => userJourneyOptions.find(userJourney => userJourney.value === userJourneyRef),
    [userJourneyOptions, userJourneyRef]
  )

  return (
    <>
      <Card className={css.card}>
        <Container width={350}>
          <NameIdDescriptionTags
            formikProps={formikProps}
            className={css.selectPrimary}
            identifierProps={{
              inputLabel: getString('cv.slos.sloName'),
              inputName: SLOFormFields.NAME,
              isIdentifierEditable: !identifier
            }}
          />
        </Container>
        <Container flex={{ justifyContent: 'flex-start' }}>
          <Container width={350}>
            <FormInput.Select
              name={SLOFormFields.MONITORED_SERVICE_REF}
              label={getString('connectors.cdng.monitoredService.label')}
              placeholder={
                monitoredServicesLoading ? getString('loading') : getString('cv.slos.selectMonitoredService')
              }
              items={monitoredServicesOptions}
              onChange={() => {
                formikProps.setFieldValue(SLOFormFields.HEALTH_SOURCE_REF, undefined)
                formikProps.setFieldValue(SLOFormFields.VALID_REQUEST_METRIC, undefined)
                formikProps.setFieldValue(SLOFormFields.GOOD_REQUEST_METRIC, undefined)
              }}
            />
          </Container>
          <RbacButton
            icon="plus"
            text={getString('cv.monitoredServices.newMonitoredServices')}
            variation={ButtonVariation.LINK}
            onClick={() => {
              history.push({
                pathname: routes.toCVAddMonitoringServicesSetup({
                  accountId,
                  orgIdentifier,
                  projectIdentifier
                }),
                search: getCVMonitoringServicesSearchParam({
                  redirectToSLO: true,
                  sloIdentifier: identifier,
                  monitoredServiceIdentifier
                })
              })
            }}
            permission={{
              permission: PermissionIdentifier.EDIT_MONITORED_SERVICE,
              resource: {
                resourceType: ResourceType.MONITOREDSERVICE,
                resourceIdentifier: projectIdentifier
              }
            }}
          />
        </Container>
        <Container width={350}>
          <HarnessServiceAsFormField
            key={key}
            customRenderProps={{
              name: SLOFormFields.USER_JOURNEY_REF,
              label: TEXT_USER_JOURNEY
            }}
            serviceProps={{
              item: activeUserJourney,
              options: userJourneyOptions,
              onSelect: selectedUserJourney =>
                formikProps.setFieldValue(SLOFormFields.USER_JOURNEY_REF, selectedUserJourney.value),
              modalTitle: TEXT_USER_JOURNEY,
              placeholder: getString('cv.slos.userJourneyPlaceholder'),
              skipServiceCreateOrUpdate: true,
              onNewCreated: newOption => handleCreateUserJourney(newOption),
              loading: userJourneysLoading,
              name: TEXT_USER_JOURNEY
            }}
            customLoading={saveUserJourneyLoading}
          />
        </Container>
      </Card>
      {children}
    </>
  )
}

export default SLOName
