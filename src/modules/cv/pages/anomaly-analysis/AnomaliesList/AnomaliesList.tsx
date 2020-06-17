import React, { FunctionComponent } from 'react'
import { Card, Text } from '@wings-software/uikit'

interface AnomaliesListProps {
  anomaliesList: any
  onAnomalyClick: (val: any) => void
}

const AnomaliesList: FunctionComponent<any> = (props: AnomaliesListProps) => {
  function renderList(list: any) {
    return list.map((each: any, index: number) => {
      return (
        <div key={index}>
          <Card
            onClick={() => {
              props.onAnomalyClick(props.anomaliesList[index])
            }}
          >
            <Text> {each.status} </Text>
          </Card>
        </div>
      )
    })
  }

  return (
    <div>
      <h3> Anomalies </h3>
      {renderList(props.anomaliesList)}
    </div>
  )
}

export default AnomaliesList
