import moment from 'moment'
import type Highcharts from 'highcharts'

export const getDefaultChartOptions = (): Highcharts.Options => ({
  chart: {
    spacing: [20, 0, 0, 0]
  },
  xAxis: {
    tickInterval: 60 * 60 * 1000 * 4,
    allowDecimals: false,
    labels: {
      formatter: function () {
        return moment(this.value).format('h:mm A')
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
