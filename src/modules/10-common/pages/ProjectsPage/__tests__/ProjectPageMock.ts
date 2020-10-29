export const projectPageMock = {
  data: {
    status: 'SUCCESS',
    data: {
      pageCount: 1,
      itemCount: 6,
      pageSize: 50,
      content: [
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'testOrg',
          identifier: 'test',
          name: 'test',
          color: '#e6b800',
          modules: ['CD'],
          description: 'test',
          tags: ['tag1', 'tag2'],
          owners: ['testAcc'],
          lastModifiedAt: 1599715118275
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Cisco_Meraki',
          identifier: 'Online_Banking',
          name: 'Online Banking',
          color: '#1c1c28',
          modules: ['CD', 'CV'],
          description: 'UI for the Payment',
          owners: ['testAcc'],
          tags: ['UI', 'Production'],
          lastModifiedAt: 1599715118275
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Cisco_Meraki',
          identifier: 'Portal',
          name: 'Portal',
          color: '#ff8800',
          modules: ['CV'],
          description: 'Online users',
          owners: ['testAcc'],
          tags: ['prod', 'ui', 'customer'],
          lastModifiedAt: 1599715155888
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Cisco_Prime',
          identifier: 'Project_1',
          name: 'Project 1',
          color: '#e6b800',
          modules: [],
          description: '',
          owners: ['testAcc'],
          tags: [],
          lastModifiedAt: 1599740365287
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Cisco_Prime',
          identifier: 'Project_Demo',
          name: 'Project Demo',
          color: '#004fc4',
          modules: [],
          description: 'Demo project',
          owners: ['testAcc'],
          tags: ['demo', 'temporary'],
          lastModifiedAt: 1599730109213
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Harness',
          identifier: 'Drone_Data_Supplier',
          name: 'Drone Data Supplier',
          color: '#e67a00',
          modules: ['CD'],
          description: 'Drone',
          owners: ['testAcc'],
          tags: ['prod', 'master'],
          lastModifiedAt: 1599715251972
        },
        {
          accountIdentifier: 'testAcc',
          orgIdentifier: 'Harness',
          identifier: 'Swagger',
          name: 'Swagger',
          color: '#e6b800',
          modules: [],
          description: 'Swagger 2.0',
          owners: ['testAcc'],
          tags: ['ui', 'backend'],
          lastModifiedAt: 1599715290787
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

export const projectMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      orgIdentifier: 'Cisco_Meraki',
      identifier: 'Portal',
      name: 'Portal',
      color: '#ff8800',
      modules: [],
      description: 'Online users',
      owners: ['testAcc'],
      tags: ['prod', 'ui', 'customer'],
      lastModifiedAt: 1599715155888
    },
    metaData: undefined,
    correlationId: '88124a30-e021-4890-8466-c2345e1d42d6'
  },
  loading: false
}

export const OrgMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      accountIdentifier: 'testAcc',
      identifier: 'testOrg',
      name: 'Org Name',
      color: '#004fc4',
      description: 'Description',
      tags: ['tag1', 'tag2'],
      lastModifiedAt: 1602148957762
    },
    metaData: undefined,
    correlationId: '9f77f74d-c4ab-44a2-bfea-b4545c6a4a39'
  }
}

export const createMockData = {
  mutate: async () => {
    return {
      status: 'SUCCESS',
      data: {
        accountIdentifier: 'kmpySmUISimoRrJL6NL73w',
        orgIdentifier: 'testOrg',
        identifier: 'dummy_name',
        name: 'dummy name',
        color: '#0063F7',
        modules: [],
        description: '',
        owners: ['testAcc'],
        tags: [],
        lastModifiedAt: 1602660684194
      },
      metaData: undefined,
      correlationId: '375d39b4-3552-42a2-a4e3-e6b9b7e51d44'
    }
  },
  loading: false
}
