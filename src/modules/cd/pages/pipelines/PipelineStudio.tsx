import React from 'react'
import { useParams, useHistory, generatePath, Switch, Route, useRouteMatch, Link as RrLink } from 'react-router-dom'
import { useModalHook, Link, Icon, Text, Layout, Button, Tag } from '@wings-software/uikit'
import { Dialog, Classes } from '@blueprintjs/core'
import css from './PipelineStudio.module.scss'
import cx from 'classnames'
import { StageBuilder } from './StageBuilder/StageBuilder'
import CreatePipelines from './CreateModal/PipelineCreate'
import i18n from './PipelineStudio.i18n'

const PipelineStudio = (): JSX.Element => {
  const { pipelineId } = useParams()
  const params = useParams()
  const history = useHistory()
  const { path, url } = useRouteMatch()
  const isYaml = history.location.pathname.endsWith('/yaml/')
  const [pipeline, setPipeline] = React.useState({ name: 'Untitled' })

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog isOpen={true} className={cx(css.dialog, Classes.DIALOG)}>
        <CreatePipelines afterSave={onSubmit} />
      </Dialog>
    ),
    [pipelineId]
  )

  const onSubmit = React.useCallback(
    (data: { identifier: string; name: string }) => {
      const newPath = generatePath('/account/:accountId/projects/:projectId/pipelines/:pipelineId/', {
        ...params,
        pipelineId: data.identifier
      })
      history.replace(newPath)
      setPipeline({ name: data.name })
      hideModal()
    },
    [hideModal, history, setPipeline, params]
  )

  React.useEffect(() => {
    if (pipelineId === '-1') {
      showModal()
    }
  }, [pipelineId, showModal])
  return (
    <div className={css.container}>
      <div className={css.leftBar}>
        <div>
          <Link noStyling title="Dashboard" href="/">
            <Icon name="harness" size={29} className={css.logoImage} />
          </Link>
          <Text className={css.title}>{i18n.pipelineStudio}</Text>
        </div>
        <div>
          <div style={{ cursor: 'pointer' }} title="Dashboard" onClick={() => history.goBack()}>
            <Icon name="cross" margin="xsmall" padding="xsmall" size={21} className={css.logoImage} />
          </div>
        </div>
      </div>
      <div
        className={cx(Classes.POPOVER_DISMISS, css.content)}
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
        }}
      >
        <div className={css.topBar}>
          <div>
            {isYaml ? (
              <RrLink to={`${url}/`}>
                <div className={cx(css.topButtons)}>{i18n.visual}</div>
              </RrLink>
            ) : (
              <div className={cx(css.topButtons, css.selected)}>{i18n.visual}</div>
            )}
            {isYaml ? (
              <div className={cx(css.topButtons, css.selected)}>{i18n.yaml}</div>
            ) : (
              <RrLink to={`${url}yaml/`}>
                <div className={css.topButtons}>{i18n.yaml}</div>
              </RrLink>
            )}
            {/* <div className={css.topButtons}>SPLIT</div> */}
          </div>
          <div>
            <Tag intent="primary" className={css.tagRender} minimal>
              {i18n.unsavedChanges}
            </Tag>
          </div>
          <div>
            <Button
              minimal
              intent="primary"
              text={i18n.saveAndPublish}
              icon="arrow-up"
              className={css.savePublishBtn}
            />
          </div>
        </div>
        <div className={css.secondaryBar}>
          <Icon style={{ paddingLeft: 20 }} size={32} name="search-pipelines" />
          <div>
            <Text className={css.pipelineName}>{pipeline.name}</Text>
            <Button minimal icon="edit" iconProps={{ size: 12 }} onClick={showModal} />
            <Tag intent="primary" minimal className={css.tagRender}>
              {i18n.draft}
            </Tag>
          </div>
          {!isYaml && (
            <div>
              <Button minimal text={i18n.triggers} icon="play" />
              <Button minimal text={i18n.inputSets} icon="panel-table" />
              <Button minimal text={i18n.notifications} icon="main-notifications" />
            </div>
          )}
        </div>
        <Switch>
          <Route exact path={`${path}`}>
            <Layout.Horizontal className={css.canvas} padding="medium">
              <StageBuilder />
            </Layout.Horizontal>
          </Route>
          <Route exact path={`${path}yaml/`}>
            Yaml Editor
          </Route>
        </Switch>
      </div>
      <div className={css.rightBar}></div>
    </div>
  )
}

export default PipelineStudio
