import React, { useState } from 'react'
import { Layout, Container } from '@wings-software/uikit'
import cx from 'classnames'
import { supportedProducts } from './EntityHelper'
import EntitiesPreview from './EntitiesPreview'
import css from './GitSyncEntity.module.scss'

const GitSyncEntityTab: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState(supportedProducts[0].id)
  const [showingSummary, setShowingSummary] = useState(true)

  return (
    <Container className={css.bodyContainer}>
      {showingSummary ? (
        <Container
          className={css.headerSection}
          padding={{ top: 'small', right: 'xlarge', bottom: 'xsmall', left: 'xlarge' }}
        >
          <Layout.Horizontal spacing="small">
            {supportedProducts.map(data => {
              return (
                <Container
                  margin="medium"
                  className={cx({ [css.activeTag]: selectedProduct === data.id }, css.tags)}
                  key={data.id}
                  onClick={() => {
                    setSelectedProduct(data.id)
                  }}
                >
                  {data.title}
                </Container>
              )
            })}
          </Layout.Horizontal>
        </Container>
      ) : null}
      <EntitiesPreview selectedProduct={selectedProduct} setShowingSummary={setShowingSummary} />
    </Container>
  )
}

export default GitSyncEntityTab
