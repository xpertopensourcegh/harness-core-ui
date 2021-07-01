import React from 'react'
import { Layout, Container, Icon } from '@wings-software/uicore'
import { CCM_CHART_TYPES } from '@ce/constants'

interface ChartTypeSwitcherProps {
  chartType: CCM_CHART_TYPES
  setChartType: React.Dispatch<React.SetStateAction<CCM_CHART_TYPES>>
}

const ChartTypeSwitcher: React.FC<ChartTypeSwitcherProps> = ({ chartType, setChartType }) => {
  return (
    <Layout.Horizontal
      spacing="small"
      style={{
        alignItems: 'center',
        justifyContent: 'flex-end'
      }}
    >
      <Icon
        name="timeline-area-chart"
        onClick={() => {
          setChartType(CCM_CHART_TYPES.AREA)
        }}
        size={20}
        color={chartType === CCM_CHART_TYPES.AREA ? 'primary7' : 'grey400'}
      />
      <Icon
        name="timeline-bar-chart"
        onClick={() => {
          setChartType(CCM_CHART_TYPES.COLUMN)
        }}
        size={18}
        color={chartType === CCM_CHART_TYPES.COLUMN ? 'primary7' : 'grey400'}
      />
    </Layout.Horizontal>
  )
}

interface PerspectiveExplorerGroupByProps {
  setChartType: React.Dispatch<React.SetStateAction<CCM_CHART_TYPES>>
  chartType: CCM_CHART_TYPES
}

const PerspectiveExplorerGroupBy: React.FC<PerspectiveExplorerGroupByProps> = ({ chartType, setChartType }) => {
  return (
    <Container background="white" padding="small">
      <ChartTypeSwitcher chartType={chartType} setChartType={setChartType} />
    </Container>
  )
}

export default PerspectiveExplorerGroupBy
