import React, { FunctionComponent } from 'react'
import css from './DataSources.module.scss'
import { Text, Container } from '@wings-software/uikit'
import CvCard from '../../components/CvCard/CvCard'

const DataSources: FunctionComponent<any> = _props => {
  const sources = [
    {
      item: {
        title: 'App Dynamics',
        icon: 'service-appdynamics'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'New Relic',
        icon: 'service-newrelic'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Dynatrace',
        icon: 'service-dynatrace'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Instana',
        icon: 'service-instana'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Splunk',
        icon: 'service-splunk'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Elastic',
        icon: 'service-elk'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Stack Driver',
        icon: 'service-stackdriver'
      },
      // onClick: () => {}
    },
    {
      item: {
        title: 'Cloud Watch',
        icon: 'service-cloudwatch'
      },
      // onClick: () => {}
    }
  ]

  const renderSources = () => {
    return sources.map((source: any, index: number) => {
      return <CvCard item={source.item} onClick={source.onClick} key={index} />
    })
  }

  return (
    <Container className={css.main}>
      <Text margin="small" padding="medium" font={{ weight: 'bold', size: 'medium' }}>
        Select Data Source
      </Text>
      <div className={css.sourcesGrid}> {renderSources()} </div>
    </Container>
  )
}

export default DataSources
