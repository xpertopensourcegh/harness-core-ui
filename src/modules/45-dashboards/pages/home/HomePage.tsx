import React, { useState } from 'react'
import cx from 'classnames'
import {
  Color,
  Layout,
  Text,
  Container,
  Card,
  Button,
  CardBody,
  Icon,
  useModalHook,
  StepWizard,
  FormInput,
  Formik
} from '@wings-software/uicore'
import { Classes, Menu, MenuItem, Dialog } from '@blueprintjs/core'
import { Form } from 'formik'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { useGet, useMutate } from 'restful-react'
import { useHistory } from 'react-router-dom'
import { Page } from '@common/exports'

import routes from '@common/RouteDefinitions'
import { useStrings } from 'framework/exports'
import css from './HomePage.module.scss'

enum Views {
  CREATE,
  EDIT
}

const i18n: { [key: string]: string } = {
  AWS:
    'A dashboard that visually tracks and analyzes the health of your AWS cloud spend. Widgets include: Total cost spend, project cost spend, historical and forecasted cost, trending services, most expensive resources and current vs previous month spend',
  GCP:
    'A dashboard that visually tracks and analyzes the health of your GCP cloud spend. Widgets include: Total cost spend, project cost spend, historical and forecasted cost, trending services, most expensive resources and current vs previous month spend',
  Cluster:
    'A dashboard that visually tracks and analyzes the health of your cluster spend. Widgets include: Total cost spend, project cost spend, historical and forecasted cost, trending services, most expensive resources and current vs previous month spend'
}

const FirstStep = (props: any): JSX.Element => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  const [errorMessage, setErrorMessage] = React.useState('')
  const history = useHistory()
  const { mutate: createDashboard, loading } = useMutate({
    verb: 'POST',
    path: 'insights/dashboards/create',
    queryParams: { accountId: accountId }
  })

  const submitForm = async (formData: { name: string; description: string }) => {
    const response = await createDashboard(formData)
    return response
  }

  return (
    <Layout.Vertical spacing="xxlarge" padding="medium" style={{ height: '100%' }}>
      <Text font="medium" color={Color.BLACK_100} style={{ marginTop: 'var(--spacing-large)' }}>
        {getString('dashboards.createModal.stepOne')}
      </Text>
      <Formik
        initialValues={{ name: '', description: '' }}
        validationSchema={Yup.object().shape({
          name: Yup.string().trim().required(getString('dashboards.createModal.nameValidation'))
        })}
        onSubmit={(formData: { name: string; description: string }) => {
          setErrorMessage('')
          const response = submitForm(formData)
          response
            .then(data => {
              if (data?.resource) {
                history.push({
                  pathname: routes.toViewCustomDashboard({
                    viewId: data?.resource,
                    accountId: accountId
                  })
                })
                props?.hideModal?.()
              }
            })
            .catch(() => {
              setErrorMessage(getString('dashboards.createModal.submitFail'))
            })
        }}
      >
        {formik => (
          <Form className={css.formContainer}>
            <Layout.Horizontal style={{ justifyContent: 'space-between' }}>
              <Layout.Vertical spacing="xsmall" style={{ width: '55%', paddingRight: 'var(--spacing-xxlarge)' }}>
                <FormInput.Text
                  name="name"
                  label={getString('name')}
                  placeholder={getString('dashboards.createModal.namePlaceholder')}
                />
                <FormInput.Text
                  name="description"
                  label={getString('description')}
                  placeholder={getString('dashboards.createModal.descriptionPlaceholder')}
                />
                <Layout.Vertical style={{ marginTop: '180px' }}>
                  <Button
                    type="submit"
                    intent="primary"
                    style={{ width: '150px', marginTop: '148px' }}
                    text={getString('continue')}
                    disabled={loading}
                    className={css.button}
                  />
                  {errorMessage && (
                    <section style={{ color: 'var(--red-700)', marginTop: 'var(--spacing-small)' }}>
                      {errorMessage}
                    </section>
                  )}
                </Layout.Vertical>
              </Layout.Vertical>

              <Card className={cx(css.dashboardCard)} style={{ width: '280px', height: '320px' }}>
                <Container padding="xlarge">
                  <Layout.Vertical spacing="large">
                    <Icon name={'dashboard'} size={25} color={Color.GREY_400} />
                    <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                      {formik?.values?.name || getString('dashboards.createModal.sampleTitle')}
                    </Text>
                    <Text color={Color.GREY_350}>
                      {formik?.values?.description || getString('dashboards.createModal.sampleDesc')}
                    </Text>
                    <Layout.Horizontal
                      spacing="medium"
                      style={{ borderTop: '1px solid var(--grey-200)', paddingTop: 'var(--spacing-large)' }}
                    >
                      <Container
                        style={{ width: '50%', borderRadius: '5px' }}
                        padding="small"
                        background={Color.GREY_100}
                      >
                        <Icon name="eye-open" size={16} style={{ marginBottom: '10px' }} />
                        <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                          <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                            {0}
                          </Text>
                          &nbsp;{getString('dashboards.createModal.view')}
                        </Layout.Horizontal>
                      </Container>
                      <Container
                        style={{ width: '50%', borderRadius: '5px' }}
                        padding="small"
                        background={Color.GREY_100}
                      >
                        <Icon name="star-empty" size={16} style={{ marginBottom: '10px' }} />
                        <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                          <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                            {0}
                          </Text>
                          &nbsp;{getString('dashboards.createModal.fav')}
                        </Layout.Horizontal>
                      </Container>
                    </Layout.Horizontal>
                    <Layout.Vertical spacing="medium">
                      <Text color={Color.GREY_400}>{getString('dashboards.createModal.dataSource')}</Text>
                      <Layout.Horizontal spacing="medium">
                        <Icon name="ce-main" size={22} />
                        <Icon name="cd-main" size={22} />
                        <Icon name="ci-main" size={22} />
                        <Icon name="cf-main" size={22} />
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  </Layout.Vertical>
                </Container>
              </Card>
            </Layout.Horizontal>
          </Form>
        )}
      </Formik>
    </Layout.Vertical>
  )
}

