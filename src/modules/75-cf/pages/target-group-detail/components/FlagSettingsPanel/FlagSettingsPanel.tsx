/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import React, { FC, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { Container, PageError } from '@harness/uicore'
import { useStrings } from 'framework/strings'
import { Feature, GetAllFeaturesQueryParams, Segment, useGetAllFeatures, useGetSegmentFlags } from 'services/cf'
import { ContainerSpinner } from '@common/components/ContainerSpinner/ContainerSpinner'
import { getErrorMessage } from '@cf/utils/CFUtils'
import { NoData } from '@cf/components/NoData/NoData'
import imageUrl from '@cf/images/Feature_Flags_Teepee.svg'
import FlagSettingsForm from './FlagSettingsForm'
import type { TargetGroupFlagsMap } from './FlagSettingsPanel.types'

export interface FlagSettingsPanelProps {
  targetGroup: Segment
}

const FlagSettingsPanel: FC<FlagSettingsPanelProps> = ({ targetGroup }) => {
  const { getString } = useStrings()

  const { accountId: accountIdentifier, orgIdentifier, projectIdentifier } = useParams<Record<string, string>>()

  const {
    data: targetGroupFlags,
    loading: loadingTargetGroupFlags,
    error: targetGroupFlagsError,
    refetch: refetchTargetGroupFlags
  } = useGetSegmentFlags({
    identifier: targetGroup.identifier,
    queryParams: {
      accountIdentifier,
      orgIdentifier,
      projectIdentifier,
      environmentIdentifier: targetGroup.environment as string
    }
  })

  const flagsQueryParams = useMemo<GetAllFeaturesQueryParams>(
    () => ({
      accountIdentifier,
      orgIdentifier,
      projectIdentifier,
      environmentIdentifier: targetGroup.environment as string
    }),
    [accountIdentifier, orgIdentifier, projectIdentifier, targetGroup.environment]
  )

  const {
    data: flags,
    loading: loadingFlags,
    error: flagsError,
    refetch: refetchFlags
  } = useGetAllFeatures({
    lazy: true,
    debounce: 200,
    queryParams: flagsQueryParams
  })

  useEffect(() => {
    if (targetGroupFlags?.length) {
      refetchFlags({
        queryParams: {
          ...flagsQueryParams,
          pageSize: targetGroupFlags.length,
          featureIdentifiers: targetGroupFlags.map(({ identifier }) => identifier).join(',')
        }
      })
    }
  }, [flagsQueryParams, refetchFlags, targetGroupFlags])

  const targetGroupFlagsMap = useMemo<TargetGroupFlagsMap>(() => {
    if (!targetGroupFlags?.length || !flags?.features?.length) {
      return {}
    }

    return targetGroupFlags.reduce<TargetGroupFlagsMap>((map, targetGroupFlag) => {
      map[targetGroupFlag['identifier']] = {
        ...targetGroupFlag,
        flag: flags?.features?.find(({ identifier }) => identifier === targetGroupFlag.identifier) as Feature
      }

      return map
    }, {})
  }, [targetGroupFlags, flags?.features])

  if (targetGroupFlagsError || flagsError) {
    return (
      <PageError
        message={getErrorMessage(targetGroupFlagsError || flagsError)}
        onClick={async () => await refetchTargetGroupFlags()}
      />
    )
  }

  if (loadingTargetGroupFlags || loadingFlags || (targetGroupFlags?.length && !flags)) {
    return <ContainerSpinner flex={{ align: 'center-center' }} />
  }

  if (!targetGroupFlags?.length || !flags?.features?.length) {
    return (
      <Container width="100%" height="100%" flex={{ align: 'center-center' }}>
        <NoData imageURL={imageUrl} message={getString('cf.segmentDetail.noFlags')} />
      </Container>
    )
  }

  return (
    <FlagSettingsForm
      targetGroup={targetGroup}
      targetGroupFlagsMap={targetGroupFlagsMap}
      refresh={refetchTargetGroupFlags}
    />
  )
}

export default FlagSettingsPanel
