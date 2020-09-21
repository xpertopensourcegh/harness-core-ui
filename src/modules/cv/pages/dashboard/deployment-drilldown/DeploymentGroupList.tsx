import React, { useState } from 'react'
import { Container, Color, Icon, Text, Collapse } from '@wings-software/uikit'
import moment from 'moment'
import styles from './DeploymentGroupList.module.scss'

export interface DeploymentItemProps {
  name: string
  environment: string
  startedOn: number
  status: 'warn' | 'success'
}

export interface DeploymentGroupListProps {
  name: string
  defaultOpen?: boolean
  items: Array<DeploymentItemProps>
}

export default function DeploymentGroupList({ name, defaultOpen, items }: DeploymentGroupListProps) {
  const [open, setOpen] = useState(!!defaultOpen)

  return (
    <Collapse
      collapseClassName={styles.main}
      heading={
        <Text
          margin={{ left: 'small' }}
          font={{ weight: open ? 'bold' : 'light' }}
          style={{ textTransform: 'uppercase' }}
        >
          {name}
        </Text>
      }
      isOpen={open}
      onToggleOpen={setOpen}
    >
      {items.map(item => (
        <Container key={item.name} className={styles.item} padding="small">
          <Container className={styles.itemHeader}>
            <Text width={130}>{item.name}</Text>
            <Icon
              margin={{ left: 'medium' }}
              size={12}
              background={item.status === 'warn' ? Color.RED_500 : Color.GREEN_500}
              color={Color.WHITE}
              name={item.status === 'warn' ? 'issue' : 'small-tick'}
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
