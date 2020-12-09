export const getDefaultProps = () => ({
  formikInitialProps: { initialValues: {}, onSubmit: jest.fn() },
  onHide: jest.fn(),
  wizardMap: {
    wizardLabel: 'Wizard Title',
    panels: [
      {
        id: 'Panel 1',
        tabTitle: 'Panel 1',
        requiredFields: ['name']
      },
      {
        id: 'Panel 2',
        tabTitle: 'Panel 2',
        checkValidPanel: (formikValues: any) => {
          const numberOnlyFieldValue = formikValues['numberOnly']
          return !numberOnlyFieldValue || !isNaN(numberOnlyFieldValue)
        }
      },
      {
        id: 'Panel 3',
        tabTitle: 'Panel 3'
      }
    ]
  }
})
