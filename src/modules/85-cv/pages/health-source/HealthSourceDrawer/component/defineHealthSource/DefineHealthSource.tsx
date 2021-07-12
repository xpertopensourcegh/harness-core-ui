import React, { useContext } from 'react'
import { Container, Card, Formik, FormikForm, FormInput, Text, IconName, Layout, Icon } from '@wings-software/uicore'
import cx from 'classnames'
import {
  ConnectorSelection,
  SelectOrCreateConnectorFieldNames
} from '@cv/pages/onboarding/SelectOrCreateConnector/SelectOrCreateConnector'
import { useStrings } from 'framework/strings'
import { BGColorWrapper } from '@cv/pages/health-source/common/StyledComponents'
import CardWithOuterTitle from '@cv/pages/health-source/common/CardWithOuterTitle/CardWithOuterTitle'
import DrawerFooter from '@cv/pages/health-source/common/DrawerFooter/DrawerFooter'
import { SetupSourceTabsContext } from '@cv/components/CVSetupSourcesView/SetupSourceTabs/SetupSourceTabs'
import { buildConnectorRef } from '@cv/pages/onboarding/CVOnBoardingUtils'
import { HEALTHSOURCE_LIST } from './DefineHealthSource.constant'
import { validate, getFeatureOption } from './DefineHealthSource.utils'
import css from './DefineHealthSource.module.scss'

function DefineHealthSource(): JSX.Element {
  const { getString } = useStrings()
  const { onNext, sourceData } = useContext(SetupSourceTabsContext)
  const { isEdit } = sourceData

  return (
    <BGColorWrapper>
      <Formik
        enableReinitialize
        initialValues={sourceData}
        formName={'defineHealthsource'}
        validationSchema={validate(isEdit, getString)}
        onSubmit={values => {
          onNext(values, { tabStatus: 'SUCCESS' })
        }}
      >
        {formik => {
          return (
            <FormikForm className={css.formFullheight}>
              <CardWithOuterTitle title={getString('cv.healthSource.defineHealthSource')}>
                <>
                  <Text font={'small'} margin={{ bottom: 'large' }}>
                    {getString('cv.healthSource.selectHealthSource')}
                  </Text>
                  <FormInput.CustomRender
                    name={'sourceType'}
                    render={() => {
                      return (
                        <Layout.Horizontal
                          className={cx(isEdit && css.disabled)}
                          height={120}
                          margin={{ left: 'xxxlarge', right: 'xxxlarge' }}
                        >
                          {HEALTHSOURCE_LIST.map(({ name, icon }) => (
                            <div key={name} className={cx(css.squareCardContainer, isEdit && css.disabled)}>
                              <Card
                                disabled={false}
                                interactive={true}
                                selected={name === formik?.values?.sourceType}
                                cornerSelected={name === formik?.values?.sourceType}
                                className={css.squareCard}
                                onClick={() => {
                                  formik.setFieldValue('sourceType', name)
                                }}
                              >
                                <Icon name={icon as IconName} size={26} height={26} />
                              </Card>
                              <Text
                                style={{
                                  fontSize: '12px',
                                  color: name === formik.values.sourceType ? 'var(--grey-900)' : 'var(--grey-350)',
                                  textAlign: 'center'
                                }}
                              >
                                {name}
                              </Text>
                            </div>
                          ))}
                        </Layout.Horizontal>
                      )
                    }}
                  />
                  <Container margin={{ bottom: 'large' }} width={'400px'}>
                    <FormInput.InputWithIdentifier
                      isIdentifierEditable={!isEdit}
                      inputName="healthSourceName"
                      inputLabel={getString('cv.healthSource.nameLabel')}
                      inputGroupProps={{
                        placeholder: getString('cv.healthSource.namePlaceholder')
                      }}
                      idName="healthSourceidentifier"
                    />
                  </Container>
                  <Text font={'small'}>
                    {getString('cv.healthSource.seriveEnvironmentNote', {
                      service: formik?.values?.serviceName,
                      environment: formik?.values?.environmentName
                    })}
                  </Text>
                </>
              </CardWithOuterTitle>
              <CardWithOuterTitle title={getString('cv.healthSource.connectHealthSource')}>
                <>
                  <Container margin={{ bottom: 'large' }} width={'400px'}>
                    <Text font={'small'} margin={{ bottom: 'small' }}>
                      {getString('connectors.selectConnector')}
                    </Text>
                    <div className={css.connectorField}>
                      <ConnectorSelection
                        width={400}
                        connectorType={formik?.values?.sourceType}
                        disableConnector={!!formik?.values?.connectorRef?.value && isEdit}
                        createConnectorText={getString('cv.healthSource.connectors.createConnector', {
                          sourceType: formik?.values?.sourceType
                        })}
                        onSuccess={connectorInfo => {
                          formik.setFieldValue(
                            SelectOrCreateConnectorFieldNames.CONNECTOR_REF,
                            buildConnectorRef(connectorInfo)
                          )
                        }}
                        isNewConnectorLabelVisible
                      />
                    </div>
                  </Container>
                  <Container margin={{ bottom: 'large' }} width={'400px'}>
                    <Text font={'small'} margin={{ bottom: 'small' }}>
                      {getString('cv.healthSource.featureLabel')}
                    </Text>
                    <FormInput.Select
                      items={getFeatureOption(formik?.values?.sourceType, getString)}
                      placeholder={getString('cv.healthSource.featurePlaceholder', {
                        sourceType: formik?.values?.sourceType
                      })}
                      name="product"
                      disabled={isEdit}
                    />
                  </Container>
                </>
              </CardWithOuterTitle>
              <DrawerFooter onNext={() => formik.submitForm()} />
            </FormikForm>
          )
        }}
      </Formik>
    </BGColorWrapper>
  )
}

export default DefineHealthSource
