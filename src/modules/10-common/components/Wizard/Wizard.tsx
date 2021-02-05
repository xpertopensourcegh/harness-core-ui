import React, { useEffect, useRef, createRef, RefObject } from 'react'
import { Layout, Tabs, Tab, Button, Formik, FormikForm, Heading, Text } from '@wings-software/uicore'
import type { IconName } from '@wings-software/uicore'
import { useHistory } from 'react-router-dom'
import cx from 'classnames'
import type { FormikErrors } from 'formik'
import { NavigationCheck } from '@common/components/NavigationCheck/NavigationCheck'
import { useStrings } from 'framework/exports'
import { useToaster } from '@common/exports'
// import VisualYamlToggle from '@common/components/VisualYamlToggle/VisualYamlToggle'
import { renderTitle, setNewTouchedPanel } from './WizardUtils'
import css from './Wizard.module.scss'

export interface PanelInterface {
  id: string
  tabTitle?: string
  tabTitleComponent?: JSX.Element
  iconName?: IconName
  requiredFields?: string[]
  checkValidPanel?: (formiKValues: any) => boolean
}
export interface WizardMapInterface {
  wizardLabel?: string
  panels: PanelInterface[]
}

interface FormikPropsInterface {
  initialValues: any
  validationSchema?: any
  validate?: (values: any) => FormikErrors<any>
  validateOnBlur?: boolean
  validateOnChange?: boolean
  enableReinitialize?: boolean
  onSubmit: (val: any) => void
}
interface WizardProps {
  wizardMap: WizardMapInterface
  formikInitialProps: FormikPropsInterface
  onHide: () => void
  defaultTabId?: string
  tabWidth?: string
  includeTabNumber?: boolean
  submitLabel?: string
  isEdit?: boolean
  children?: JSX.Element[]
  disableSubmit?: boolean
  errorToasterMessage?: string
  rightNav?: JSX.Element
  leftNav?: JSX.Element
  showVisualYaml?: boolean
  className?: string
}

// enum SelectedView {
//   VISUAL = 'VISUAL',
//   YAML = 'YAML'
// }