const HomePage: React.FC = () => {
  const { getString } = useStrings()
  const { accountId } = useParams()
  const history = useHistory()

  const [view, setView] = useState(Views.CREATE)

  const { data: dashboardList, loading, error } = useGet({
    // Inferred from RestfulProvider in index.js
    path: 'insights/dashboards',
    queryParams: { accountId: accountId }
  })

  const [showModal, hideModal] = useModalHook(
    () => (
      <Dialog
        isOpen={true}
        onClose={() => {
          setView(Views.CREATE)
          hideModal()
        }}
        className={cx(css.dialog, Classes.DIALOG, {
          [css.create]: view === Views.CREATE
        })}
      >
        {view === Views.CREATE ? (
          <StepWizard stepClassName={css.stepClass}>
            <FirstStep
              name={getString('dashboards.createModal.stepOne')}
              formData={{}}
              hideModal={hideModal}
              handleViewChange={{}}
            />
            {null}
          </StepWizard>
        ) : null}

        {view === Views.EDIT ? <section>se</section> : null}

        <Button
          minimal
          icon="cross"
          iconProps={{ size: 18 }}
          onClick={() => {
            setView(Views.CREATE)
            hideModal()
          }}
          className={css.crossIcon}
        />
      </Dialog>
    ),
    [view]
  )

  return (
    <Page.Body
      loading={loading}
      className={css.pageContainer}
      retryOnError={() => {
        return
      }}
      error={(error?.data as Error)?.message}
      noData={{
        when: () => dashboardList?.resource?.list?.length === 0,
        icon: 'dashboard',
        message: 'No dashboards available',
        buttonText: getString('dashboards.homePage.title'),
        onClick: () => {
          return
        }
      }}
    >
      <Layout.Vertical
        padding="large"
        background={Color.GREY_100}
        style={{ borderBottom: '1px solid var(--grey-200)' }}
      >
        <Text color={Color.BLACK} font={{ size: 'medium', weight: 'bold' }}>
          {getString('dashboards.homePage.title')}
        </Text>
      </Layout.Vertical>
      <Layout.Horizontal
        padding="medium"
        style={{ borderBottom: '1px solid var(--grey-200)', justifyContent: 'space-between' }}
        flex={true}
      >
        <Button
          intent="primary"
          text={getString('cv.navLinks.dashboard')}
          icon="plus"
          style={{ background: 'var(--blue-700)', borderColor: 'var(--blue-700)', width: '110px' }}
          onClick={() => showModal()}
        />
        <section></section>
      </Layout.Horizontal>
      <Layout.Vertical padding="large">
        <Container height="90%">
          <Layout.Masonry
            center
            gutter={25}
            items={dashboardList?.resource?.list}
            renderItem={(dashboard: {
              id: string
              type: string
              description: string
              title: string
              view_count?: number
              favorite_count?: number
            }) => (
              <Card className={cx(css.dashboardCard)}>
                <Container padding="xlarge">
                  {dashboard?.type !== 'SHARED' && (
                    <CardBody.Menu
                      menuContent={
                        <Menu>
                          <MenuItem text="edit" />
                        </Menu>
                      }
                      menuPopoverProps={{
                        className: Classes.DARK
                      }}
                    />
                  )}

                  <Layout.Vertical
                    spacing="large"
                    onClick={() => {
                      history.push({
                        pathname: routes.toViewCustomDashboard({
                          viewId: dashboard.id,
                          accountId: accountId
                        })
                      })
                    }}
                  >
                    <Icon
                      name={dashboard?.type === 'SHARED' ? 'harness' : 'dashboard'}
                      size={25}
                      color={dashboard?.type === 'ACCOUNT' ? Color.GREY_400 : Color.BLUE_500}
                    />
                    <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                      {dashboard?.title}
                    </Text>
                    {dashboard?.description && (
                      <Text color={Color.GREY_350} style={{ lineHeight: '20px' }}>
                        {dashboard?.description}
                      </Text>
                    )}
                    {!dashboard?.description && (
                      <Text color={Color.GREY_350} style={{ lineHeight: '20px' }}>
                        {i18n[dashboard?.title]}
                      </Text>
                    )}
                    <Layout.Horizontal
                      spacing="medium"
                      // height="160px"
                      // style={{
                      //   display: 'flow-root',
                      //   overflow: 'hidden'
                      // }}
                    >
                      <Container
                        style={{ width: '50%', borderRadius: '5px' }}
                        padding="small"
                        background={Color.GREY_100}
                      >
                        <Icon name="eye-open" size={16} style={{ marginBottom: '10px' }} />
                        <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                          <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                            {dashboard?.view_count}
                          </Text>
                          &nbsp;{getString('dashboards.createModal.view')}
                        </Layout.Horizontal>
                      </Container>
                      <Container
                        style={{ width: '50%', borderRadius: '5px' }}
                        padding="small"
                        background={Color.GREY_100}
                      >
                        <Icon name="star-empty" size={16} style={{ marginBottom: '10px' }} />
                        <Layout.Horizontal style={{ alignItems: 'baseline' }}>
                          <Text color={Color.BLACK_100} font={{ size: 'medium', weight: 'semi-bold' }}>
                            {dashboard?.favorite_count}
                          </Text>
                          &nbsp;{getString('dashboards.createModal.fav')}
                        </Layout.Horizontal>
                      </Container>
                    </Layout.Horizontal>
                    <Layout.Vertical spacing="medium">
                      <Text color={Color.GREY_400}>{getString('dashboards.createModal.dataSource')}</Text>
                      <Layout.Horizontal spacing="medium">
                        <Icon name="ce-main" size={22} />
                        {/* <Icon name="cd-main" size={22} />
                        <Icon name="ci-main" size={22} />
                        <Icon name="cf-main" size={22} /> */}
                      </Layout.Horizontal>
                    </Layout.Vertical>
                  </Layout.Vertical>
                </Container>
              </Card>
            )}
            keyOf={dashboard => dashboard?.id}
          />
        </Container>
      </Layout.Vertical>
    </Page.Body>
  )
}

export default HomePage
