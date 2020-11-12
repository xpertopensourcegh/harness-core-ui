export default {
  titleEmail: 'Setup Email Notifications',
  titleSlack: 'Setup Slack Notifications',
  titlePagerDuty: 'Setup PagerDuty Notifications',
  helpPagerDuty:
    "Enter the key for a PagerDuty Account/Service to which Harness can send notifications. You can copy/paste this key from PagerDuty's Configuration > Services > Service Details dialog > Integrations tab.",
  infoPagerDuty: "For more details, see PagerDuty's documentation on Creating Integrations.",
  helpSlack:
    "You can receive Harness notifications in your Slack channels. You simply add a Slack Incoming Webhook into a Harness User Groups' Notification Settings.",
  infoSlack: 'For more details, see Slack’s doucmentation Getting Started with Incoming Webhooks.',
  labelEmailIds: 'Type emails of your recipients',
  labelEmailUserGroups: 'Email all members of these user groups',
  buttonTest: 'Test',
  buttonSend: 'Send',
  buttonSubmit: 'Submit',
  buttonCancel: 'Cancel',
  labelTo: 'To',
  labelSubject: 'Subject',
  labelBody: 'Body',
  validationTo: 'Recipient email is required',
  validationSubject: 'Subject is required',
  validationBody: 'Body is required',
  labelWebhookUrl: 'Slack Webhook URL',
  labelSlackUserGroups: 'Alternatively, Notify the Slack Channels associated with these user groups',
  validationWebhook: 'Webhook URL is required',
  labelPDKey: 'PagerDuty Key',
  labelPDUserGroups: 'Alternatively, Notify the PagerDuty keys associated with these user groups',
  validationPDKey: 'PagerDuty Key is required'
}
