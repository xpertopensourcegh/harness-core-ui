import type Highcharts from 'highcharts'

export const getDefaultChartOptions = (): Highcharts.Options => ({
  chart: {
    width: 450,
    height: 200,
    spacing: [20, 0, 0, 0]
  },
  xAxis: {
    min: 1,
    tickInterval: 10,
    allowDecimals: false,
    labels: {
      formatter: function () {
        return `${this.value} days`
      }
    }
  },
  yAxis: {
    max: 100,
    tickInterval: 25,
    labels: {
      formatter: function () {
        return `${this.value}%`
      }
    }
  },
  tooltip: {
    enabled: false
  },
  plotOptions: {
    area: {
      color: 'var(--primary-3)',
      marker: {
        enabled: false,
        states: {
          hover: {
            enabled: false
          }
        }
      }
    }
  }
})
