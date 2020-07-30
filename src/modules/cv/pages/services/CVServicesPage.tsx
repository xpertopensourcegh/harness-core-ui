import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { Container, ExpandingSearchInput } from '@wings-software/uikit'
import isEmpty from 'lodash/isEmpty'
import { Page } from 'modules/common/exports'
import ServiceCard from '../../components/ServiceCard/ServiceCard'
import styles from './CVServicesPage.module.scss'

export default function CVServicesPage(): JSX.Element {
  const history = useHistory()
  const [services, setServices] = useState<Array<any>>([])
  const [visibleServices, setVisibleServices] = useState<Array<any>>([])
  const [searchValue, setSearchValue] = useState('')
  useEffect(() => {
    ;(async () => {
      const response = await fetchServicesMock()
      setServices(response)
      setVisibleServices(response)
    })()
  }, [])

  useEffect(() => {
    if (!searchValue) {
      setVisibleServices(services)
    } else {
      setVisibleServices(services.filter(({ label }) => label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0))
    }
  }, [searchValue])

  return (
    <>
      <Page.Header
        title="Services"
        toolbar={
          <Container>
            <div className={styles.searchContainer}>
              <ExpandingSearchInput defaultValue={searchValue} onChange={setSearchValue} />
            </div>
          </Container>
        }
      />
      <Page.Body loading={isEmpty(services)}>
        <div className={styles.body}>
          {!isEmpty(visibleServices) &&
            visibleServices.map(service => (
              <ServiceCard
                key={service.id}
                className={styles.cardItem}
                onClick={() => history.push(`cv-service/${service.label}`)}
                {...service}
              />
            ))}
        </div>
      </Page.Body>
    </>
  )
}

function fetchServicesMock(): Promise<Array<any>> {
  return new Promise(res => {
    setTimeout(
      () =>
        res([
          {
            id: 1,
            label: 'Learning Engine',
            impact: 1,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          },
          {
            id: 2,
            label: 'Delegate',
            impact: 0,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          },
          {
            id: 3,
            label: 'Search',
            impact: 0.2,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          },
          {
            id: 4,
            label: 'Manager',
            impact: 0.5,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          },
          {
            id: 5,
            label: 'Identity',
            impact: 0.1,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          },
          {
            id: 6,
            label: 'MongoDB',
            impact: 0.7,
            verificationPassed: 5,
            verificationFailed: 2,
            changeEventsPassed: 2,
            changeEventsFailed: 0,
            openAnomalies: 3
          }
        ]),
      10
    )
  })
}
