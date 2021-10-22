import React, { useState } from 'react'
import * as Yup from 'yup'
import { useParams } from 'react-router-dom'
import { ButtonVariation, Container, Formik, Layout, Tab, Tabs, Button } from '@wings-software/uicore'
import { BGColorWrapper } from '@cv/pages/health-source/common/StyledComponents'
import { NGBreadcrumbs } from '@common/components/NGBreadcrumbs/NGBreadcrumbs'
import routes from '@common/RouteDefinitions'
import type { ProjectPathProps } from '@common/interfaces/RouteInterfaces'
import { useStrings } from 'framework/strings'
import type { SLOForm } from './CreateSLO.types'
import { CreateSLOEnum, initialValuesSLO, TabsOrder } from './CreateSLO.constants'
import SLOName from './components/SLOName/SLOName'
import SLOTargetAndBudgetPolicy from './components/SLOTargetAndBudgetPolicy/SLOTargetAndBudgetPolicy'
import SLI from './components/SLI/SLI'
import css from './CreateSLO.module.scss'

export default function CreateSLO(): JSX.Element {
  const { getString } = useStrings()
  const [selectedTabId, setSelectedTabId] = useState<CreateSLOEnum>(CreateSLOEnum.NAME)
  const { orgIdentifier, projectIdentifier, accountId } = useParams<ProjectPathProps & { identifier: string }>()

  const navBtns = (
    <Layout.Horizontal className={css.navigationBtns}>
      <Button
        text={getString('back')}
        variation={ButtonVariation.SECONDARY}
        icon="chevron-left"
        onClick={() => {
          setSelectedTabId(TabsOrder[Math.max(0, TabsOrder.indexOf(selectedTabId) - 1)])
        }}
      />
      <Button
        text={selectedTabId === CreateSLOEnum.SLO_TARGET_BUDGET_POLICY ? getString('save') : getString('continue')}
        variation={ButtonVariation.PRIMARY}
        rightIcon="chevron-right"
        onClick={() => {
          if (selectedTabId === CreateSLOEnum.SLO_TARGET_BUDGET_POLICY) {
            // do the save call
          } else {
            setSelectedTabId(TabsOrder[Math.min(TabsOrder.length, TabsOrder.indexOf(selectedTabId) + 1)])
          }
        }}
      />
    </Layout.Horizontal>
  )

  return (
    <>
      <BGColorWrapper>
        <Container className={css.header}>
          <Container className={css.title}>
            <NGBreadcrumbs
              links={[
                {
                  url: routes.toCVSLOs({
                    orgIdentifier: orgIdentifier,
                    projectIdentifier: projectIdentifier,
                    accountId: accountId
                  }),
                  label: getString('cv.slos.title')
                }
              ]}
            />
            <p>{getString('cv.slos.createSLO')}</p>
          </Container>
        </Container>
      </BGColorWrapper>

      <Formik<SLOForm>
        initialValues={initialValuesSLO}
        formName="sloForm"
        onSubmit={() => {
          // to be added
        }}
        validationSchema={Yup.object().shape({
          name: Yup.string().required(getString('cv.monitoredServices.nameValidation'))
          // to be extended for other fields
        })}
        enableReinitialize
      >
        {formik => {
          return (
            <Container className={css.sloTabs}>
              <Tabs
                id="createSLOTabs"
                selectedTabId={selectedTabId}
                onChange={nextTab => setSelectedTabId(nextTab as CreateSLOEnum)}
              >
                <Tab
                  id={CreateSLOEnum.NAME}
                  title={getString('name')}
                  panel={<SLOName formikProps={formik}>{navBtns}</SLOName>}
                />
                <Tab
                  id={CreateSLOEnum.SLI}
                  title={getString('cv.slos.sli')}
                  panel={<SLI formikProps={formik}>{navBtns}</SLI>}
                />
                <Tab
                  id={CreateSLOEnum.SLO_TARGET_BUDGET_POLICY}
                  title={getString('cv.slos.sloTargetAndBudgetPolicy')}
                  panel={<SLOTargetAndBudgetPolicy formikProps={formik}>{navBtns}</SLOTargetAndBudgetPolicy>}
                />
              </Tabs>
            </Container>
          )
        }}
      </Formik>
    </>
  )
}
