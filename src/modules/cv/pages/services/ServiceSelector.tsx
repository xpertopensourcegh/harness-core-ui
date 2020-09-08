import React, { useState, useMemo } from 'react'
import { Container, Text, Icon, Color } from '@wings-software/uikit'
import { Collapse } from '@blueprintjs/core'
import classnames from 'classnames'
import groupBy from 'lodash/groupBy'
import { isEmpty } from 'lodash-es'
import i18n from './CVServicesPage.i18n'
import styles from './ServiceSelector.module.scss'

export interface ServiceSelectorProps {
  services: Array<{
    identifier: string
    name: string
    environment: string
  }>
  selectedServiceId?: string | undefined
  onSelect?(id: string): void
}

export interface ServiceSelectorGroupProps extends ServiceSelectorProps {
  name: string
  defaultExpanded?: boolean
}

export default function ServiceSelector({ services, selectedServiceId, onSelect }: ServiceSelectorProps) {
  const servicesByEnv = useMemo(() => {
    return groupBy(services, 'environment')
  }, [services])
  return (
    <>
      {!isEmpty(servicesByEnv) &&
        Object.keys(servicesByEnv).map(key => (
          <ServiceSelectorGroup
            key={key}
            name={key}
            defaultExpanded={true}
            services={servicesByEnv[key]}
            selectedServiceId={selectedServiceId}
            onSelect={onSelect}
          />
        ))}
    </>
  )
}

function ServiceSelectorGroup({
  name,
  defaultExpanded,
  services,
  selectedServiceId,
  onSelect
}: ServiceSelectorGroupProps) {
  const [expanded, setExpanded] = useState(!!defaultExpanded)
  return (
    <Container className={styles.serviceSelectorGroup}>
      <Container className={styles.groupName} onClick={() => setExpanded(!expanded)}>
        <Text>{name}</Text>
        <Icon name={expanded ? 'caret-down' : 'caret-right'} size={15} />
      </Container>
      <Collapse isOpen={expanded} className={styles.groupBody}>
        {services.map(service => (
          <Container
            key={service.identifier}
            className={classnames(styles.serviceItem, {
              [styles.selected]: service.identifier === selectedServiceId
            })}
            onClick={() => {
              onSelect && onSelect(service.identifier)
            }}
          >
            <Container className={styles.serviceItemHeader}>
              <Text font={{ weight: 'bold' }}>{service.name}</Text>
              <Text font={{ weight: 'bold' }} color={Color.RED_450}>
                70
              </Text>
            </Container>
            <Text font={{ size: 'xsmall' }} color={Color.GREY_400}>
              {i18n.affectedMetrics}
            </Text>
            <Text font={{ size: 'small' }}>Throughput, Response time</Text>
          </Container>
        ))}
      </Collapse>
    </Container>
  )
}
