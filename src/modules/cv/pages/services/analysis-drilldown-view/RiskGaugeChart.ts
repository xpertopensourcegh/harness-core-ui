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
      height: 65,
      width: 65
    },
    credits: {
      enabled: false
    },
    title: undefined,
    pane: {
      size: '100%',
      startAngle: -150,
      endAngle: 150,
      background: [
        {
          backgroundColor: '#EEE',
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
      solidgauge: {
        dataLabels: {
          borderWidth: 0
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
      stops: [[1.0, guageColor]],
      plotLines: [
        {
          color: 'white',
          value: 20,
          zIndex: 10
        },
        {
          color: 'white',
          value: 50,
          zIndex: 10
        },
        {
          color: 'white',
          value: 80,
          zIndex: 10
        }
      ],
      labels: {
        enabled: false
      }
    },
    series: [
      {
        name: 'Risk Score',
        type: 'solidgauge',
        data: [riskScore],
        dataLabels: {
          format: `<div style="text-align:center; border: none; display: flex; flex-direction: column; position: relative; top: 22px; font-family: var(--font-family)">
             <p style="color:${guageColor}">{y}</p>
             <p style="text-align: center; color: black; font-weight: 200; font-size: var(--font-size-xsmall); position: relative; top: 5px; font-family: var(--font-family)">Risk Score</p>
            </div>`,
          y: 100,
          useHTML: true
        },
        radius: 80,
        innerRadius: 100
      }
    ]
  }
}
