import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Classes } from '@blueprintjs/core'
import { isNumber } from 'lodash-es'
import cx from 'classnames'
import { Checkbox, Container, Text } from '@wings-software/uicore'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { getErrorMessage } from '@cv/utils/CommonUtils'
import { useStrings } from 'framework/strings'
import { useGetMetricPacks, GetMetricPacksQueryParams, MetricPackDTO } from 'services/cv'
import type { StepLabelProps } from '../../../components/CVSetupSourcesView/StepLabel/StepLabel'
import { SetupSourceCardHeader } from '../../../components/CVSetupSourcesView/SetupSourceCardHeader/SetupSourceCardHeader'
import css from './SelectMetricPack.module.scss'

const LoadingCells = [1, 2, 3]
export interface SelectMetricPackProps {
  stepProps?: StepLabelProps
  className?: string
  dataSourceType: GetMetricPacksQueryParams['dataSourceType']
  selectedMetricPacks?: MetricPackDTO[]
  onSelectMetricPack?: (selectedMetricPacks: MetricPackDTO[]) => void
}

export function updateSelectedMetricPacks(
  metricPack: MetricPackDTO,
  isSelected: boolean,
  selectedPacks: MetricPackDTO[]
): MetricPackDTO[] {
  const existingPackIndex = selectedPacks?.findIndex(pack => pack.uuid === metricPack.uuid)
  if (isNumber(existingPackIndex) && existingPackIndex > -1 && !isSelected) {
    selectedPacks.splice(existingPackIndex, 1)
    return [...selectedPacks]
  } else if (isSelected && (!existingPackIndex || existingPackIndex === -1)) {
    selectedPacks.push(metricPack)
    return [...selectedPacks]
  }

  return selectedPacks
}

export function SelectMetricPack(props: SelectMetricPackProps): JSX.Element {
  const { stepProps, dataSourceType, onSelectMetricPack, selectedMetricPacks: propSelectedPacks, className } = props
  const { projectIdentifier, orgIdentifier, accountId } = useParams<ProjectPathProps>()
  const { getString } = useStrings()
  const { loading, data, error } = useGetMetricPacks({
    queryParams: { accountId, projectIdentifier, orgIdentifier, dataSourceType }
  })
  const [selectedMetricPacks, setSelectedMetricPacks] = useState<MetricPackDTO[]>(propSelectedPacks || [])

  useEffect(() => {
    if (!loading && data?.resource?.length && !propSelectedPacks?.length) {
      setSelectedMetricPacks([...data?.resource])
      onSelectMetricPack?.([...data?.resource])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.resource, loading])

  return (
    <Container className={cx(css.main, className)}>
      <SetupSourceCardHeader
        stepLabelProps={stepProps}
        mainHeading={getString('cv.onboarding.monitoringSources.selectMetricPacks')}
        subHeading={getString('cv.onboarding.monitoringSources.metricPacksToMonitor')}
      />
      <Container className={css.packs}>
        {error && (
          <Text intent="danger" lineClamp={1}>
            {getErrorMessage(error)}
          </Text>
        )}
        {loading
          ? LoadingCells.map(val => (
              <Container key={val} className={cx(Classes.SKELETON, css.loading)} height={15} width={100} />
            ))
          : data?.resource?.map(metricPack => {
              if (!metricPack?.uuid || !metricPack.metrics?.length || !metricPack.category) return null
              return (
                <Checkbox
                  name={metricPack.category}
                  label={metricPack.category}
                  key={metricPack?.uuid || ''}
                  checked={selectedMetricPacks.some(pack => pack.category === metricPack.category)}
                  onChange={e => {
                    const metricPacks = updateSelectedMetricPacks(
                      metricPack,
                      e.currentTarget.checked,
                      selectedMetricPacks
                    )
                    onSelectMetricPack?.(metricPacks)
                    setSelectedMetricPacks(metricPacks)
                  }}
                />
              )
            })}
      </Container>
    </Container>
  )
}