const Wizard: React.FC<WizardProps> = ({
  wizardMap,
  onHide,
  submitLabel,
  tabWidth,
  defaultTabId,
  includeTabNumber = true,
  formikInitialProps,
  children,
  isEdit = false,
  disableSubmit,
  errorToasterMessage,
  rightNav,
  leftNav,
  showVisualYaml = false,
  className = ''
}) => {
  const { wizardLabel } = wizardMap
  const defaultWizardTabId = wizardMap.panels[0].id
  const tabsMap = wizardMap?.panels?.map(panel => panel.id)
  const initialIndex = defaultTabId ? tabsMap.findIndex(tabsId => defaultTabId === tabsId) : 0
  const [selectedTabId, setSelectedTabId] = React.useState<string>(defaultTabId || defaultWizardTabId)
  const [touchedPanels, setTouchedPanels] = React.useState<number[]>([])
  const [validateOnChange, setValidateOnChange] = React.useState<boolean>(formikInitialProps.validateOnChange || false)
  const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(initialIndex)
  const layoutRef = useRef<HTMLDivElement>(null)
  const lastTab = selectedTabIndex === tabsMap.length - 1
  const { getString } = useStrings()
  const elementsRef: { current: RefObject<HTMLSpanElement>[] } = useRef(wizardMap.panels?.map(() => createRef()))
  // const [selectedView, setSelectedView] = React.useState<SelectedView>(SelectedView.VISUAL)

  const handleTabChange = (data: string): void => {
    const tabsIndex = tabsMap.findIndex(tab => tab === data)
    setSelectedTabId(data)
    setSelectedTabIndex(tabsIndex)
    setNewTouchedPanel({
      upcomingTabIndex: tabsIndex,
      selectedTabIndex,
      touchedPanels,
      setTouchedPanels,
      includeSkippedIndexes: true
    })
  }
  const history = useHistory()
  const { showError } = useToaster()

  useEffect(() => {
    if (errorToasterMessage) {
      showError(errorToasterMessage)
    }
  }, [showError, errorToasterMessage])

  const title = leftNav ? (
    <div className={css.sideItems}>{leftNav}</div>
  ) : (
    <Heading
      className={css.sideItems}
      // style={{ position: 'fixed', top: '35px', paddingLeft: 'var(--spacing-large)' }}
      padding="small"
      level={2}
    >
      {wizardLabel}
    </Heading>
  )
  return (
    <section className={cx(css.wizardShell, className)} ref={layoutRef}>
      {leftNav || showVisualYaml || rightNav ? (
        <section className={css.extendedNav}>
          {title}
          {/* {showVisualYaml ? <VisualYamlToggle /> : null} */}
          <div className={css.sideItems}>{rightNav ? rightNav : null}</div>
        </section>
      ) : (
        <Heading
          style={{ position: 'fixed', top: '35px', paddingLeft: 'var(--spacing-large)', zIndex: 2 }}
          padding="small"
          level={2}
        >
          {wizardLabel}
        </Heading>
      )}
      <div className={css.headerLine}></div>
      <Layout.Horizontal spacing="large" className={css.tabsContainer}>
        <Formik {...formikInitialProps} validateOnChange={validateOnChange}>
          {formikProps => (
            <FormikForm>
              <NavigationCheck
                when={formikProps.dirty}
                shouldBlockNavigation={() => !(formikProps.isSubmitting && formikProps.isValid)}
                navigate={newPath => {
                  history.push(newPath)
                }}
              />
              <Tabs id="Wizard" onChange={handleTabChange} selectedTabId={selectedTabId}>
                {wizardMap.panels.map((_panel, panelIndex) => {
                  const { id, tabTitle, tabTitleComponent, requiredFields = [], checkValidPanel } = _panel
                  return (
                    <Tab
                      key={id}
                      id={id}
                      style={{ width: tabWidth ? tabWidth : 'auto' }}
                      title={renderTitle({
                        tabTitle,
                        tabTitleComponent,
                        requiredFields,
                        checkValidPanel,
                        panelIndex,
                        touchedPanels,
                        isEdit,
                        includeTabNumber,
                        formikValues: formikProps.values,
                        ref: elementsRef.current[panelIndex]
                      })}
                      panel={
                        children?.[panelIndex] && React.cloneElement(children[panelIndex], { formikProps, isEdit })
                      }
                    />
                  )
                })}
              </Tabs>
              <Layout.Horizontal spacing="medium" className={css.footer}>
                {selectedTabIndex !== 0 && (
                  <Button
                    text={getString('back')}
                    icon="chevron-left"
                    minimal
                    onClick={() => {
                      const upcomingTabIndex = selectedTabIndex - 1
                      setSelectedTabId(tabsMap[upcomingTabIndex])
                      setSelectedTabIndex(upcomingTabIndex)
                      setNewTouchedPanel({ selectedTabIndex, upcomingTabIndex, touchedPanels, setTouchedPanels })
                      formikProps.validateForm()
                    }}
                  />
                )}
                {!lastTab && (
                  <Button
                    text={getString('continue')}
                    intent="primary"
                    rightIcon="chevron-right"
                    onClick={() => {
                      const upcomingTabIndex = selectedTabIndex + 1
                      setSelectedTabId(tabsMap[upcomingTabIndex])
                      setSelectedTabIndex(upcomingTabIndex)
                      setNewTouchedPanel({ selectedTabIndex, upcomingTabIndex, touchedPanels, setTouchedPanels })
                      formikProps.validateForm()
                    }}
                  />
                )}
                {lastTab && (
                  <Button
                    text={submitLabel || getString('submit')}
                    intent="primary"
                    rightIcon="chevron-right"
                    type="submit"
                    disabled={disableSubmit}
                    onClick={() => {
                      if (
                        elementsRef.current.some(
                          (element): boolean =>
                            !!element?.current?.firstElementChild?.classList?.contains('bp3-icon-warning-sign')
                        )
                      ) {
                        setValidateOnChange(true)
                        showError(getString('addressErrorFields'))
                      }
                    }}
                  />
                )}
                <Text className={css.cancel} onClick={onHide}>
                  {getString('cancel')}
                </Text>
              </Layout.Horizontal>
            </FormikForm>
          )}
        </Formik>
      </Layout.Horizontal>
      <div className={css.footerLine}></div>
    </section>
  )
}

export default Wizard
