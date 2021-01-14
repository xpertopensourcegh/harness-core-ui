import React, { useState, useEffect } from 'react'
import { Color, Layout, Text, Container, TextInput } from '@wings-software/uicore'
import { sumBy } from 'lodash-es'
import type { Distribution, WeightedVariation, Variation } from 'services/cf'
import css from './TabTargeting.module.scss'

const Colors = [
  '#4065A0',
  '#65DEF2',
  '#E3B14F',
  '#42AB45',
  '#D9DAE5',
  '#00ADE4',
  '#f78383',
  '#e59c0b',
  '#7c8d9f',
  '#8c78ed',
  '#ff8f3f',
  '#ed61b5'
]

interface PercentageValues {
  id: string
  displayName: string
  value: number
  color: string
}

interface PercentageRolloutProps {
  editing: boolean
  bucketBy?: string
  variations: Variation[]
  weightedVariations: WeightedVariation[]
  onSetPercentageValues?(value: Distribution): void
}

const PercentageRollout: React.FC<PercentageRolloutProps> = ({
  editing,
  bucketBy,
  weightedVariations,
  variations,
  onSetPercentageValues
}) => {
  const [bucketByValue, setBucketByValue] = useState<string>(bucketBy || 'identifier')
  const [percentageValues, setPercentageValues] = useState<PercentageValues[]>([])
  const [percentageError, setPercentageError] = useState(false)

  const variationsToPercentage = variations?.map((elem, i) => {
    const weightedVariation = weightedVariations.find(wvElem => wvElem.variation === elem.identifier)
    return {
      id: elem.identifier,
      displayName: elem.name || elem.value,
      value: weightedVariation?.weight || 100 / variations?.length,
      color: Colors[i % Colors.length]
    }
  })

  const changeColorWidthSlider = (e: React.ChangeEvent<HTMLInputElement>, id: string): void => {
    const percentageThreshold = 100

    if (percentageValues) {
      const onUpdateValue = percentageValues.map(elem => {
        if (elem.id === id) {
          return { ...elem, value: +e.target.value }
        }
        return elem
      })

      const valueOfInputs = sumBy(onUpdateValue, 'value')

      if (valueOfInputs > percentageThreshold) {
        return setPercentageError(true)
      } else {
        setPercentageError(false)
      }

      setPercentageValues(onUpdateValue)
    }
  }

  useEffect(() => {
    setPercentageValues(variationsToPercentage)
  }, [])

  useEffect(() => {
    onSetPercentageValues?.({
      bucketBy: bucketByValue,
      variations: percentageValues.map(elem => ({
        variation: elem.id,
        weight: elem.value
      }))
    })
  }, [bucketByValue, percentageValues])

  return (
    <Container>
      <Layout.Horizontal margin={{ bottom: editing ? 'small' : 'medium' }} style={{ alignItems: 'baseline' }}>
        <Text margin={{ right: 'small' }}>Bucket by</Text>
        {editing ? (
          <TextInput
            defaultValue={bucketByValue}
            onChange={(ev: React.ChangeEvent<HTMLInputElement>) => setBucketByValue(ev.target.value)}
          />
        ) : (
          <Text>{bucketByValue}</Text>
        )}
      </Layout.Horizontal>
      <div
        style={{
          borderRadius: '10px',
          border: '1px solid #ccc',
          width: '300px',
          height: '15px',
          display: 'flex',
          overflow: 'hidden'
        }}
      >
        {percentageValues?.map(elem => (
          <span
            key={elem.id}
            style={{
              width: `${elem.value}%`,
              backgroundColor: elem.color,
              display: 'inline-block',
              height: '13px'
            }}
          />
        ))}
      </div>
      <Container margin={{ top: 'small' }}>
        {percentageValues?.length &&
          percentageValues?.map((elem, i) => (
            <Layout.Horizontal key={`${elem.id}-${i}`} margin={{ bottom: 'small' }} style={{ alignItems: 'baseline' }}>
              <span
                className={css.circle}
                style={{ backgroundColor: percentageValues[i].color, marginRight: '10px' }}
              ></span>
              <Text margin={{ right: 'medium' }} width={100}>
                {elem.id}
              </Text>
              {editing ? (
                <input
                  type="number"
                  onChange={e => changeColorWidthSlider(e, elem.id)}
                  style={{ width: '50px', marginRight: '10px' }}
                  value={elem.value}
                  min={0}
                  max={100}
                />
              ) : (
                <Text>{elem.value}</Text>
              )}

              <Text icon="percentage" iconProps={{ color: Color.GREY_300 }} />
            </Layout.Horizontal>
          ))}
        {percentageError && <Text intent="danger">Cannot set above 100%</Text>}
      </Container>
    </Container>
  )
}

export default PercentageRollout
