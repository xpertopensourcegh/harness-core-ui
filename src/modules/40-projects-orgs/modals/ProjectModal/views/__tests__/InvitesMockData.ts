export const invitesMockData = {
  data: {
    status: 'SUCCESS',
    data: {
      totalPages: 1,
      totalItems: 4,
      pageItemCount: 4,
      pageSize: 50,
      content: [
        {
          id: '5f773f61cc54a42436326268',
          name: 'example4',
          email: 'example4@email.com',
          role: { name: 'Project Admin' },
          inviteType: 'ADMIN_INITIATED_INVITE',
          approved: false
        },
        {
          id: '5f773f61cc54a42436326267',
          name: 'example3',
          email: 'example3@email.com',
          role: { name: 'Project Admin' },
          inviteType: 'ADMIN_INITIATED_INVITE',
          approved: false
        },
        {
          id: '5f773f61cc54a42436326266',
          name: 'example2',
          email: 'example2@email.com',
          role: { name: 'Project Admin' },
          inviteType: 'ADMIN_INITIATED_INVITE',
          approved: false
        },
        {
          id: '5f773f60cc54a42436326265',
          name: 'example1',
          email: 'example1@email.com',
          role: { name: 'Project Admin' },
          inviteType: 'USER_INITIATED_INVITE',
          approved: true
        }
      ],
      pageIndex: 0,
      empty: false
    }
  }
}
