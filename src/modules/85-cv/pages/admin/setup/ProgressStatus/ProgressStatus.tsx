import React from 'react'
import { Container, Text, Layout, Icon, Color } from '@wings-software/uicore'
import { String, useStrings } from 'framework/exports'
import { pluralize } from '@common/utils/StringUtils'
import css from '../CVSetupPage.module.scss'

interface ProgressStatusProps {
  numberOfServicesUsedInActivitySources: number | undefined
  numberOfServicesUsedInMonitoringSources: number | undefined
  totalNumberOfEnvironments: number | undefined
  totalNumberOfServices: number | undefined
  servicesUndergoingHealthVerification: number | undefined
}

const ProgressStatus: React.FC<ProgressStatusProps> = props => {
  const { getString } = useStrings()
  return (
    <Container height="100vh" background={Color.WHITE} padding="large" width={'20%'}>
      <div className={css.progressContainer}>
        <Text font={{ size: 'medium', weight: 'bold' }} color={Color.BLACK} padding="small">
          {getString('cv.onboarding.progress.heading')}
        </Text>
        <Layout.Vertical margin={{ top: 'large' }} spacing="medium">
          <Layout.Horizontal spacing="medium">
            <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
            <String
              stringID="cv.onboarding.progress.serviceEnvCount"
              vars={{
                serviceCount: props.totalNumberOfServices,
                envCount: props.totalNumberOfEnvironments,
                serviceLabel: `service${pluralize(props.totalNumberOfServices || 0)}`,
                environmentLabel: `environment${pluralize(props.totalNumberOfEnvironments || 0)}`
              }}
            />
          </Layout.Horizontal>
          {props.totalNumberOfServices && !props.numberOfServicesUsedInMonitoringSources ? (
            <String
              stringID="cv.onboarding.progress.mapServices"
              vars={{
                serviceLabel: `service${pluralize(props.totalNumberOfServices || 0)}`
              }}
            />
          ) : null}
          {props.numberOfServicesUsedInActivitySources ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
              <String
                stringID={
                  props.numberOfServicesUsedInActivitySources > 1
                    ? 'cv.onboarding.progress.multiServicesUsedInActivitySources'
                    : 'cv.onboarding.progress.servicesUsedInActivitySources'
                }
                vars={{
                  serviceCount: props.numberOfServicesUsedInActivitySources
                }}
              />
            </Layout.Horizontal>
          ) : null}
          {props.numberOfServicesUsedInMonitoringSources ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="tick-circle" size={16} color={Color.GREEN_500} />
              <String
                stringID={
                  props.numberOfServicesUsedInMonitoringSources > 1
                    ? 'cv.onboarding.progress.multiServiceUsedInMonitoringSources'
                    : 'cv.onboarding.progress.serviceUsedInMonitoringSources'
                }
                vars={{
                  serviceCount: props.numberOfServicesUsedInMonitoringSources
                }}
              />
            </Layout.Horizontal>
          ) : null}
          {props.servicesUndergoingHealthVerification ? (
            <Layout.Horizontal spacing="medium">
              <Icon name="cv-main" size={18} />
              <String
                stringID={
                  props.servicesUndergoingHealthVerification > 1
                    ? 'cv.onboarding.progress.multipleServicesUndergoingHealthVerification'
                    : 'cv.onboarding.progress.servicesUndergoingHealthVerification'
                }
                vars={{
                  serviceCount: props.servicesUndergoingHealthVerification
                }}
              />
            </Layout.Horizontal>
          ) : null}
        </Layout.Vertical>
      </div>
    </Container>
  )
}

export default ProgressStatus
