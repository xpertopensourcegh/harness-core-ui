export const orgMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      pageCount: 1,
      itemCount: 3,
      pageSize: 50,
      content: [
        {
          organization: {
            accountIdentifier: 'testAcc',
            identifier: 'testOrg',
            name: 'Org Name',
            description: 'Description',
            tags: { tag1: '', tag2: 'tag3' }
          }
        },
        {
          organization: {
            accountIdentifier: 'testAcc',
            identifier: 'default',
            name: 'default',
            description: 'default',
            tags: { tag1: '', tag2: 'tag3' }
          },
          harnessManaged: true
        }
      ],
      pageIndex: 0,
      empty: false
    },
    metaData: undefined,
    correlationId: '370210dc-a345-42fa-b3cf-69bd64eb5073'
  },
  loading: false
}
export const getOrgMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      organization: {
        accountIdentifier: 'testAcc',
        identifier: 'testOrg',
        name: 'Org Name',
        description: 'Description',
        tags: { tag1: '', tag2: 'tag3' }
      }
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}

export const getOrgAggregateMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      organizationResponse: {
        organization: {
          accountIdentifier: 'testAcc',
          identifier: 'testOrg',
          name: 'Org Name',
          description: 'Description',
          tags: { tag1: '', tag2: 'tag3' }
        },
        createdAt: 1607422602909,
        lastModifiedAt: 1607422602909
      },
      projects: [],
      admins: [{ name: 'Admin', email: 'admin@harness.io', uuid: 'lv0euRhKRCyiXWzS7pOg6g' }],
      collaborators: []
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}
export const getOrganizationAggregateDTOListMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      totalPages: 1,
      totalItems: 3,
      pageItemCount: 3,
      pageSize: 50,
      content: [
        {
          organizationResponse: {
            organization: {
              accountIdentifier: 'dummy2',
              identifier: 'bfvbfkbvf',
              name: 'bfvbfkbvf',
              description: '',
              tags: {}
            },
            createdAt: 1607450298192,
            lastModifiedAt: 1607450298192
          },
          projectsCount: 0,
          admins: [{ name: 'Admin', email: 'admin@harness.io', uuid: 'lv0euRhKRCyiXWzS7pOg6g' }],
          collaborators: [{ name: 'Admin2', email: 'admin2@harness.io', uuid: 'lv0efduRhKRCyiXWzS7pOg6g' }]
        },
        {
          organizationResponse: {
            organization: {
              accountIdentifier: 'dummy2',
              identifier: 'Harness',
              name: 'Harness',
              description: 'Harness',
              tags: { ce: 'module', prod: '', cv: 'module', ci: 'module', strin: '' }
            },
            createdAt: null,
            lastModifiedAt: 1607448526662
          },
          projectsCount: 5,
          admins: [{ name: 'Admin', email: 'admin@harness.io', uuid: 'lv0euRhKRCyiXWzS7pOg6g' }],
          collaborators: []
        },
        {
          organizationResponse: {
            organization: {
              accountIdentifier: 'dummy2',
              identifier: 'default',
              name: 'Default',
              description: 'Default Organization',
              tags: {}
            },
            createdAt: 1607447807131,
            lastModifiedAt: 1607447807131
          },
          projectsCount: 7,
          admins: [],
          collaborators: []
        }
      ],
      pageIndex: 0,
      empty: false
    },
    metaData: null,
    correlationId: '5f150ca8-8502-4c81-afc4-960f2d23f2bb'
  }
}
export const createOrgMockData = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'testAcc',
        identifier: 'testOrg',
        name: 'Org Name',
        color: '#004fc4',
        description: 'Description',
        tags: { tag1: '', tag2: 'tag3' }
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}
