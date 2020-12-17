import React, { useEffect, useMemo, useState } from 'react'
import { Color, Container, OverlaySpinner, Text, TextProps } from '@wings-software/uikit'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import HeatMap, { CellStatusValues, SerieConfig } from '@common/components/HeatMap/HeatMap'
import { HeatMapDTO, useGetHeatmap } from 'services/cv'
import { RiskScoreTile } from '@cv/components/RiskScoreTile/RiskScoreTile'
import { useStrings } from 'framework/exports'
import useAnalysisDrillDownView from '../analysis-drilldown-view/useAnalysisDrillDownView'
import i18n from './ServiceHeatMap.i18n'
import css from './Service_Heatmap.module.scss'

interface ServiceHeatMapProps {
  startTime: number
  endTime: number
  environmentIdentifier?: string
  serviceIdentifier?: string
}

const HeatMapTitleTextProps: TextProps = {
  margin: { bottom: 'xsmall' },
  font: { size: 'small' }
}

function HeatMapTooltip({ cell }: { cell?: HeatMapDTO }): JSX.Element {
  return cell ? (
    <Container className={css.heatmapTooltip}>
      {cell.startTime && cell.endTime && (
        <Text>{`${moment(cell.startTime).format('M/D/YYYY h:mm a')} - ${moment(cell.endTime).format(
          'M/D/YYYY h:mm a'
        )}`}</Text>
      )}
      <Container className={css.overallScoreContent}>
        <Text font={{ size: 'small' }}>{i18n.heatMapTooltipText.overallRiskScore}</Text>
        <RiskScoreTile riskScore={Math.floor((cell?.riskScore || 0) * 100)} isSmall />
      </Container>
    </Container>
  ) : (
    <Container className={css.heatmapTooltip}>
      <Text className={css.overallScoreContent}>{i18n.heatMapTooltipText.noData}</Text>
    </Container>
  )
}

function mapHeatmapValue(val: any): number | CellStatusValues {
  return val && typeof val.riskScore === 'number' ? val.riskScore : CellStatusValues.Missing
}

function getHeatmapCellTimeRange(heatmapData: HeatMapDTO[]): string {
  if (!heatmapData?.length) return ''
  const timeDifference = moment(heatmapData[0]?.endTime).diff(heatmapData[0]?.startTime, 'minutes')
  if (timeDifference > 60) {
    return `(${moment(heatmapData[0]?.endTime).diff(heatmapData[0]?.startTime, 'hours')} ${i18n.hours} ${
      i18n.heatmapCellTimeRangeText
    })`
  }
  return `(${timeDifference} ${i18n.minutes} ${i18n.heatmapCellTimeRangeText})`
}

export default function ServiceHeatMap(props: ServiceHeatMapProps): JSX.Element {
  const { serviceIdentifier, environmentIdentifier, startTime, endTime } = props
  const { openDrillDown } = useAnalysisDrillDownView()
  const [heatmapData, setHeatmapData] = useState<SerieConfig[]>([])
  const { accountId, projectIdentifier, orgIdentifier } = useParams()
  const { getString } = useStrings()

  const categoryNames: any = {
    Performance: getString('performance'),
    Errors: getString('quality'),
    Infrastructure: getString('infrastructure')
  }
  const translationToCategoryName = (value: string) => {
    const entry = Object.entries(categoryNames).find(([_, text]) => text === value)
    return entry && entry[0]
  }

  const { loading: loadingHeatmap, refetch: getHeatmap } = useGetHeatmap({
    lazy: true,
    resolve: response => {
      setHeatmapData(
        !response?.resource
          ? []
          : Object.keys(response.resource).map((key: string) => ({
              name: categoryNames[key],
              data: response?.resource[key]
            }))
      )
      return response
    }
  })

  useEffect(() => {
    if (!startTime || !endTime) return
    getHeatmap({
      queryParams: {
        accountId: accountId,
        envIdentifier: environmentIdentifier,
        serviceIdentifier,
        projectIdentifier: projectIdentifier as string,
        orgIdentifier: orgIdentifier as string,
        startTimeMs: startTime,
        endTimeMs: endTime
      }
    })
  }, [projectIdentifier, startTime, endTime, serviceIdentifier, environmentIdentifier])

  const heatMapSize = useMemo(() => {
    return Math.max(...heatmapData.map(({ data }) => data.length)) || 48
  }, [heatmapData])

  return (
    <Container className={css.main}>
      <Text {...HeatMapTitleTextProps} color={Color.BLACK}>
        {`${i18n.heatmapSectionTitleText} ${getHeatmapCellTimeRange(heatmapData?.[0]?.data)}`}
      </Text>
      <OverlaySpinner show={loadingHeatmap}>
        <HeatMap
          series={heatmapData}
          minValue={0}
          maxValue={1}
          labelsWidth={205}
          className={css.serviceHeatMap}
          mapValue={mapHeatmapValue}
          renderTooltip={(cell: HeatMapDTO) => <HeatMapTooltip cell={cell} />}
          cellShapeBreakpoint={0.5}
          onCellClick={(cell: HeatMapDTO, rowData) => {
            if (cell.startTime && cell.endTime) {
              openDrillDown({
                categoryRiskScore: cell.riskScore ? Math.floor(cell.riskScore * 100) : 0,
                analysisProps: {
                  startTime: cell.startTime,
                  endTime: cell.endTime,
                  categoryName: translationToCategoryName(rowData?.name),
                  environmentIdentifier,
                  serviceIdentifier
                }
              })
            }
          }}
          rowSize={heatMapSize}
        />
      </OverlaySpinner>
    </Container>
  )
}
