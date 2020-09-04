import styles from './HeatMapColors.module.scss'

export const colors = [
  styles.heatmapColor1,
  styles.heatmapColor2,
  styles.heatmapColor3,
  styles.heatmapColor4,
  styles.heatmapColor5,
  styles.heatmapColor6,
  styles.heatmapColor7,
  styles.heatmapColor8,
  styles.heatmapColor9,
  styles.heatmapColor10
]

export function getColorStyle(value: number, minValue = 0, maxValue = 1) {
  const limitedValue = Math.max(Math.min(value, maxValue), minValue)
  let colorIndex = ((limitedValue - minValue) * (colors.length - 1)) / (maxValue - minValue)
  colorIndex = Math.round(colorIndex)
  return colors[colorIndex]
}
