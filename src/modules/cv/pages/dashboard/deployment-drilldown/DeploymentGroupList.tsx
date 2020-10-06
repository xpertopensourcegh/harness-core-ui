import React, { useState } from 'react'
import { Container, Color, Icon, Text, Collapse, IconName } from '@wings-software/uikit'
import moment from 'moment'
import styles from './DeploymentGroupList.module.scss'

export interface DeploymentItemProps {
  name: string
  environment: string
  startedOn: number
  status: 'NOT_STARTED' | 'PASSED' | 'ERROR' | 'SUCCESS' | 'IN_PROGRESS'
  onClick(): void
  selected: boolean
}

const mapItemColor = (status: DeploymentItemProps['status']): Color => {
  switch (status) {
    case 'NOT_STARTED':
      return Color.GREY_300
    case 'IN_PROGRESS':
      return Color.BLUE_400
    case 'SUCCESS':
    case 'PASSED':
      return Color.GREEN_500
    default:
      return Color.RED_500
  }
}

const mapItemIcon = (status: DeploymentItemProps['status']): IconName => {
  switch (status) {
    case 'SUCCESS':
    case 'PASSED':
      return 'small-tick'
    case 'ERROR':
      return 'issue'
    default:
      return 'pie-chart'
  }
}

export interface DeploymentGroupListProps {
  name: string
  defaultOpen?: boolean
  items?: Array<DeploymentItemProps>
}

export default function DeploymentGroupList({ name, defaultOpen, items }: DeploymentGroupListProps) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <Collapse
      collapseClassName={styles.main}
      heading={
        <Text margin={{ left: 'small' }} font={{ weight: open ? 'bold' : 'light' }}>
          {name}
        </Text>
      }
      isOpen={open}
      onToggleOpen={setOpen}
    >
      {items?.map((item, i) => (
        <Container
          key={item.name + i}
          onClick={item.onClick}
          className={styles.item}
          background={item.selected ? Color.BLUE_200 : undefined}
          padding="small"
        >
          <Container className={styles.itemHeader}>
            <Text width={130}>{item.name}</Text>
            <Icon
              margin={{ left: 'medium' }}
              size={12}
              background={mapItemColor(item.status)}
              color={Color.WHITE}
              name={mapItemIcon(item.status)}
            />
          </Container>
          <Text color={Color.GREY_300} font={{ size: 'xsmall' }}>{`Environment: ${item.environment}`}</Text>
          <Text color={Color.GREY_300} font={{ size: 'xsmall' }}>
            {`Started on: ${moment(item.startedOn).format('MMM D, YYYY h:mm A')}`}
          </Text>
        </Container>
      ))}
    </Collapse>
  )
}
