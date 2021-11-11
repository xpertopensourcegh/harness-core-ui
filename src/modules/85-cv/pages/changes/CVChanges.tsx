/* eslint-disable react-hooks/exhaustive-deps */
import { Container, MultiSelectDropDown, MultiSelectOption, Select, SelectOption } from '@wings-software/uicore'
import React, { useCallback, useEffect, useState } from 'react'
import type { Column } from 'react-table'
import moment from 'moment'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import {
  useGetHarnessEnvironments,
  useGetHarnessServices
} from '@cv/components/HarnessServiceAndEnvironment/HarnessServiceAndEnvironment'
import { useStrings } from 'framework/strings'
import type { TimeRangeParams } from 'services/cv'
import { getStartAndEndTime } from '@cv/components/ChangeTimeline/ChangeTimeline.utils'
import { TimeLine } from '@cv/components/Timeline/TimeLine'
import type { StringsMap } from 'stringTypes'
import { prepareFilterInfo } from '@cv/utils/CommonUtils'
import type { ChangeSourceTypes } from '@cv/pages/ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.constants'
import { ChangeSourceConnectorOptions } from '../ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.constants'
import type { CardSelectOption } from '../ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.types'
import { getChangeSourceOptions } from '../ChangeSource/ChangeSourceDrawer/ChangeSourceDrawer.utils'
import { HorizontalLayout } from '../health-source/common/StyledComponents'
import { TimePeriodEnum } from '../monitored-service/components/ServiceHealth/ServiceHealth.constants'
import { getTimePeriods } from '../monitored-service/components/ServiceHealth/ServiceHealth.utils'
import { ChangesHeader, ChangeTimeLineHeader, PBody } from './changes.styled'
import ChangesTable from '../monitored-service/components/ServiceHealth/components/ChangesAndServiceDependency/components/ChangesTable/ChangesTable'
import {
  renderChangeType,
  renderImpact,
  renderName,
  renderTime,
  renderType
} from '../monitored-service/components/ServiceHealth/components/ChangesAndServiceDependency/components/ChangesTable/ChangesTable.utils'
import css from './CVChanges.module.scss'

