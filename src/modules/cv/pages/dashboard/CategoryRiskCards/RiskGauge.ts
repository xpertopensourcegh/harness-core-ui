const PLOT_LINE_LOCATIONS = [11, 22, 33, 44, 55, 66, 77, 88].map(degree => ({
  color: 'white',
  value: degree,
  zIndex: 10
}))

export default function getRiskGaugeChartOptions(riskScore: number): Highcharts.Options {
  let guageColor = 'var(--green-500)'
  if (riskScore > 30) {
    guageColor = 'var(--yellow-300)'
  }

  if (riskScore > 40) {
    guageColor = 'var(--yellow-500)'
  }

  if (riskScore >= 60) {
    guageColor = 'var(--orange-500)'
  }

  if (riskScore >= 80) {
    guageColor = 'var(--red-500)'
  }

  return {
    chart: {
      height: 55,
      width: 55,
      backgroundColor: 'transparent',
      spacing: [0, 0, 0, 0]
    },
    credits: {
      enabled: false
    },
    title: undefined,
    pane: {
      size: '100%',
      startAngle: -130,
      endAngle: 130,
      background: [
        {
          borderWidth: 0,
          innerRadius: '80%',
          outerRadius: '100%',
          shape: 'arc'
        }
      ]
    },
    tooltip: {
      enabled: false
    },
    xAxis: {
      tickAmount: 0
    },
    plotOptions: {
      gauge: {
        dataLabels: {
          enabled: false
        },
        dial: {
          radius: '60%',
          backgroundColor: guageColor,
          baseLength: '50%'
        },
        pivot: {
          backgroundColor: 'white',
          borderColor: guageColor,
          borderWidth: 2
        }
      }
    },
    yAxis: {
      lineWidth: 0,
      minorTickInterval: null,
      min: 0,
      max: 100,
      tickAmount: 0,
      tickColor: 'transparent',
      plotBands: [
        {
          thickness: 5,
          from: 0,
          to: riskScore,
          color: guageColor
        },
        {
          thickness: 5,
          from: riskScore,
          to: 100,
          color: '#EEE'
        }
      ],
      plotLines: PLOT_LINE_LOCATIONS,
      labels: {
        enabled: false
      }
    },
    series: [
      {
        name: 'Risk Score',
        type: 'gauge',
        data: [riskScore]
      }
    ]
  }
}
