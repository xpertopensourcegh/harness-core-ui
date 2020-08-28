import React, { useState } from 'react'
import { Drawer as BPDrawer } from '@blueprintjs/core'
import { Container, Text, Tag, Intent } from '@wings-software/uikit'
import BlueGreenVerificationChart from '../BlueGreenVerificationChart'
import styles from './DeploymentVerificationDrawer.module.scss'

export function Drawer({
  children,
  onClose,
  ...rest
}: {
  children: React.ReactNode
  onClose: () => void
  [key: string]: any
}) {
  const [isOpen, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
    // HACK - git it a time to finish animation
    setTimeout(onClose, 200)
  }
  return (
    <BPDrawer {...rest} isOpen={isOpen} onClose={handleClose}>
      {children}
    </BPDrawer>
  )
}

export function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <Container className={styles.drawerHeader}>{children}</Container>
}

export function DrawerBody({ children }: { children: React.ReactNode }) {
  return <Container className={styles.drawerBody}>{children}</Container>
}

function DeploymentVerificationHeader({
  name = 'Blue green prod phase 1',
  tags = ['tag1', 'tag2'],
  serviceName = 'Delegate',
  activityIdentifier = 'Blue Green',
  activityType = 'Deployment Verification'
}: {
  name?: string
  tags?: Array<string>
  serviceName?: string
  activityIdentifier?: string
  activityType?: string
}) {
  return (
    <Container className={styles.verificationHeader}>
      <Text font={{ size: 'normal' }}>{name}</Text>
      <Text font={{ weight: 'bold', size: 'small' }}>Service</Text>
      <Text font={{ weight: 'bold', size: 'small' }}>Activity Identifier</Text>
      <Text font={{ weight: 'bold', size: 'small' }}>Activity Type</Text>
      <Container className={styles.verHeaderTags}>
        {tags.map(tag => (
          <Tag key={tag} intent={Intent.PRIMARY} minimal={true}>
            {tag}
          </Tag>
        ))}
      </Container>
      <Text font={{ size: 'xsmall' }}>{serviceName}</Text>
      <Text font={{ size: 'xsmall' }}>{activityIdentifier}</Text>
      <Text font={{ size: 'xsmall' }}>{activityType}</Text>
    </Container>
  )
}

export default function DeploymentVerificationDrawer({ onClose }: any) {
  return (
    <Drawer className={styles.drawer} onClose={onClose}>
      <DrawerHeader>
        <DeploymentVerificationHeader />
      </DrawerHeader>
      <DrawerBody>
        <BlueGreenVerificationChart />
      </DrawerBody>
    </Drawer>
  )
}
