import React from 'react'
import { Text, Formik, FormInput, Container, Color, ThumbnailSelect } from '@wings-software/uicore'
import { useStrings } from 'framework/strings'
import { Connectors } from '@connectors/constants'
import DrawerFooter from '@cv/pages/health-source/common/DrawerFooter/DrawerFooter'
import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import {
  createCardOptions,
  createChangesourceList,
  validateChangeSource,
  getChangeSourceOptions
} from './ChangeSourceDrawer.utils'
import type { ChangeSoureDrawerInterface, UpdatedChangeSourceDTO } from './ChangeSourceDrawer.types'
import PageDutyChangeSource from './components/PagerDutyChangeSource/PagerDutyChangeSource'

import style from './ChangeSourceDrawer.module.scss'

export function ChangeSourceDrawer({
  isEdit,
  rowdata,
  tableData,
  onSuccess,
  hideDrawer
}: ChangeSoureDrawerInterface): JSX.Element {
  const { getString } = useStrings()

  const onSuccessWrapper = (data: UpdatedChangeSourceDTO): void => {
    if (!data?.spec) {
      data['spec'] = {}
      if (data.type === Connectors.PAGER_DUTY) {
        data['spec'] = {
          connectorRef: data?.spec?.connectorRef,
          pagerDutyServiceId: data?.spec?.pagerDutyServiceId
        }
      }
    }
    const updatedChangeSources = createChangesourceList(tableData, data)
    onSuccess(updatedChangeSources)
  }

  return (
    <Formik
      formName={'changeSourceaForm'}
      initialValues={rowdata || {}}
      onSubmit={onSuccessWrapper}
      validate={values => validateChangeSource(values, tableData, isEdit, getString)}
      enableReinitialize
    >
      {formik => {
        return (
          <>
            <CardWithOuterTitle title={getString('cv.changeSource.defineChangeSource')}>
              <>
                <Text color={Color.BLACK} className={style.selectChangeSource} margin={{ bottom: 'large' }}>
                  {getString('cv.changeSource.selectChangeSource')}
                </Text>
                <Container margin={{ bottom: 'large' }} width={'300px'}>
                  <div className={style.alignHorizontal}>
                    <Text color={Color.BLACK} font={'small'} margin={{ bottom: 'small' }}>
                      {getString('connectors.docker.dockerProvideType')}
                    </Text>
                    <FormInput.Select
                      name="category"
                      disabled={isEdit}
                      items={getChangeSourceOptions(getString)}
                      onChange={() => {
                        formik.setFieldValue('type', '')
                      }}
                    />
                  </div>
                  {formik.values?.category && (
                    <ThumbnailSelect
                      isReadonly={isEdit}
                      name={'type'}
                      items={createCardOptions(formik.values?.category, getString)}
                    />
                  )}
                </Container>
                <hr className={style.divider} />
                <Container margin={{ bottom: 'large', top: 'large' }} color={Color.BLACK} width={'400px'}>
                  <FormInput.InputWithIdentifier
                    inputLabel={getString('cv.changeSource.sourceName')}
                    isIdentifierEditable={!isEdit}
                  />
                </Container>
              </>
            </CardWithOuterTitle>

            {formik?.values?.type === Connectors.PAGER_DUTY && <PageDutyChangeSource formik={formik} />}
            <DrawerFooter isSubmit onPrevious={hideDrawer} onNext={formik.submitForm} />
          </>
        )
      }}
    </Formik>
  )
}
