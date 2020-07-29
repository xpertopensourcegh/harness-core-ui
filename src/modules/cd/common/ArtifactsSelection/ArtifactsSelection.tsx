import React from 'react'
import { Layout, Text, Container, Icon, Color } from '@wings-software/uikit'
import css from './ArtifactsSelection.module.scss'
import i18n from './ArtifactsSelection.i18n'
import cx from 'classnames'

import { PipelineContext } from 'modules/cd/pages/pipelines/PipelineContext/PipelineContext'
import { get } from 'lodash'

import { getStageFromPipeline } from 'modules/cd/pages/pipelines/StageBuilder/StageBuilderModel'

interface ArtifactTable {
  [key: string]: string
}

const artifactListHeaders: ArtifactTable = {
  type: i18n.artifactTable.type,
  server: i18n.artifactTable.server,
  source: i18n.artifactTable.artifactSource,
  id: i18n.artifactTable.id
}

export default function ArtifactsSelection({ isForOverrideSets }: { isForOverrideSets: boolean }): JSX.Element {
  const {
    state: {
      pipeline,
      pipelineView: { selectedStageId }
    },
    updatePipeline
  } = React.useContext(PipelineContext)

  const { stage } = getStageFromPipeline(pipeline, selectedStageId || '')

  const serviceSpec = get(stage, 'deployment.deployment.service.serviceSpec.artifacts', null)

  const primaryArtifact = get(stage, 'deployment.deployment.service.serviceSpec.artifacts.primary', null)

  const primaryArtifactType = 'dockerhub'

  const sideCarArtifact: [] = get(stage, 'deployment.deployment.service.serviceSpec.artifacts.sidecars', null)

  const addPrimaryArtifact = (): void => {
    return
    // const primaryArtifactStruct = {
    //   dockerhub: {
    //     dockerhubConnector: 'https://registry.hub.docker.com/',
    //     imagePath: 'library/ubuntu',
    //     tag: null,
    //     tagRegex: 'groo*',
    //     identifier: 'primary',
    //     artifactType: 'primary',
    //     sourceAttributes: {
    //       dockerhubConnector: 'https://registry.hub.docker.com/',
    //       imagePath: 'library/ubuntu',
    //       tag: null,
    //       tagRegex: 'groo*',
    //       delegateArtifactServiceClass: 'io.harness.cdng.artifact.delegate.DockerArtifactServiceImpl'
    //     },
    //     uniqueHash: 'da524bfa3ddd46f7fada043505c9d836b79b79051f4e814a70435e4ef49ff522',
    //     sourceType: 'dockerhub'
    //   }
    // }
    // if (serviceSpec && stage) {
    //   // stage['deployment']['deployment']['service']['serviceSpec']['artifacts']['primary'] = primaryArtifactStruct

    //   updatePipeline(pipeline)
    // }
  }

  const addSideCarArtifact = (): void => {
    return
    // const sidecarArtifactOne = {
    //   sidecar: {
    //     identifier: 'sidecar1',
    //     artifact: {
    //       dockerhubConnector: 'https://registry.hub.docker.com/',
    //       imagePath: 'library/redis',
    //       tag: 'latest',
    //       tagRegex: null,
    //       identifier: 'sidecar1',
    //       artifactType: 'sidecar',
    //       sourceAttributes: {
    //         dockerhubConnector: 'https://registry.hub.docker.com/',
    //         imagePath: 'library/redis',
    //         tag: 'latest',
    //         tagRegex: null,
    //         delegateArtifactServiceClass: 'io.harness.cdng.artifact.delegate.DockerArtifactServiceImpl'
    //       },
    //       uniqueHash: '806070eb81fd998c8b449afccc7c48b8626bedbd02aee33ed5e8159a87a94170',
    //       sourceType: 'dockerhub'
    //     }
    //   }
    // }

    // const sidecarArtifacTwo = {
    //   sidecar: {
    //     identifier: 'sidecar2',
    //     artifact: {
    //       dockerhubConnector: 'https://registry.hub.docker.com/',
    //       imagePath: 'library/mongo',
    //       tag: 'latest',
    //       tagRegex: null,
    //       identifier: 'sidecar2',
    //       artifactType: 'sidecar',
    //       sourceAttributes: {
    //         dockerhubConnector: 'https://registry.hub.docker.com/',
    //         imagePath: 'library/mongo',
    //         tag: 'latest',
    //         tagRegex: null,
    //         delegateArtifactServiceClass: 'io.harness.cdng.artifact.delegate.DockerArtifactServiceImpl'
    //       },
    //       uniqueHash: '3ca3a056566baafd358db499fd7385584bd3563761d0824d038b7c711def81c7',
    //       sourceType: 'dockerhub'
    //     }
    //   }
    // }
    // if (serviceSpec) {
    //   if (serviceSpec['sidecars']?.length > 0) {
    //     serviceSpec['sidecars'].push(sidecarArtifacTwo)
    //   } else {
    //     serviceSpec['sidecars'] = []
    //     serviceSpec['sidecars'].push(sidecarArtifactOne)
    //   }
    //   updatePipeline(pipeline)
    // }
  }

  const removePrimary = (): void => {
    serviceSpec['primary'] = null
    updatePipeline(pipeline)
  }

  const removeSidecar = (index: number): void => {
    sideCarArtifact.splice(index, 1)
    updatePipeline(pipeline)
  }
  return (
    <Layout.Vertical
      padding={!isForOverrideSets ? 'large' : 'none'}
      style={{ background: !isForOverrideSets ? 'var(--grey-100)' : '' }}
    >
      {!isForOverrideSets && <Text style={{ color: 'var(--grey-500)', lineHeight: '24px' }}>{i18n.info}</Text>}
      <Layout.Vertical spacing="medium">
        {!primaryArtifact && (
          <Container className={css.rowItem}>
            <Text onClick={addPrimaryArtifact}>{i18n.addPrimarySourceLable}</Text>
          </Container>
        )}
        {(!sideCarArtifact || sideCarArtifact?.length === 0) && (
          <Container className={css.rowItem}>
            <Text onClick={addSideCarArtifact}>{i18n.addSideCarLable}</Text>
          </Container>
        )}
      </Layout.Vertical>
      <Layout.Vertical spacing="small">
        {(primaryArtifact || (sideCarArtifact && sideCarArtifact.length > 0)) && (
          <Container>
            <section className={css.thead}>
              <span>{artifactListHeaders.type}</span>
              <span>{artifactListHeaders.server}</span>
              <span></span>
              <span>{artifactListHeaders.source}</span>
              <span>{artifactListHeaders.id}</span>
              <span></span>
            </section>
          </Container>
        )}
        <Layout.Vertical spacing="medium">
          <section>
            {primaryArtifact && (
              <section className={cx(css.thead, css.rowItem)} key={primaryArtifactType}>
                <span className={css.type}>{i18n.primaryLabel}</span>
                <span className={css.server}>
                  <Text
                    inline
                    icon={'service-dockerhub'}
                    iconProps={{ size: 18 }}
                    width={200}
                    style={{ color: Color.BLACK, fontWeight: 900 }}
                  >
                    {primaryArtifact[primaryArtifactType].sourceType}
                  </Text>
                </span>
                <span>
                  <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                </span>
                <span>
                  <Text width={470} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {primaryArtifact[primaryArtifactType]?.sourceAttributes?.dockerhubConnector +
                      '' +
                      primaryArtifact[primaryArtifactType]?.sourceAttributes?.imagePath}
                  </Text>
                </span>
                <span>
                  <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                    {primaryArtifact[primaryArtifactType]?.identifier}
                  </Text>
                </span>
                <span>
                  <Layout.Horizontal spacing="medium">
                    <Icon name="delete" size={14} style={{ cursor: 'pointer' }} onClick={removePrimary} />
                  </Layout.Horizontal>
                </span>
              </section>
            )}
          </section>
          <section>
            {sideCarArtifact &&
              sideCarArtifact.length > 0 &&
              sideCarArtifact.map(
                (
                  data: {
                    sidecar: {
                      identifier: string
                      artifact: {
                        sourceType: string
                        identifier: string
                        sourceAttributes: {
                          dockerhubConnector: string
                          imagePath: string
                        }
                      }
                    }
                  },
                  index: number
                ) => {
                  const { sidecar } = data
                  return (
                    <section className={cx(css.thead, css.rowItem)} key={sidecar?.identifier + index}>
                      <span className={css.type}>{i18n.sidecarLabel}</span>
                      <span className={css.server}>
                        <Text
                          inline
                          icon={'service-dockerhub'}
                          iconProps={{ size: 18 }}
                          width={470}
                          style={{ color: Color.BLACK, fontWeight: 900 }}
                        >
                          {sidecar.artifact.sourceType}
                        </Text>
                      </span>
                      <span>
                        <Text inline icon="full-circle" iconProps={{ size: 10, color: Color.GREEN_500 }} />
                      </span>
                      <span>
                        <Text width={480} lineClamp={1} style={{ color: Color.GREY_500 }}>
                          {sidecar.artifact.sourceAttributes.dockerhubConnector +
                            '' +
                            sidecar.artifact.sourceAttributes.imagePath}
                        </Text>
                      </span>
                      <span>
                        <Text width={110} lineClamp={1} style={{ color: Color.GREY_500 }}>
                          {sidecar.artifact.identifier}
                        </Text>
                      </span>
                      <span>
                        <Layout.Horizontal spacing="medium">
                          <Icon
                            name="delete"
                            size={14}
                            style={{ cursor: 'pointer' }}
                            onClick={() => removeSidecar(index)}
                          />
                        </Layout.Horizontal>
                      </span>
                    </section>
                  )
                }
              )}
          </section>
          {sideCarArtifact && sideCarArtifact.length > 0 && (
            <Text intent="primary" style={{ cursor: 'pointer' }} onClick={addSideCarArtifact}>
              {i18n.addSideCarLable}
            </Text>
          )}
        </Layout.Vertical>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
