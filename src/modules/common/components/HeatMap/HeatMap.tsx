import React from 'react'
import { Color, Container, Text } from '@wings-software/uikit'
import { Popover, PopoverInteractionKind } from '@blueprintjs/core'
import isUndefined from 'lodash/isUndefined'
import classnames from 'classnames'
import { getColorStyle } from './ColorUtils'
import styles from './HeatMap.module.scss'

export interface SerieConfig {
  name?: string
  data: Array<any>
}

export interface HeatMapProps {
  series: Array<SerieConfig> | SerieConfig
  minValue: number
  maxValue: number
  mapValue(cell: any): number | CellStatusValues
  cellShapeBreakpoint?: number
  /**
   * This property can be used if series are not prepared yet, to render placehoders,
   * or to limit the row sizes.
   */
  rowSize?: number
  onCellClick?(cell: any, serie: any): void
  renderTooltip?(cell: any): JSX.Element | null
  labelsWidth?: number
  className?: string
  cellClassName?: string
}

export enum CellStatusValues {
  Missing = 'Missing',
  Empty = 'Empty',
  Error = 'Error'
}

const specialColorValue = {
  MISSING: Color.GREY_200,
  EMPTY: Color.GREY_250,
  ERROR: Color.RED_800
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
  cellShapeBreakpoint,
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
    const value: number | CellStatusValues = mapValue(cell)
    if (value === CellStatusValues.Missing) {
      return { color: specialColorValue.MISSING }
    } else if (value === CellStatusValues.Empty) {
      return { color: specialColorValue.EMPTY }
    } else if (value === CellStatusValues.Error) {
      return { color: specialColorValue.ERROR }
    }
    return {
      colorClassName: getColorStyle(value, minValue, maxValue)
    }
  }

  const addCircleClass = (cell: any) => {
    if (isUndefined(cellShapeBreakpoint)) {
      return ''
    }
    const value: any = mapValue(cell)
    return typeof value === 'number' && value >= cellShapeBreakpoint ? '' : styles.cellCircle
  }

  const showLabels = series.some(serie => !isUndefined(serie.name))

  return (
    <Container className={classnames(styles.heatMap, className)}>
      {series.map((serie, serieIndex) => (
        <div key={serieIndex} className={styles.heatMapRow}>
          {showLabels && (
            <span className={styles.nameWrapper}>
              <Text font={{ weight: 'bold', size: 'small' }} width={labelsWidth}>
                {serie.name}
              </Text>
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
                    onClick={() => onCellClick && onCellClick(cell, serie)}
                    {...mapColor(cell)}
                    className={classnames(cellClassName, addCircleClass(cell))}
                  />
                )
            )}
            {serie.data.length < rowLimit &&
              new Array(rowLimit - serie.data.length)
                .fill(null)
                .map((_, index) => (
                  <HeatMapCell
                    key={serie.data.length + index}
                    color={specialColorValue.MISSING}
                    className={classnames(cellClassName, addCircleClass(null))}
                    popoverDisabled
                  />
                ))}
          </div>
        </div>
      ))}
    </Container>
  )
}

export function HeatMapCell({
  color,
  colorClassName,
  className,
  popoverDisabled = false,
  popoverContent,
  onClick
}: any) {
  return (
    <Container onClick={onClick} className={classnames(styles.cell, className)}>
      <Popover
        className={styles.cellContentWrapper}
        disabled={popoverDisabled}
        content={popoverContent}
        interactionKind={PopoverInteractionKind.HOVER_TARGET_ONLY}
        modifiers={PopoverModifies}
        boundary="window"
      >
        <Container className={classnames(styles.cellInner, colorClassName)} background={color} />
      </Popover>
    </Container>
  )
}
