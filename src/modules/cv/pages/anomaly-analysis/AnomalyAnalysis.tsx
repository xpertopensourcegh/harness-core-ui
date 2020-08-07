import React, { FunctionComponent, useState, useEffect } from 'react'
import { OverlaySpinner } from '@wings-software/uikit'
import { Toaster, Intent } from '@blueprintjs/core'
import xhr from '@wings-software/xhr-async'
import { routeParams } from 'framework/route/RouteMounter'
import AnomaliesDetails from './AnomalyDetailsView/AnomalyDetailsView'
import AnomaliesList from './AnomaliesList/AnomaliesList'
import AnomaliesHeader from './AnomaliesHeader/AnomaliesHeader'
import { anomaliesConfig } from './AnomalyAnalysisUtils'
import { fetchAnomalies } from '../../services/AnomaliesService'
import css from './AnomalyAnalysis.module.scss'

const toaster = Toaster.create()

const fetchAnomaliesData = async (state: any, params: any) => {
  state.setInProgress(true)
  const { response, status, error } = await fetchAnomalies(params)
  state.setInProgress(false)
  if (status === xhr.ABORTED) {
    return
  }

  if (status !== 200) {
    toaster.show({ intent: Intent.DANGER, timeout: 5000, message: error + '' })
    return
  }

  if (response?.resource) {
    state.setAnomalies(response.resource)
    state.setCurrentAnomaly(response.resource[0])
  }
}

const AnomalyAnalysis: FunctionComponent<any> = () => {
  const [inProgress, setInProgress] = useState(false)
  const [anomalies, setAnomalies] = useState([])
  const [currentAnomaly, setCurrentAnomaly] = useState(null)
  const {
    params: { accountId },
    query: {
      from,
      to,
      // service,
      category
    }
  } = routeParams()

  const state = {
    inProgress,
    setInProgress,
    anomalies,
    setAnomalies,
    currentAnomaly,
    setCurrentAnomaly
  }

  useEffect(() => {
    fetchAnomaliesData(state, {
      accountId: accountId,
      env: 'env',
      service: 'service', // service,
      category: category && (category as string).toUpperCase(),
      startTime: from,
      endTime: to
    })
  }, [])

  return (
    <OverlaySpinner show={inProgress}>
      <div className={css.main}>
        <div className={css.container}>
          <header className={css.header}>
            <AnomaliesHeader
              details={{
                ...anomaliesConfig,
                from: Number.parseInt(from as string),
                to: Number.parseInt(to as string)
              }}
            >
              {' '}
            </AnomaliesHeader>
          </header>

          <nav className={css.nav}>
            <AnomaliesList
              anomaliesList={anomalies}
              currentAnomaly={currentAnomaly}
              onAnomalyClick={(val: any) => {
                setCurrentAnomaly(val)
              }}
              isLoading={inProgress}
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
