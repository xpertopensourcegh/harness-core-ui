export default {
  projects: 'Projects',
  loading: 'Loading...',
  addProject: '+ Add Project',
  newProject: 'New Project',
  aboutProject: 'A Harness project allows you to logically group pipelines, corresponding environments and services.',
  tabMyProjects: 'My Projects',
  tabAllProjects: 'All Projects',
  tabOrgs: 'Organisations',
  newProjectWizard: {
    back: 'Back',
    next: 'Save and Continue',
    saveAndClose: 'Save and Close',
    createProject: {
      name: 'Create a New Project',
      newProject: 'New Project',
      cloneProject: 'Clone An Existing Project',
      gitSync: 'Git Sync',
      recommended: 'Recommended'
    },
    stepOne: {
      name: 'Purpose',
      continuous: 'Continuous',
      deployment: 'Deployment',
      verification: 'Verification',
      cdDescription: 'Deploy your services with blazingly fast pipelines.',
      cvDescription: 'Intelligent monitoring of your running applications',
      time: (mins: number) => `${mins}-min setup`
    },
    stepTwo: {
      name: 'About the project',
      projectName: 'Project Name*',
      color: 'Color',
      org: 'Organisation',
      desc: 'Description',
      tags: 'Tags',
      addTags: 'Add Tags',
      preview: 'Preview',
      previewProjectCard: 'Preview your project card',
      previewSubtitle: "This project will be created for you. To get going, you'll have to create a pipeline.",
      addCollab: 'Add Collaborators >'
    },
    stepThree: {
      name: 'Collaborators',
      addCollab: 'Add your Collaborators',
      invitationMsg: 'Invitation Message',
      preview: 'Preview',
      emailHello: 'Hi <collaborator',
      emailInvite: "You've been invited to collaborate on Olivia's Harness project.",
      emailThankyou: 'Thank you,',
      emailFooter: 'Harness'
    }
  }
}
