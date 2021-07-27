import React from 'react'
import { Button, Container, Text } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import AddClusterImage from './images/AddCluster.svg'
import css from './OverviewPage.module.scss'

const OverviewAddCluster = () => {
  const { getString } = useStrings()
  return (
    <div className={css.addCluster}>
      <img src={AddClusterImage} height={150} />
      <Container width={650}>
        <Text>{getString('ce.overview.addClusterDesc')}</Text>
      </Container>
      <Button
        withoutBoxShadow={true}
        className={css.addClusterBtn}
        text={getString('ce.overview.addClusterBtn')}
        // onClick={() => 'TEST'} // TODO: fix it!
      />
    </div>
  )
}

export default OverviewAddCluster
