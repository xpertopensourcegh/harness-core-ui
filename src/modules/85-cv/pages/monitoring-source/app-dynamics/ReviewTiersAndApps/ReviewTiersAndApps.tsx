import React, { useMemo, useState } from 'react'
import { Container, Text, Color, Layout, Icon } from '@wings-software/uikit'
import groupBy from 'lodash-es/groupBy'
import { useParams } from 'react-router-dom'
import Table from '@common/components/Table/Table'
import { useStrings } from 'framework/exports'
import { SubmitAndPreviousButtons } from '@cv/pages/onboarding/SubmitAndPreviousButtons/SubmitAndPreviousButtons'
import { useSaveDataSourceCVConfigs, DSConfig } from 'services/cv'
import { PageSpinner } from '@common/components/Page/PageSpinner'
import { ValidationStatus } from '../AppDOnboardingUtils'
import type { TierRecord } from '../AppDOnboardingUtils'
import styles from './ReviewTiersAndApps.module.scss'

interface ReviewTiersAndAppsProps {
  [key: string]: any
  onCompleteStep: (data: object) => void
  onPrevious?: () => void
}

export default function ReviewTiersAndApps({ stepData, onPrevious }: ReviewTiersAndAppsProps) {
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const { getString } = useStrings()
  const { accountId, projectIdentifier, orgIdentifier } = useParams()

  const { mutate: saveDSConfigs, loading } = useSaveDataSourceCVConfigs({})

  const { applications, tiers } = stepData

  const tableData = useMemo(() => {
    const tiersByAppId = groupBy(tiers, 'appId')
    return Object.keys(tiersByAppId).map(appId => {
      const ret: any = {}
      ret.name = applications[appId].name
      ret.tiers = tiersByAppId[appId][0].totalTiers
      ret.environment = applications[appId].environment
      ret.tiersPercentage = Math.floor((tiersByAppId[appId].length * 100) / tiersByAppId[appId][0].totalTiers)
      ret.status = ''
      ret.validationErrors = tiersByAppId[appId].filter(tier => tier.status === ValidationStatus.ERROR).length
      return ret
    })
  }, [applications, tiers])

  const onNext = async () => {
    const { identifier, connectorRef, product, applications: appsData, tiers: tiersData, metricPacks } = stepData
    const tiersByAppId = groupBy(tiersData, 'appId')
    const payload: DSConfig[] = Object.keys(appsData)
      .filter(appId => !!tiersByAppId[appId])
      .map(appId => ({
        identifier: identifier + Math.random(),
        connectorIdentifier: connectorRef?.value,
        type: 'APP_DYNAMICS',
        accountId,
        metricPacks,
        serviceMappings: tiersByAppId[appId].map((tier: TierRecord) => ({
          tierName: tier.name,
          serviceIdentifier: tier.service
        })),
        envIdentifier: appsData[appId].environment,
        projectIdentifier: projectIdentifier as string,
        orgIdentifier: orgIdentifier as string,
        productName: product,
        applicationName: appsData[appId].name
      }))
    await saveDSConfigs(payload, { queryParams: { accountId } })
    setShowSuccessMessage(true)
  }

  return (
    <Container>
      {loading && <PageSpinner />}
      {showSuccessMessage && (
        <Container className={styles.successMessage}>
          <Icon name="tick-circle" color={Color.GREEN_500} size={26} />
          <Text color={Color.GREEN_500}>Configs were successfully saved</Text>
        </Container>
      )}
      {!showSuccessMessage && (
        <Table
          columns={[
            {
              id: '1',
              Header: getString('cv.monitoringSources.appD.appDApplications'),
              accessor: 'name',
              width: '25%',
              disableSortBy: true,
              Cell: function NameCell({ value }: any) {
                return <Text icon="service-appdynamics">{value}</Text>
              }
            },
            {
              id: '2',
              Header: 'Tiers',
              accessor: 'tiers',
              width: '10%',
              disableSortBy: true
            },
            {
              id: '3',
              Header: getString('cv.monitoringSources.appD.mapToHarnessEnvironment'),
              accessor: 'environment',
              width: '20%',
              disableSortBy: true,
              Cell: function EnvironmentCell({ value }: any) {
                return <Text icon="harness">{value}</Text>
              }
            },
            {
              id: '4',
              Header: getString('cv.monitoringSources.appD.harnessServices'),
              accessor: 'tiersPercentage',
              width: '15%',
              disableSortBy: true,
              Cell: ServicesCell
            },
            {
              id: '5',
              Header: getString('cv.monitoringSources.appD.status'),
              accessor: 'status',
              width: '15%',
              disableSortBy: true
            },
            {
              id: '6',
              Header: getString('cv.monitoringSources.appD.validation'),
              accessor: 'validationErrors',
              width: '15%',
              disableSortBy: true,
              Cell: ValidationCell
            }
          ]}
          data={tableData}
        />
      )}
      <SubmitAndPreviousButtons onPreviousClick={onPrevious} onNextClick={onNext} />
    </Container>
  )
}

function ServicesCell({ value }: any) {
  const { getString } = useStrings()
  const color = value < 20 ? Color.RED_500 : value < 51 ? Color.ORANGE_500 : Color.GREEN_500
  return (
    <Layout.Horizontal>
      <Container color={color} margin={{ right: 'xsmall' }}>{`${value}%`}</Container>
      <Text>{getString('cv.monitoringSources.appD.tiersMappedToServices')}</Text>
    </Layout.Horizontal>
  )
}

function ValidationCell({ value }: any) {
  const { getString } = useStrings()
  if (value > 0) {
    return (
      <Text icon="warning-sign" iconProps={{ color: Color.RED_500 }}>
        {value} {getString('cv.monitoringSources.appD.errorsFound')}
      </Text>
    )
  } else {
    return <Text icon="tick" iconProps={{ color: Color.GREEN_500 }} />
  }
}
