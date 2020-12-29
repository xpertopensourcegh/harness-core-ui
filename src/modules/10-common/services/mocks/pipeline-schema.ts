export const pipelineSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    pipeline: {
      type: 'object',
      properties: {
        name: {
          type: 'string'
        },
        identifier: {
          type: 'string'
        },
        description: {
          type: 'string'
        },
        orgIdentifier: {
          type: 'string'
        },
        projectIdentifier: {
          type: 'string'
        },
        ciCodebase: {
          type: 'object',
          properties: {
            type: {
              enum: ['GitHub', 'BitBucket', 'GitLab']
            }
          },
          propertyNames: {
            enum: ['type', 'spec']
          },
          allOf: [
            {
              if: {
                properties: {
                  type: {
                    const: 'GitHub'
                  }
                }
              },
              then: {
                properties: {
                  spec: {
                    properties: {
                      connectorRef: {
                        type: 'string'
                      },
                      repoPath: {
                        type: 'string'
                      }
                    },
                    required: ['connectorRef'],
                    additionalProperties: false
                  }
                }
              }
            }
          ]
        },
        stages: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              stage: {
                $schema: 'http://json-schema.org/draft-07/schema#',
                type: 'object',
                properties: {
                  type: {
                    enum: ['ci', 'Deployment']
                  },
                  name: {
                    type: 'string'
                  },
                  identifier: {
                    type: 'string'
                  }
                },
                if: {
                  properties: {
                    type: {
                      const: 'ci'
                    }
                  }
                },
                then: {
                  properties: {
                    spec: {
                      type: 'object',
                      properties: {
                        description: {
                          type: 'string'
                        },
                        workingDir: {
                          type: 'string',
                          default: '~/harness'
                        },
                        cloneCodebase: {
                          type: 'boolean',
                          default: true
                        },
                        sharedPaths: {
                          items: {
                            type: 'string'
                          }
                        },
                        customVariables: {
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string'
                              },
                              type: {
                                type: 'string'
                              },
                              value: {
                                type: 'string'
                              }
                            },
                            required: ['name', 'type', 'value'],
                            additionalProperties: false
                          }
                        },
                        infrastructure: {
                          $schema: 'http://json-schema.org/draft-07/schema#',
                          type: 'object',
                          oneOf: [
                            {
                              properties: {
                                useFromStage: {
                                  type: 'object',
                                  properties: {
                                    stage: {
                                      type: 'string'
                                    }
                                  },
                                  required: ['stage']
                                }
                              },
                              required: ['useFromStage'],
                              additionalProperties: false
                            },
                            {
                              properties: {
                                type: {
                                  enum: ['kubernetes-direct']
                                }
                              },
                              required: ['type', 'spec'],
                              propertyNames: {
                                enum: ['type', 'spec']
                              },
                              allOf: [
                                {
                                  if: {
                                    properties: {
                                      type: {
                                        const: 'kubernetes-direct'
                                      }
                                    }
                                  },
                                  then: {
                                    properties: {
                                      spec: {
                                        properties: {
                                          connectorRef: {
                                            type: 'string'
                                          },
                                          namespace: {
                                            type: 'string'
                                          }
                                        },
                                        required: ['connectorRef', 'namespace']
                                      }
                                    }
                                  }
                                }
                              ]
                            }
                          ]
                        },
                        dependencies: {
                          $schema: 'http://json-schema.org/draft-07/schema#',
                          type: 'array',
                          items: {
                            type: 'object',
                            properties: {
                              name: {
                                type: 'string'
                              },
                              identifier: {
                                type: 'string'
                              },
                              type: {
                                enum: ['service']
                              }
                            },
                            allOf: [
                              {
                                if: {
                                  properties: {
                                    type: {
                                      const: 'service'
                                    }
                                  }
                                },
                                then: {
                                  properties: {
                                    spec: {
                                      $schema: 'http://json-schema.org/draft-07/schema#',
                                      type: 'object',
                                      properties: {
                                        retry: {
                                          type: 'integer'
                                        },
                                        timeout: {
                                          type: 'integer'
                                        },
                                        environment: {
                                          type: 'object'
                                        },
                                        entrypoint: {
                                          type: 'array',
                                          items: {
                                            type: 'string'
                                          }
                                        },
                                        args: {
                                          type: 'array',
                                          items: {
                                            type: 'string'
                                          }
                                        },
                                        image: {
                                          type: 'string'
                                        },
                                        connectorRef: {
                                          type: 'string'
                                        },
                                        resources: {
                                          $schema: 'http://json-schema.org/draft-07/schema#',
                                          type: 'object',
                                          properties: {
                                            limit: {
                                              type: 'object',
                                              properties: {
                                                cpu: {
                                                  type: 'integer'
                                                },
                                                memory: {
                                                  type: 'integer'
                                                }
                                              },
                                              additionalProperties: false
                                            }
                                          },
                                          required: ['limit'],
                                          additionalProperties: false
                                        }
                                      },
                                      required: ['image'],
                                      additionalProperties: false
                                    }
                                  }
                                }
                              }
                            ],
                            required: ['identifier', 'name', 'type', 'spec']
                          }
                        },
                        execution: {
                          $schema: 'http://json-schema.org/draft-07/schema#',
                          type: 'object',
                          properties: {
                            steps: {
                              $schema: 'http://json-schema.org/draft-07/schema#',
                              type: 'array',
                              items: {
                                type: 'object',
                                properties: {
                                  step: {
                                    $schema: 'http://json-schema.org/draft-07/schema#',
                                    type: 'object',
                                    properties: {
                                      name: {
                                        type: 'string'
                                      },
                                      identifier: {
                                        type: 'string'
                                      },
                                      type: {
                                        enum: ['run', 'plugin', 'saveCache', 'restoreCache', 'publishArtifacts']
                                      }
                                    },
                                    allOf: [
                                      {
                                        if: {
                                          properties: {
                                            type: {
                                              const: 'run'
                                            }
                                          }
                                        },
                                        then: {
                                          properties: {
                                            spec: {
                                              $schema: 'http://json-schema.org/draft-07/schema#',
                                              type: 'object',
                                              properties: {
                                                retry: {
                                                  type: 'number'
                                                },
                                                timeout: {
                                                  type: 'number'
                                                },
                                                command: {
                                                  type: 'array',
                                                  items: {
                                                    type: 'string'
                                                  }
                                                },
                                                environment: {
                                                  type: 'object'
                                                },
                                                output: {
                                                  type: 'array',
                                                  items: {
                                                    type: 'string'
                                                  }
                                                },
                                                image: {
                                                  type: 'string'
                                                },
                                                connectorRef: {
                                                  type: 'string'
                                                },
                                                resources: {
                                                  $schema: 'http://json-schema.org/draft-07/schema#',
                                                  type: 'object',
                                                  properties: {
                                                    limit: {
                                                      type: 'object',
                                                      properties: {
                                                        cpu: {
                                                          type: 'integer'
                                                        },
                                                        memory: {
                                                          type: 'integer'
                                                        }
                                                      },
                                                      additionalProperties: false
                                                    }
                                                  },
                                                  required: ['limit'],
                                                  additionalProperties: false
                                                }
                                              },
                                              required: ['command', 'image']
                                            }
                                          }
                                        }
                                      },
                                      {
                                        if: {
                                          properties: {
                                            type: {
                                              const: 'plugin'
                                            }
                                          }
                                        },
                                        then: {
                                          properties: {
                                            spec: {
                                              $schema: 'http://json-schema.org/draft-07/schema#',
                                              type: 'object',
                                              properties: {
                                                retry: {
                                                  type: 'number'
                                                },
                                                timeout: {
                                                  type: 'number'
                                                },
                                                settings: {
                                                  type: 'object'
                                                },
                                                image: {
                                                  type: 'string'
                                                },
                                                connectorRef: {
                                                  type: 'string'
                                                },
                                                resources: {
                                                  $schema: 'http://json-schema.org/draft-07/schema#',
                                                  type: 'object',
                                                  properties: {
                                                    limit: {
                                                      type: 'object',
                                                      properties: {
                                                        cpu: {
                                                          type: 'integer'
                                                        },
                                                        memory: {
                                                          type: 'integer'
                                                        }
                                                      },
                                                      additionalProperties: false
                                                    }
                                                  },
                                                  required: ['limit'],
                                                  additionalProperties: false
                                                }
                                              },
                                              required: ['image']
                                            }
                                          }
                                        }
                                      },
                                      {
                                        if: {
                                          properties: {
                                            type: {
                                              const: 'saveCache'
                                            }
                                          }
                                        },
                                        then: {
                                          properties: {
                                            spec: {
                                              $schema: 'http://json-schema.org/draft-07/schema#',
                                              type: 'object',
                                              properties: {
                                                retry: {
                                                  type: 'number'
                                                },
                                                timeout: {
                                                  type: 'number'
                                                },
                                                key: {
                                                  type: 'string'
                                                },
                                                paths: {
                                                  type: 'array',
                                                  items: {
                                                    type: 'string'
                                                  }
                                                }
                                              },
                                              required: ['key', 'paths'],
                                              additionalProperties: false
                                            }
                                          }
                                        }
                                      },
                                      {
                                        if: {
                                          properties: {
                                            type: {
                                              const: 'restoreCache'
                                            }
                                          }
                                        },
                                        then: {
                                          properties: {
                                            spec: {
                                              $schema: 'http://json-schema.org/draft-07/schema#',
                                              type: 'object',
                                              properties: {
                                                retry: {
                                                  type: 'number'
                                                },
                                                timeout: {
                                                  type: 'number'
                                                },
                                                key: {
                                                  type: 'string'
                                                },
                                                failIfNotExist: {
                                                  type: 'boolean',
                                                  default: false
                                                }
                                              },
                                              required: ['key']
                                            }
                                          }
                                        }
                                      },
                                      {
                                        if: {
                                          properties: {
                                            type: {
                                              const: 'publishArtifacts'
                                            }
                                          }
                                        },
                                        then: {
                                          properties: {
                                            spec: {
                                              $schema: 'http://json-schema.org/draft-07/schema#',
                                              type: 'object',
                                              properties: {
                                                retry: {
                                                  type: 'number'
                                                },
                                                timeout: {
                                                  type: 'number'
                                                },
                                                publishArtifacts: {
                                                  type: 'array',
                                                  items: {
                                                    $schema: 'http://json-schema.org/draft-07/schema#',
                                                    properties: {
                                                      filePattern: {
                                                        type: 'string'
                                                      },
                                                      dockerFile: {
                                                        type: 'string'
                                                      },
                                                      dockerImage: {
                                                        type: 'string'
                                                      }
                                                    },
                                                    dependencies: {
                                                      filePattern: {
                                                        properties: {
                                                          s3: {
                                                            $ref: '#/definitions/s3'
                                                          },
                                                          artifactory: {
                                                            $ref: '#/definitions/artifactory'
                                                          },
                                                          nexus: {
                                                            $ref: '#/definitions/nexus'
                                                          }
                                                        },
                                                        oneOf: [
                                                          {
                                                            required: ['artifactory']
                                                          },
                                                          {
                                                            required: ['s3']
                                                          },
                                                          {
                                                            required: ['nexus']
                                                          }
                                                        ],
                                                        propertyNames: {
                                                          enum: ['filePattern', 's3', 'artifactory', 'nexus']
                                                        }
                                                      },
                                                      dockerImage: {
                                                        properties: {
                                                          tag: {
                                                            type: 'string'
                                                          },
                                                          s3: {
                                                            $ref: '#/definitions/s3'
                                                          },
                                                          artifactory: {
                                                            $ref: '#/definitions/artifactory'
                                                          },
                                                          nexus: {
                                                            $ref: '#/definitions/nexus'
                                                          },
                                                          dockerhub: {
                                                            $ref: '#/definitions/dockerhub'
                                                          },
                                                          gcr: {
                                                            $ref: '#/definitions/gcr'
                                                          },
                                                          ecr: {
                                                            $ref: '#/definitions/ecr'
                                                          }
                                                        },
                                                        allOf: [
                                                          {
                                                            required: ['dockerImage', 'tag'],
                                                            anyOf: [
                                                              {
                                                                required: ['artifactory']
                                                              },
                                                              {
                                                                required: ['s3']
                                                              },
                                                              {
                                                                required: ['nexus']
                                                              },
                                                              {
                                                                required: ['gcr']
                                                              },
                                                              {
                                                                required: ['ecr']
                                                              },
                                                              {
                                                                required: ['dockerhub']
                                                              }
                                                            ]
                                                          }
                                                        ],
                                                        propertyNames: {
                                                          enum: [
                                                            'dockerImage',
                                                            'tag',
                                                            's3',
                                                            'nexus',
                                                            'artifactory',
                                                            'dockerhub',
                                                            'ecr',
                                                            'gcr'
                                                          ]
                                                        }
                                                      },
                                                      dockerFile: {
                                                        properties: {
                                                          context: {
                                                            type: 'string'
                                                          },
                                                          image: {
                                                            type: 'string'
                                                          },
                                                          tag: {
                                                            type: 'string'
                                                          },
                                                          buildArguments: {
                                                            type: 'array',
                                                            items: {
                                                              type: 'object',
                                                              properties: {
                                                                key: {
                                                                  type: 'string'
                                                                },
                                                                value: {
                                                                  type: 'string'
                                                                }
                                                              },
                                                              required: ['key', 'value']
                                                            }
                                                          },
                                                          s3: {
                                                            $ref: '#/definitions/s3'
                                                          },
                                                          artifactory: {
                                                            $ref: '#/definitions/artifactory'
                                                          },
                                                          nexus: {
                                                            $ref: '#/definitions/nexus'
                                                          },
                                                          dockerhub: {
                                                            $ref: '#/definitions/dockerhub'
                                                          },
                                                          gcr: {
                                                            $ref: '#/definitions/gcr'
                                                          },
                                                          ecr: {
                                                            $ref: '#/definitions/ecr'
                                                          }
                                                        },
                                                        allOf: [
                                                          {
                                                            required: ['dockerFile', 'context', 'image', 'tag'],
                                                            oneof: [
                                                              {
                                                                required: ['artifactory']
                                                              },
                                                              {
                                                                required: ['s3']
                                                              },
                                                              {
                                                                required: ['nexus']
                                                              },
                                                              {
                                                                required: ['gcr']
                                                              },
                                                              {
                                                                required: ['ecr']
                                                              },
                                                              {
                                                                required: ['dockerhub']
                                                              }
                                                            ]
                                                          }
                                                        ],
                                                        propertyNames: {
                                                          enum: [
                                                            'dockerFile',
                                                            'context',
                                                            'image',
                                                            'buildArguments',
                                                            'tag',
                                                            's3',
                                                            'nexus',
                                                            'artifactory',
                                                            'dockerhub',
                                                            'ecr',
                                                            'gcr'
                                                          ]
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              },
                                              required: ['publishArtifacts']
                                            }
                                          }
                                        }
                                      }
                                    ]
                                  }
                                }
                              }
                            }
                          },
                          required: ['steps']
                        }
                      },
                      required: ['infrastructure', 'execution'],
                      additionalProperties: false
                    }
                  }
                },
                required: ['name', 'identifier', 'spec']
              }
            }
          }
        }
      },
      required: ['name', 'identifier', 'ciCodebase', 'stages'],
      additionalProperties: false
    }
  },
  required: ['pipeline'],
  additionalProperties: false,
  definitions: {
    artifactory: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        },
        repository: {
          type: 'string'
        },
        artifactPath: {
          type: 'string'
        }
      },
      required: ['connectorRef', 'repository', 'artifactPath'],
      additionalProperties: false
    },
    nexus: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        },
        path: {
          type: 'string'
        }
      },
      required: ['connectorRef', 'path'],
      additionalProperties: false
    },
    s3: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        },
        location: {
          type: 'string'
        }
      },
      required: ['connectorRef', 'location'],
      additionalProperties: false
    },
    dockerhub: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        }
      },
      required: ['connectorRef'],
      additionalProperties: false
    },
    ecr: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        },
        location: {
          type: 'string'
        },
        region: {
          type: 'string'
        }
      },
      required: ['connectorRef', 'location', 'region'],
      additionalProperties: false
    },
    gcr: {
      type: 'object',
      properties: {
        connectorRef: {
          type: 'string'
        },
        location: {
          type: 'string'
        }
      },
      required: ['connectorRef', 'location'],
      additionalProperties: false
    }
  }
}