export const CVChanges = ({ updateTime }: { updateTime?: Date }): JSX.Element => {
  const { serviceOptions } = useGetHarnessServices()
  const { environmentOptions } = useGetHarnessEnvironments()
  const { getString } = useStrings()
  const sourceTypes = getChangeSourceOptions(getString)
  const connectorOptions = ChangeSourceConnectorOptions.map((option: CardSelectOption) => ({
    label: getString(option.label as keyof StringsMap),
    value: option.value
  }))
  const [selectedTimePeriod, setSelectedTimePeriod] = useState<SelectOption>({
    value: TimePeriodEnum.TWENTY_FOUR_HOURS,
    label: getString('cv.monitoredServices.serviceHealth.last24Hrs')
  })
  const [selectedServices, setSelectedServices] = useState<MultiSelectOption[]>()
  const [selectedEnvs, setSelectedEnvs] = useState<MultiSelectOption[]>()
  const [selectedChangeTypes, setSelectedCchangeTypes] = useState<MultiSelectOption[]>()
  const [selectedSources, setSelectedSSources] = useState<MultiSelectOption[]>()
  const [timestamps, setTimestamps] = useState<number[]>([])
  const [timeRange, setTimeRange] = useState<TimeRangeParams>()
  const [showTimelineSlider, setShowTimelineSlider] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>()

  useEffect(() => {
    setLastUpdated(updateTime || new Date())
  }, [selectedServices, selectedEnvs, selectedChangeTypes, selectedSources, selectedTimePeriod])
  const getFilteredText = useCallback(
    (selectedOptions: MultiSelectOption[] = [], filterText = ' '): string => {
      const baseText = getString(filterText as keyof StringsMap)
      return selectedOptions?.length > 0 ? baseText : baseText + ': All'
    },
    [selectedServices, selectedEnvs, selectedChangeTypes, selectedSources, selectedTimePeriod]
  )
  const columns: Column<any>[] = [
    {
      Header: getString('timeLabel'),
      Cell: renderTime,
      accessor: 'eventTime',
      width: '15%'
    },
    {
      Header: getString('description'),
      Cell: renderName,
      accessor: 'name',
      width: '30%'
    },
    {
      Header: getString('cv.cvChanges.monitoredSVC' as keyof StringsMap),
      Cell: renderImpact,
      accessor: 'serviceIdentifier',
      width: '25%'
    },
    {
      Header: getString('typeLabel'),
      width: '15%',
      accessor: 'category',
      Cell: renderChangeType
    },
    {
      Header: getString('source'),
      Cell: renderType,
      accessor: 'type',
      width: '15%'
    }
  ]

  const queryParams = {
    serviceIdentifier: ((prepareFilterInfo(selectedServices).length > 0 && prepareFilterInfo(selectedServices)) ||
      prepareFilterInfo(serviceOptions)) as string[],
    environmentIdentifier: ((prepareFilterInfo(selectedEnvs).length > 0 && prepareFilterInfo(selectedEnvs)) ||
      prepareFilterInfo(environmentOptions)) as string[],
    changeSourceTypes: ((prepareFilterInfo(selectedSources).length > 0 && prepareFilterInfo(selectedSources)) ||
      prepareFilterInfo(connectorOptions)) as ChangeSourceTypes[],
    changeCategories: ((prepareFilterInfo(selectedChangeTypes).length > 0 && prepareFilterInfo(selectedChangeTypes)) ||
      prepareFilterInfo(sourceTypes)) as ('Infrastructure' | 'Deployment' | 'Alert')[]
  }
  return (
    <>
      <ChangesHeader height={'80px'}>
        <HorizontalLayout alignItem={'flex-end'}>
          <NGBreadcrumbs />
        </HorizontalLayout>
        <p>{getString('changes')}</p>
      </ChangesHeader>
      <ChangeTimeLineHeader>
        <Container className={css.serviceHealthCard} flex style={{ justifyContent: 'flex-start' }}>
          <Select
            value={selectedTimePeriod}
            items={getTimePeriods(getString)}
            className={css.timePeriods}
            onChange={setSelectedTimePeriod}
          />

          <MultiSelectDropDown
            placeholder={getFilteredText(selectedServices, 'services')}
            value={selectedServices}
            items={serviceOptions}
            className={css.timePeriods}
            onChange={setSelectedServices}
          />

          <MultiSelectDropDown
            placeholder={getFilteredText(selectedEnvs, 'environments')}
            value={selectedEnvs}
            items={environmentOptions}
            className={css.timePeriods}
            onChange={setSelectedEnvs}
          />
          <MultiSelectDropDown
            placeholder={getFilteredText(selectedChangeTypes, 'cv.cvChanges.changeTypeFilterDefault')}
            value={selectedChangeTypes}
            items={sourceTypes}
            className={css.timePeriods}
            onChange={setSelectedCchangeTypes}
          />

          <MultiSelectDropDown
            placeholder={getFilteredText(selectedSources, 'cv.cvChanges.sourceFilterDefault')}
            value={selectedSources}
            items={connectorOptions}
            className={css.timePeriods}
            onChange={setSelectedSSources}
          />
        </Container>
      </ChangeTimeLineHeader>
      <PBody>
        <HorizontalLayout>
          <p className={css.timelineText}>{getString('cv.cvChanges.changesTimeline')}</p>
          <p className={css.timelineText}>{`${getString('lastUpdated')}: ${moment(lastUpdated).format('lll')}`}</p>
        </HorizontalLayout>
        <Container>
          <>
            <TimeLine
              {...queryParams}
              monitoredServiceIdentifier={''}
              selectedTimePeriod={selectedTimePeriod}
              timeRange={timeRange}
              setTimeRange={setTimeRange}
              timestamps={timestamps}
              setTimestamps={setTimestamps}
              showTimelineSlider={showTimelineSlider}
              setShowTimelineSlider={setShowTimelineSlider}
              isOptionalHealthSource={true}
              resetFilter={lastUpdated}
            />
          </>
        </Container>
        <Container>
          <ChangesTable
            startTime={
              showTimelineSlider
                ? (timeRange?.startTime as number)
                : getStartAndEndTime((selectedTimePeriod?.value as string) || '').startTimeRoundedOffToNearest30min
            }
            endTime={
              showTimelineSlider
                ? (timeRange?.endTime as number)
                : getStartAndEndTime((selectedTimePeriod?.value as string) || '').endTimeRoundedOffToNearest30min
            }
            hasChangeSource={true}
            {...queryParams}
            recordsPerPage={25}
            customCols={columns}
          />
        </Container>
      </PBody>
    </>
  )
}