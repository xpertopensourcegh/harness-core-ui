import React from 'react'
import { Color, Container, Text } from '@wings-software/uikit'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import isUndefined from 'lodash/isUndefined'
import classnames from 'classnames'
import styles from './HeatMap.module.scss'

export interface SerieConfig {
  name?: string
  data: Array<any>
}

export interface HeatMapProps {
  series: Array<SerieConfig> | SerieConfig
  minValue: number
  maxValue: number
  mapValue(cell: any): number
  /**
   * This property can be used if series are not prepared yet, to render placehoders,
   * or to limit the row sizes.
   */
  rowSize?: number
  onCellClick?(cell: any): void
  renderTooltip?(cell: any): JSX.Element
  labelsWidth?: number
  className?: string
  cellClassName?: string
}

export enum CellStatusValues {
  Empty = 'Empty',
  Error = 'Error'
}

const colors = [
  Color.GREEN_500,
  Color.GREEN_400,
  Color.GREEN_350,
  Color.GREEN_300,
  Color.YELLOW_400,
  Color.YELLOW_450,
  Color.YELLOW_500,
  Color.ORANGE_500,
  Color.RED_500,
  Color.RED_600
]

const specialColorValues = {
  empty: Color.GREY_200,
  error: Color.RED_800
}

const PopoverModifies = {
  arrow: { enabled: true },
  flip: { enabled: true },
  keepTogether: { enabled: true }
}

export default function HeatMap({
  series: seriesProp,
  minValue,
  maxValue,
  mapValue,
  rowSize,
  onCellClick,
  renderTooltip,
  labelsWidth = 125,
  className,
  cellClassName
}: HeatMapProps) {
  const series = Array.isArray(seriesProp) ? seriesProp : [seriesProp]
  let rowLimit: number
  if (!isUndefined(rowSize)) {
    rowLimit = rowSize
  } else {
    rowLimit = series.reduce((a, c) => Math.max(a, c.data.length), 0)
  }

  const mapColor = (cell: any) => {
    let value: any = mapValue(cell)
    if (value === CellStatusValues.Empty) {
      return specialColorValues.empty
    } else if (value === CellStatusValues.Error) {
      return specialColorValues.error
    }
    value = Math.max(Math.min(mapValue(cell), maxValue), minValue)
    let colorIndex = ((value - minValue) * (colors.length - 1)) / (maxValue - minValue)
    colorIndex = Math.round(colorIndex)
    return colors[colorIndex]
  }

  const showLabels = series.some(serie => !isUndefined(serie.name))

  return (
    <Container className={classnames(styles.heatMap, className)}>
      {series.map((serie, serieIndex) => (
        <div key={serieIndex} className={styles.heatMapRow}>
          {showLabels && (
            <span className={styles.nameWrapper}>
              <Text width={labelsWidth}>{serie.name}</Text>
            </span>
          )}
          <div className={styles.rowValues}>
            {serie.data.map(
              (cell, index) =>
                index < rowLimit && (
                  <HeatMapCell
                    key={index}
                    popoverDisabled={!renderTooltip}
                    popoverContent={renderTooltip && renderTooltip(cell)}
                    onClick={() => onCellClick && onCellClick(cell)}
                    color={mapColor(cell)}
                  />
                )
            )}
            {serie.data.length < rowLimit &&
              new Array(rowLimit - serie.data.length)
                .fill(null)
                .map((_, index) => (
                  <HeatMapCell
                    key={serie.data.length + index}
                    color={specialColorValues.empty}
                    className={cellClassName}
                    popoverDisabled
                  />
                ))}
          </div>
        </div>
      ))}
    </Container>
  )
}

export function HeatMapCell({ color, className, popoverDisabled = false, popoverContent, onClick }: any) {
  return (
    <Container onClick={onClick} background={color} className={classnames(styles.cell, className)}>
      <Popover
        disabled={popoverDisabled}
        content={popoverContent}
        interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
        modifiers={PopoverModifies}
        boundary="window"
      >
        <div />
      </Popover>
    </Container>
  )
}
