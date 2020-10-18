export default {
  projects: 'Projects',
  loading: 'Loading...',
  addProject: '+ Add Project',
  newProject: 'New Project',
  aboutProject: 'A Harness project allows you to logically group pipelines, corresponding environments and services.',
  tabMyProjects: 'My Projects',
  tabRecent: 'Recent',
  tabAllProjects: 'All Projects',
  tabOrgs: 'Organisations:',
  orgLabel: 'All',
  newProjectWizard: {
    back: 'Back',
    saveAndClose: 'Save and Close',
    saveAndContinue: 'Save and Continue',
    createProject: {
      name: 'Create a New Project',
      newProject: 'New Project',
      cloneProject: 'Clone An Existing Project',
      gitSync: 'Git Sync',
      recommended: 'Recommended'
    },
    aboutProject: {
      name: 'About the project',
      edit: 'Edit Project',
      projectName: 'Project Name*',
      color: 'Color',
      org: 'Organisation',
      desc: 'Description',
      tags: 'Tags',
      addTags: 'Add Tags',
      preview: 'Preview',
      previewProjectCard: 'Preview your project card',
      closePreview: 'Close Preview',
      errorColor: 'required',
      errorName: 'Name is required',
      errorIdentifier: 'Identifier is required',
      errorOrganisation: 'Organisation is required',
      default: 'default',
      createSuccess: 'Project Created Successfully',
      editSuccess: 'Edited the Project Successfully',
      validationIdentifierChars: 'Identifier can only contain alphanumerics, _ and $',
      validationNameChars: 'Name can only contain alphanumerics, _ and -'
    },
    purposeList: {
      name: 'Which Harness module would you like to start with?',
      continuous: 'CONTINUOUS',
      cd: 'Deployment',
      cv: 'Verification',
      ci: 'Integration',
      ce: 'Efficiency',
      cf: 'Features',
      cdDescription: 'Deploy your services with blazingly fast pipelines.',
      cvDescription: 'Deploy in peace - verify activities that take place in your system. Identify risk early.',
      startcd: "Let's get you started with Harness Continuous Deployment",
      startcv: "Let's get you started with Harness Continuous Verification",
      startci: "Let's get you started with Harness Continuous Integration",
      startce: "Let's get you started with Harness Continuous Efficiency",
      startcf: "Let's get you started with Harness Continuous Features",
      textcd:
        'The first step is to create a pipeline.\n A pipeline allows you to automate your continuous deployment process that includes deployment,testing,provisioning, approvals, verifications and rollout.\n During your pipeline setup, you will configure your cloud accounts, artifact repositories, secret managers and infrastructure.',
      textcv: 'TBD',
      textci: 'TBD',
      textce: 'TBD',
      textcf: 'TBD',
      buttoncd: '+ Create a pipeline',
      buttoncv: '+ Start CV',
      buttonci: '+ Start CI',
      buttonce: '+ Start CE',
      buttoncf: '+ Start CF',
      modulecd: 'CD',
      modulecv: 'CV',
      moduleci: 'CI',
      modulece: 'CE',
      modulecf: 'CF',
      time: '15 min setup'
    },
    Collaborators: {
      name: 'Invite Collaborators',
      label: 'Assign a role',
      value: 'none',
      add: 'Add',
      inviteCollab: 'Invite People to Collaborate',
      invitationMsg: 'Invitation Message',
      preview: 'Preview',
      emailHello: 'Hi <collaborator>',
      emailInvite: "You've been invited to collaborate on Olivia's Harness project.",
      emailThankyou: 'Thank you,',
      emailFooter: 'Harness',
      urlMessage: "Your Project is only accessible to people you've invited",
      roleAssigned: 'Project Role Assigned:',
      url: 'https://www.harness.io/somelongencryptedprojecturl',
      pendingInvitation: 'Pending Invitation',
      requestAccess: 'Requesting Access',
      pendingUsers: (name: string) => `People Waiting to be Processed (${name})`,
      noRole: 'No project role assigned',
      collaborator: 'collaborators',
      manage: 'Manage all the users in the project',
      notValid: ' is not a valid email ',
      inviteSuccess: 'The invite has been sent successfully',
      deleteSuccess: 'The invite has been deleted successfully'
    }
  }
}
