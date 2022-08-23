import { featureFlagsCall } from '../../support/70-pipeline/constants'

describe('Verify Step Addition', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', () => {
      // returning false here prevents Cypress from
      // failing the test
      return false
    })
    cy.fixture('api/users/feature-flags/accountId').then(featureFlagsData => {
      cy.intercept('GET', featureFlagsCall, {
        ...featureFlagsData,
        resource: [
          ...featureFlagsData.resource,
          {
            uuid: null,
            name: 'CVNG_TEMPLATE_VERIFY_STEP',
            enabled: true,
            lastUpdatedAt: 0
          }
        ]
      })
    })
    cy.initializeRoute()
    cy.intercept(
      'GET',
      '/pipeline/api/pipelines/testCypressInit?accountIdentifier=accountId&orgIdentifier=default&projectIdentifier=project1',
      {
        fixture: '/pipeline/api/pipelineWithRollingStep'
      }
    ).as('pipelineList')

    cy.visit(
      '#/account/accountId/cd/orgs/default/projects/project1/pipelines/testCypressInit/pipeline-studio/?storeType=INLINE&stageId=test&sectionId=EXECUTION',
      {
        timeout: 30000
      }
    )
    cy.wait('@pipelineList', { timeout: 30000 })
    cy.visitPageAssertion()
  })

  it('should be able to add default Monitored Service in Verify Step', () => {
    cy.apiMocksForVerifyStep()
    // adding new step
    cy.findByText(/Add step/i).should('be.visible')
    cy.findByText(/Add step/i).click()
    cy.findByTestId('addStepPipeline').should('be.visible')
    cy.findByTestId('addStepPipeline').click()

    cy.wait('@pipelineSteps')

    // click verify step
    cy.findByText(/Verify/i).click()
    cy.wait('@monitoredServices')
    cy.get("input[name='spec.monitoredServiceRef']").should('have.value', 'appd_prod')
    cy.get("input[name='spec.monitoredServiceRef']").should('be.disabled')
    cy.findByText(/^Health Sources$/i).should('exist')
    cy.findByTestId(/healthSourceTable_appd-test/i).should('exist')

    cy.fillName('test_verify')
    cy.configureStaticFieldsVerifyStep()
    cy.contains('span', 'Apply Changes').click()
  })

  it('should be able to add Configured Monitored Service in Verify Step', () => {
    cy.apiMocksForVerifyStep()
    // adding new step
    cy.findByText(/Add step/i).should('be.visible')
    cy.findByText(/Add step/i).click()
    cy.findByTestId('addStepPipeline').should('be.visible')
    cy.findByTestId('addStepPipeline').click()

    cy.wait('@pipelineSteps')

    // click verify step
    cy.findByText(/Verify/i).click()
    cy.wait('@monitoredServices')
    cy.get("input[name='spec.monitoredServiceRef']").should('have.value', 'appd_prod')
    cy.get("input[name='spec.monitoredServiceRef']").should('be.disabled')
    cy.findByText(/^Health Sources$/i).should('exist')
    cy.findByTestId(/healthSourceTable_appd-test/i).should('exist')

    cy.fillName('test_verify')
    cy.configureStaticFieldsVerifyStep()

    cy.get('input[name="spec.monitoredService.type"]').click({ force: true })
    cy.contains('p', 'Configured').click({ force: true })

    // should show validations.
    cy.contains('span', 'Apply Changes').click()
    cy.contains('span', 'Monitored service is required').should('be.visible')

    cy.get('input[name="spec.monitoredService.spec.monitoredServiceRef"]').click({ force: true })
    cy.contains('p', 'orders_prod').click({ force: true })

    cy.wait('@monitoredServiceResponse')

    cy.contains('span', 'Apply Changes').click()
  })

  it('should be able to select templatised monitored service in Verify Step', () => {
    cy.apiMocksForVerifyStep()
    // adding new step
    cy.findByText(/Add step/i).should('be.visible')
    cy.findByText(/Add step/i).click()
    cy.findByTestId('addStepPipeline').should('be.visible')
    cy.findByTestId('addStepPipeline').click()

    cy.wait('@pipelineSteps')

    // click verify step
    cy.findByText(/Verify/i).click()
    cy.wait('@monitoredServices')
    cy.get("input[name='spec.monitoredServiceRef']").should('have.value', 'appd_prod')
    cy.get("input[name='spec.monitoredServiceRef']").should('be.disabled')
    cy.findByText(/^Health Sources$/i).should('exist')
    cy.findByTestId(/healthSourceTable_appd-test/i).should('exist')

    cy.fillName('test_verify')
    cy.configureStaticFieldsVerifyStep()

    cy.get('input[name="spec.monitoredService.type"]').click({ force: true })
    cy.contains('p', 'Template').click({ force: true })

    // should show validations.
    cy.contains('span', 'Apply Changes').click()
    cy.contains('span', 'Template Selection is required.').should('be.visible')

    cy.contains('span', 'Use template').click()
    cy.contains('p', 'Verify_step_mon_template').click({ force: true })

    cy.wait('@templateInputsResponse')

    cy.contains('span', 'Use Template').click()
    cy.wait('@specificTemplatesResponse')
    cy.contains('span', 'Apply Changes').click()
  })

  it('should be able to create a verify step template with default monitored service', () => {
    cy.apiMocksForVerifyStep()

    cy.contains('p', 'Project Setup').click()
    cy.contains('p', 'Templates').click()

    cy.contains('span', 'New Template').click()
    cy.contains('p', 'Step').click()

    cy.get("input[name='name']").type('step-template')
    cy.get("input[name='versionLabel']").type('1')
    cy.contains('span', 'Start').click()

    cy.findByText(/Verify/i).click()

    cy.configureStaticFieldsVerifyStepInStepTemplate()

    cy.get('input[name="spec.monitoredService.type"]').click({ force: true })
    cy.contains('p', 'Default').click({ force: true })
    cy.contains('span', 'Save').click()
    cy.get('button[type="submit"]').click()
  })

  it('should be able to create a verify step template with configured monitored service', () => {
    cy.apiMocksForVerifyStep()

    cy.contains('p', 'Project Setup').click()
    cy.contains('p', 'Templates').click()

    cy.contains('span', 'New Template').click()
    cy.contains('p', 'Step').click()

    cy.get("input[name='name']").type('step-template')
    cy.get("input[name='versionLabel']").type('1')
    cy.contains('span', 'Start').click()

    cy.findByText(/Verify/i).click()

    cy.configureStaticFieldsVerifyStepInStepTemplate()

    cy.get('input[name="spec.monitoredService.type"]').click({ force: true })
    cy.contains('p', 'Configured').click({ force: true })

    cy.get('input[name="spec.monitoredService.spec.monitoredServiceRef"]').click({ force: true })
    cy.contains('p', 'orders_prod').click({ force: true })

    cy.wait('@monitoredServiceResponse')

    cy.contains('span', 'Save').click()
    cy.get('button[type="submit"]').click()
  })

  it('should be able to create a verify step template with templatised monitored service', () => {
    cy.apiMocksForVerifyStep()

    cy.contains('p', 'Project Setup').click()
    cy.contains('p', 'Templates').click()

    cy.contains('span', 'New Template').click()
    cy.contains('p', 'Step').click()

    cy.get("input[name='name']").type('step-template')
    cy.get("input[name='versionLabel']").type('1')
    cy.contains('span', 'Start').click()

    cy.findByText(/Verify/i).click()

    cy.configureStaticFieldsVerifyStepInStepTemplate()

    cy.get('input[name="spec.monitoredService.type"]').click({ force: true })
    cy.get('li').contains('p', 'Template').click({ force: true })

    cy.contains('span', 'Use template').click()
    cy.contains('p', 'Verify_step_mon_template').click({ force: true })

    cy.wait('@templateInputsResponse')

    cy.contains('span', 'Use Template').click()
    cy.wait('@specificTemplatesResponse')
    cy.wait(1000)

    cy.contains('span', 'Save').click()
    cy.get('button[type="submit"]').click()
  })
})
