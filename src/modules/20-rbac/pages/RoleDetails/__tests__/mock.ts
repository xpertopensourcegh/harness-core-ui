export const resourceTypesMockData = {
  status: 'SUCCESS',
  data: { resourceTypes: ['ORGANIZATION', 'SECRET_MANAGER', 'PROJECT'] },
  metaData: null,
  correlationId: '102034b9-83eb-4637-a039-e70fa2b71c91'
}

export const roleMockData = {
  status: 'SUCCESS',
  data: {
    role: {
      identifier: 'role',
      name: 'role',
      permissions: null,
      scopes: ['account'],
      description: 'vfkvnfknvfv',
      tags: { vfmvfv: '' }
    },
    parentIdentifier: '/account/kmpySmUISimoRrJL6NL73w',
    harnessManaged: false,
    createdAt: 1612942343471,
    lastModifiedAt: 1612942343471
  },
  metaData: null,
  correlationId: '65b01698-8093-472a-801e-f58f44ec6388'
}

export const permissionListMockData = {
  status: 'SUCCESS',
  data: [
    {
      permission: {
        identifier: 'core.organization.delete',
        name: 'Delete Organization',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'account'],
        resourceType: 'organization',
        action: 'delete'
      }
    },
    {
      permission: {
        identifier: 'core.project.create',
        name: 'Create Project',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'account'],
        resourceType: 'project',
        action: 'create'
      }
    },
    {
      permission: {
        identifier: 'core.organization.create',
        name: 'Create Organization',
        status: 'ACTIVE',
        allowedScopeLevels: ['account'],
        resourceType: 'organization',
        action: 'create'
      }
    },
    {
      permission: {
        identifier: 'core.project.delete',
        name: 'Delete Project',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'project', 'account'],
        resourceType: 'project',
        action: 'delete'
      }
    },
    {
      permission: {
        identifier: 'core.organization.view',
        name: 'View Organization',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'account'],
        resourceType: 'organization',
        action: 'view'
      }
    },
    {
      permission: {
        identifier: 'core.project.edit',
        name: 'Edit Project',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'project', 'account'],
        resourceType: 'project',
        action: 'edit'
      }
    },
    {
      permission: {
        identifier: 'core.organization.edit',
        name: 'Edit Organization',
        status: 'ACTIVE',
        allowedScopeLevels: ['organization', 'account'],
        resourceType: 'organization',
        action: 'edit'
      }
    }
  ],
  metaData: {},
  correlationId: 'fcc8c652-eac6-4d46-b6bc-c66a0c3d1281'
}
