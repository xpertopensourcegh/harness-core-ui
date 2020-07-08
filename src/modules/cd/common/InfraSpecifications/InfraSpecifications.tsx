import React from 'react'
import { Layout, Button, Card, CardBody, Text, Color } from '@wings-software/uikit'
import css from './InfraSpecifications.module.scss'
import i18n from './InfraSpecifications.i18n'
import { Formik, FormikForm, FormInput } from '@wings-software/uikit'
import * as Yup from 'yup'

const infraOptions = [
  { label: i18n.prodLabel, value: 'PROD' },
  { label: i18n.nonProdLabel, value: 'NON_PROD' }
]

export default function InfraSpecifications(): JSX.Element {
  const [isDescriptionVisible, setDescriptionVisible] = React.useState(false)
  const [isTagsVisible, setTagsVisible] = React.useState(false)

  return (
    <Layout.Vertical className={css.serviceOverrides}>
      <Layout.Vertical spacing="large">
        <Formik
          initialValues={{ infraName: '', description: '' }}
          onSubmit={values =>
            new Promise(resolve => {
              setTimeout(() => {
                // console.log(JSON.stringify(values))
                resolve(values)
              }, 5000)
            })
          }
          validationSchema={Yup.object().shape({
            infraName: Yup.string().trim().required(i18n.validation.infraName)
          })}
        >
          {() => {
            return (
              <FormikForm>
                <Layout.Horizontal spacing="medium">
                  <FormInput.Text
                    name="infraName"
                    style={{ width: 300 }}
                    label={i18n.infraNameLabel}
                    placeholder={i18n.infraNamePlaceholderText}
                  />
                  <div className={css.addDataLinks}>
                    <Button
                      minimal
                      text={i18n.addDescription}
                      icon="plus"
                      onClick={() => setDescriptionVisible(true)}
                    />
                    <Button minimal text={i18n.addTags} icon="plus" onClick={() => setTagsVisible(true)} />
                  </div>
                </Layout.Horizontal>

                {isDescriptionVisible && (
                  <div>
                    <span onClick={() => setDescriptionVisible(false)} className={css.removeLink}>
                      {i18n.removeLabel}
                    </span>
                    <FormInput.TextArea name="description" label="Description" style={{ width: 400 }} />
                  </div>
                )}
                {isTagsVisible && (
                  <div>
                    <span onClick={() => setTagsVisible(false)} className={css.removeLink}>
                      {i18n.removeLabel}
                    </span>
                    <FormInput.TagInput
                      name={i18n.tagsLabel}
                      label={i18n.tagsLabel}
                      items={[
                        'The Godfather',
                        'The Godfather: Part II',
                        'The Dark Knight',
                        '12 Angry Men',
                        "Schindler's List",
                        'Special'
                      ]}
                      style={{ width: 400 }}
                      labelFor={(name: any) => name}
                      itemFromNewTag={newTag => newTag}
                      tagInputProps={{
                        noInputBorder: true,
                        openOnKeyDown: false,
                        showAddTagButton: true,
                        showClearAllButton: true,
                        allowNewTag: true,
                        getTagProps: (value, _index, _selectedItems, createdItems) => {
                          return createdItems.includes(value)
                            ? { intent: 'danger', minimal: true }
                            : { intent: 'none', minimal: true }
                        }
                      }}
                    />
                  </div>
                )}
                <FormInput.Select
                  name="infraType"
                  style={{ width: 300 }}
                  label={i18n.infrastructureTypeLabel}
                  placeholder={i18n.infrastructureTypePlaceholder}
                  items={infraOptions}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
      <Layout.Horizontal flex={true} className={css.specTabs}>
        <Button minimal text={i18n.infraSpecificationLabel} className={css.selected} />
      </Layout.Horizontal>
      <Layout.Horizontal flex={true}>
        <Text style={{ margin: '25px 0 15px 0', color: 'black', fontSize: 16 }}> {i18n.infraSpecHelpText}</Text>
      </Layout.Horizontal>
      <Layout.Vertical spacing="medium">
        <Text style={{ fontSize: 16, color: 'var(--grey-400)' }}>{i18n.deploymentTypeLabel}</Text>
        <Card interactive={true} selected style={{ width: 120 }}>
          <CardBody.Icon icon="service-kubernetes" iconSize={34}>
            <Text font={{ align: 'center' }} style={{ fontSize: 14 }}>
              {i18n.deploymentType}
            </Text>
          </CardBody.Icon>
        </Card>
      </Layout.Vertical>
      <Layout.Vertical spacing="medium">
        <Text style={{ fontSize: 16, color: Color.BLACK, marginTop: 15 }}>{i18n.k8ConnectorLabel}</Text>
        <Formik
          initialValues={{ connectorId: '', namespaceId: '' }}
          onSubmit={values =>
            new Promise(resolve => {
              setTimeout(() => {
                // console.log(JSON.stringify(values))
                resolve(values)
              }, 5000)
            })
          }
        >
          {() => {
            return (
              <FormikForm>
                <FormInput.Select
                  name="connectorId"
                  style={{ width: 400 }}
                  label={i18n.k8ConnectorDropDownLabel}
                  placeholder={i18n.k8ConnectorDropDownPlaceholder}
                  items={[]}
                />
                <FormInput.Select
                  name="namespaceId"
                  style={{ width: 400 }}
                  label={i18n.nameSpaceLabel}
                  placeholder={i18n.nameSpacePlaceholder}
                  items={[]}
                />
              </FormikForm>
            )
          }}
        </Formik>
      </Layout.Vertical>
    </Layout.Vertical>
  )
}
