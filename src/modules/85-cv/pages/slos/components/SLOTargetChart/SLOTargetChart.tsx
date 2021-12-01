import React, { useMemo, useState } from 'react'
import { merge } from 'lodash-es'
import type Highcharts from 'highcharts'
import { Button, ButtonVariation } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { TimeSeriesAreaChart } from '@common/components'
import { getDefaultChartOptions } from './SLOTargetChart.utils'

export interface SeriesData extends Omit<Highcharts.SeriesColumnOptions, 'type' | 'data'> {
  data?: Array<number | null>
}

interface SLOTargetChartProps {
  topLabel?: JSX.Element
  bottomLabel?: JSX.Element
  customChartOptions?: Highcharts.Options
}

const SLOTargetChart: React.FC<SLOTargetChartProps> = ({ topLabel, bottomLabel, customChartOptions = {} }) => {
  const { getString } = useStrings()
  const [show, setShow] = useState(false)
  const finalChartOptions = useMemo(() => merge(getDefaultChartOptions(), customChartOptions), [customChartOptions])

  const seriesData: SeriesData[] = [
    {
      data: [
        5, 40, 25, 20, 50, 70, 90, 10, 90, 40, 99, 77, 60, 99, 80, 80, 80, 75, 70, 40, 45, 50, 60, 65, 70, 65, 60, 55,
        50, 50
      ],
      showInLegend: false
    }
  ]

  if (show) {
    return (
      <div>
        {topLabel}
        <TimeSeriesAreaChart customChartOptions={finalChartOptions} seriesData={seriesData} />
        {bottomLabel}
      </div>
    )
  }

  return (
    <Button
      variation={ButtonVariation.TERTIARY}
      text={getString('cv.monitoringSources.gcoLogs.fetchRecords')}
      onClick={() => setShow(true)}
    />
  )
}

export default SLOTargetChart
