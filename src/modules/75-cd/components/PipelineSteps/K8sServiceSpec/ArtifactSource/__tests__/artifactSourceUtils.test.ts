/*
 * Copyright 2022 Harness Inc. All rights reserved.
 * Use of this source code is governed by the PolyForm Shield 1.0.0 license
 * that can be found in the licenses directory at the root of this repository, also available at
 * https://polyformproject.org/wp-content/uploads/2020/06/PolyForm-Shield-1.0.0.txt.
 */

import * as artifactSourceUtils from '../artifactSourceUtils'

describe('ArtifactSourceUtils', () => {
  test('fromPipelineInputTriggerTab works correctly', () => {
    const formik = {
      values: {
        triggerType: 'Webhook'
      },
      setFieldValue: jest.fn()
    }
    const fromTrigger = true
    const result = artifactSourceUtils.fromPipelineInputTriggerTab(formik, fromTrigger)
    expect(result).toEqual(false)
  })

  test('fromPipelineInputTriggerTab works correctly for triggerartifact type', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          identifier: 'sidecarid',
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const fromTrigger = false
    const result = artifactSourceUtils.fromPipelineInputTriggerTab(formik, fromTrigger)
    expect(result).toEqual(true)
  })

  test('fromPipelineInputTriggerTab works correctly for when fromTrigger is true', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          identifier: 'sidecarid',
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const fromTrigger = true
    const result = artifactSourceUtils.fromPipelineInputTriggerTab(formik, fromTrigger)
    expect(result).toEqual(false)
  })

  test('isSelectedStage works as expected', () => {
    const stageIdentifier = 'stageIdentifier'
    const formikStageId = 'stageId'
    const result = artifactSourceUtils.isSelectedStage(stageIdentifier, formikStageId)
    expect(result).toEqual(false)
  })

  test('isFieldfromTriggerTabDisabled works as expected', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          identifier: 'sidecarid',
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const stageIdentifier = 'stageIdentifier'
    const fromTrigger = false
    const fieldName = `artifacts.primary.spec.connectorRef`

    const result = artifactSourceUtils.isFieldfromTriggerTabDisabled(fieldName, formik, stageIdentifier, fromTrigger)
    expect(result).toEqual(false)
  })

  test('isFieldfromTriggerTabDisabled works as expected when fromTrigger is true', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          identifier: 'sidecarid',
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const stageIdentifier = 'stageIdentifier'
    const fromTrigger = true
    const fieldName = 'build'

    const result = artifactSourceUtils.isFieldfromTriggerTabDisabled(fieldName, formik, stageIdentifier, fromTrigger)
    expect(result).toEqual(true)
  })
  test('isFieldfromTriggerTabDisabled works as expected when fromTrigger is false', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        stageId: 'sidecarid',
        selectedArtifact: {
          identifier: 'sidecarid',
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const identifier = 'sidecarid'
    const stageIdentifier = 'sidecarid'
    const fromTrigger = false
    const fieldName = 'build'

    const result = artifactSourceUtils.isFieldfromTriggerTabDisabled(
      fieldName,
      formik,
      stageIdentifier,
      fromTrigger,
      identifier
    )
    expect(result).toEqual(true)
  })

  test('isSelectedArtifact works as expected', () => {
    const selectedArtifact = {
      identifier: 'sidecarid',
      type: 'DockerRegistry',
      spec: {
        connectorRef: 'connectorRef',
        tag: '<+trigger.artifact.build>'
      }
    }

    const identifier = 'sidecarid'

    const result = artifactSourceUtils.isSelectedArtifact(selectedArtifact, identifier)
    expect(result).toEqual(true)
  })

  test('isSelectedArtifact works as expected with primary artifact, and when sidecar id is undefined', () => {
    const selectedArtifact = {
      identifier: 'primary',
      type: 'DockerRegistry',
      spec: {
        connectorRef: 'connectorRef',
        tag: '<+trigger.artifact.build>'
      }
    }
    const identifier = undefined
    const result = artifactSourceUtils.isSelectedArtifact(selectedArtifact, identifier)
    expect(result).toEqual(true)
  })

  test('resetTags works as expected', () => {
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const tagPath = `stages[0].stage.spec.serviceConfig.serviceDefinition.spec.artifacts.primary.spec.tag`

    const result = artifactSourceUtils.resetTags(formik, tagPath)
    expect(result).toBeUndefined()
  })

  test('getTagError works as expected', () => {
    const tagsError = {
      data: {
        code: 'HINT',
        level: 'INFO',
        message: 'Please make sure that your delegates are connected',
        exception: null,
        failureTypes: []
      },
      metadata: null
    }

    const result = artifactSourceUtils.getTagError(tagsError as any)
    expect(result).toEqual('Please make sure that your delegates are connected')
  })

  test('getTagError return null when error object is not proper', () => {
    const tagsError = {
      code: 'HINT',
      level: 'INFO',
      message: 'Please make sure that your delegates are connected',
      exception: null,
      failureTypes: []
    }

    const result = artifactSourceUtils.getTagError(tagsError as any)
    expect(result).toEqual(null)
  })

  test('setPrimaryInitialValues works as expected', () => {
    const initialValues = {}
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          type: 'DockerRegistry',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>',
            eventConditions: 'eventConditions'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const stageIdentifier = 'stageIdentifier'
    const artifactPath = 'primary'

    expect((formik.values.selectedArtifact.spec as any).eventCondition).toBeUndefined()
    const result = artifactSourceUtils.setPrimaryInitialValues(initialValues, formik, stageIdentifier, artifactPath)
    expect(result).toBeUndefined()
  })

  test('setSidecarInitialValues works as expected', () => {
    const initialValues = {}
    const formik = {
      values: {
        triggerType: 'Artifact',
        selectedArtifact: {
          type: 'DockerRegistry',
          identifier: 'sidecaridentifier',
          spec: {
            connectorRef: 'connectorRef',
            tag: '<+trigger.artifact.build>',
            eventConditions: 'eventConditions'
          }
        }
      },
      setFieldValue: jest.fn()
    }
    const index = 2
    const stageIdentifier = 'stageIdentifier'
    const artifactPath = `sidecars[${index}].sidecar`

    expect((formik.values.selectedArtifact.spec as any).eventCondition).toBeUndefined()
    const result = artifactSourceUtils.setSidecarInitialValues(initialValues, formik, stageIdentifier, artifactPath)
    expect(result).toBeUndefined()
  })
})
