import React, { FunctionComponent, useState, useEffect } from 'react'
import css from './AnomalyAnalysis.module.scss'
import { OverlaySpinner } from '@wings-software/uikit'
import AnomaliesDetails from './AnomalyDetailsView/AnomalyDetailsView'
import AnomaliesList from './AnomaliesList/AnomaliesList'
import AnomaliesHeader from './AnomaliesHeader/AnomaliesHeader'
import { anomaliesConfig } from './AnomalyAnalysisUtils'

interface AnomalyAnalysisProps {
  anomaliesList: any
}

const AnomalyAnalysis: FunctionComponent<any> = (props: AnomalyAnalysisProps) => {
  const [inProgress, setInProgress] = useState(false)
  const anomaliesList = props.anomaliesList || anomaliesConfig.anomalies
  const [currentAnomaly, setCurrentAnomaly] = useState(anomaliesList[0])

  useEffect(() => {
    setInProgress(false)
  }, [])

  return (
    <OverlaySpinner show={inProgress}>
      <div className={css.main}>
        <div className={css.container}>
          <header className={css.header}>
            <AnomaliesHeader details={anomaliesConfig}> </AnomaliesHeader>
          </header>

          <nav className={css.nav}>
            <AnomaliesList
              anomaliesList={anomaliesList}
              onAnomalyClick={(val: any) => {
                setCurrentAnomaly(val)
              }}
            />
          </nav>

          <main className={css.main}>
            <AnomaliesDetails currentAnomaly={currentAnomaly} />
          </main>
        </div>
      </div>
    </OverlaySpinner>
  )
}

export default AnomalyAnalysis
