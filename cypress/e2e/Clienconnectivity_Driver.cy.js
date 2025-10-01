const baseUrl = 'https://marah-testing.cc.test.catonet.works/?'
const authUrl = 'https://marah-testing.auth.test.catonet.works'
const credentials = {
  username: 'marah.shabib@exalt.ps',
  password: '123456Shm@3',
  mfa: '480239'
}

const selectors = {
  login: {
    username: '#username',
    password: '#password',
    submit: '.btn-submit',
    mfa: '#mfaCode'
  },
  rule: {
    newButton: '[data-testid="catobutton-new"]',
    nameInput: '#name',
    descriptionInput: '#description',
    positionLabel: 'div',
    positionItem: 'li',
    saveButton: '[data-testid="catobutton-save"]',
    cancelButton: '[data-testid="catobutton-cancel"]',
    positionSelectedText: '[data-testid="select-position.position"]',
    positionSelectValue: '[id^="mui-component-select-position.position"]',
    tableRows: '[data-testid="awesometable-table-client.connectivity.policy.pps"] tbody tr',
    tableBodyRows: 'tbody.MuiV5-TableBody-root tr',
    publishButton: '[data-testid="pps-publish-btn"]',
    publishCatoButton: '[data-testid="catobutton-generic"]'
  },
  ui: {
    pageTitle: '#page-title h3',
    ppsStatus: '[data-testid="pps-pps-status"]',
    greenRoundCheckIcon: 'svg[data-icon-name="GreenRoundCheck"]',
    table: '[data-testid="awesometable-table-client.connectivity.policy.pps"]',
    tableHeaderCells: '[data-testid="awesometable-table-client.connectivity.policy.pps"] thead th',
    menubutton: '[data-testid="actionscell-menu-button"]',
    searchInput: 'input[placeholder="Search"]',
    enabledToggle: 'input[name="enabled"][type="checkbox"]',
    enabledLabelText: 'Enabled',
    modalHeaderH3: 'h3',
    modalCloseButton: 'button[aria-label="Close"]',
    modalCloseIcon: 'svg[data-icon-name="Close"]',
    expandAllTextTag: 'p',
    newRuleSections: [
      'General',
      'Users/Groups',
      'Confidence Level',
      'Platforms',
      'Countries',
      'Device Posture Profiles'
    ]
  },
  action: {
    section: '[data-testid="ccp-sec-action"]',
    select: '#mui-component-select-action',
    option: 'li[data-value]'
  },
  country: {
    section: '[data-testid="ccp-sec-countries"]',
    typeAheadInput: 'input[role="combobox"]',
    listItem: 'ul[role="listbox"] li',
    searchInput: 'input[placeholder="Search or select Country"]'
  },
  notifications: {
    catoSnackbar: '[id^="CatoSnackbar_"]'
  }
}

const msgs = {

  CREATE_SUCCESS: "Changes were applied to your unpublished revision. This revision is available for editing until it’s published or discarded.",
  UNPUBLISHED_SUCCESS_PREFIX: 'Changes were applied to your unpublished revision',
  PUBLISH_SUCCESS: 'Changes published successfully'
}

const variables = {
  RULE_BASIC_LAST: { name: 'Rule1', position: 'First' },
  RULE_WITH_COUNTRY: { name: 'Rule3', country: 'Algeria' },
  RULE_WITH_ACTION: { name: 'Rule9', action: 'ALLOW_INTERNET' },
  RULE_POSITION_FIRST: { name: 'Rule7', position: 'First' },
  RULE_POSITION_BEFORE: { name: 'Rule8', position: 'Last' },
  SearchRule: 'rule1'
}

const MENU_ITEMS = [
  'Disable',
  'Delete Rule',
  'Move Rule',
  'Duplicate Rule',
  'Add Rule Above'
]

 const headers = [
      '#',
      'Name',
      'Description',
      'Users/Groups',
      'Confidence Level',
      'Platforms',
      'Countries',
      'Device Posture Profiles',
      'Action'
    ];

function loginAndNavigateToAccessPolicy() {
  cy.visit(`${baseUrl}/#/account/186361/settings;AccessPolicy`)
  cy.origin(authUrl, { args: { credentials, selectors } }, ({ credentials, selectors }) => {
    cy.get(selectors.login.username, { timeout: 10000 }).should('be.visible').clear({ force: true }).type(credentials.username)
    cy.get(selectors.login.password, { timeout: 10000 }).should('be.visible').type(credentials.password)
    cy.get(selectors.login.submit, { timeout: 10000 }).should('be.visible').click()
    cy.get(selectors.login.mfa, { timeout: 10000 }).should('be.visible').type(credentials.mfa)
    cy.get(selectors.login.submit, { timeout: 10000 }).should('be.visible').click()
  })
}

function createRule(rule = {}) {
  const { name, position, action, country } = rule
  cy.get(selectors.rule.newButton, { timeout: 30000 }).should('be.visible').click()
  cy.get(selectors.rule.nameInput, { timeout: 10000 }).should('be.visible').type(name)

  if (position) {
    cy.contains(selectors.rule.positionLabel, 'Last').click()
    cy.contains(selectors.rule.positionItem, position).click()
  }

  if (action) {
    cy.get(selectors.action.section).click()
    cy.get(selectors.action.select).click()
    cy.get(`li[data-value="${action}"]`).click()
  }

  if (country) {
    cy.get(selectors.country.section).click()
    cy.get(selectors.country.typeAheadInput).should('be.visible').type('Country')
    cy.get(selectors.country.listItem).contains('Country').click()
    cy.get(selectors.country.searchInput).should('be.visible').type(country)
    cy.get(selectors.country.listItem).contains(country).click()
  }

  cy.get(selectors.rule.saveButton).should('be.visible').click()

 
  cy.wait(3000)
  
  const effectivePosition = position || 'Last'
  verifyRulePosition(effectivePosition, name)
  


}

function verifyRulePosition(position, name) {
  if (position == 'Last') {
    cy.log('Verifying rule in last row:', name);
    cy.get(selectors.rule.tableBodyRows).last()
      .find('td')
      .eq(2)
      .should('contain.text', name);
  } else if (position == 'First') {
    cy.log('Verifying rule in first row:', name);
    cy.get(selectors.rule.tableBodyRows).first()
      .find('td')
      .eq(2)
      .should('contain.text', name);
  }
}

function publishRule() {
  cy.get(selectors.rule.publishButton).first().should('be.visible').click()
  cy.get(selectors.rule.publishCatoButton).first().should('be.visible').click()
}




function checkSuccessMessage(expectedText = msgs.CREATE_SUCCESS) {
  cy.get(selectors.notifications.catoSnackbar).invoke('text').then(console.log)
  cy.get(selectors.notifications.catoSnackbar)
    .should('be.visible')
    .invoke('text')
    .should('include', expectedText)
}



function assertAccessPolicyUi() {
   
  cy.get(selectors.ui.pageTitle)
    .should('be.visible')
    .and('contain.text', 'Client Connectivity Policy')
  

  cy.get(selectors.ui.ppsStatus).should('be.visible')
    .and('contain.text', 'Published Revision')
  cy.get(`${selectors.ui.ppsStatus} ${selectors.ui.greenRoundCheckIcon}`).should('be.visible')

  cy.contains('button', 'New', { matchCase: false }).should('be.visible')
  cy.contains('button', 'Export', { matchCase: false }).should('be.visible')

  cy.get(selectors.ui.table, { timeout: 30000 }).should('exist').scrollIntoView()
  cy.get(`${selectors.ui.table} thead`, { timeout: 30000 }).should('exist')

  headers.forEach((header) => {
    if (header === '#') {
      cy.get(`${selectors.ui.table} thead [role="columnheader"]`).eq(0).should('be.visible')
    } else {
      cy.get(`${selectors.ui.table} thead`).within(() => {
        cy.contains('[role="columnheader"]', header, { matchCase: false }).should('be.visible')
      })
    }
  })
  
}



function assertActionsMenuItems(expectedItems = MENU_ITEMS) {
     cy.get(selectors.ui.menubutton , { timeout: 30000 }).should('be.visible').click()
  expectedItems.forEach((label) => {
    cy.contains('span', label, { matchCase: false }).should('be.visible')
  })
}

function assertNewRuleFormUi() {
  cy.get(selectors.rule.newButton, { timeout: 30000 }).should('be.visible').click()

  cy.contains(selectors.ui.modalHeaderH3, 'New Rule').should('exist')
  cy.get(selectors.ui.modalCloseButton)
    .should('exist')
    .within(() => {
      cy.get(selectors.ui.modalCloseIcon).should('exist')
    })
  cy.contains(selectors.ui.expandAllTextTag, 'Expand All').should('exist')

  selectors.ui.newRuleSections.forEach((section) => {
    cy.contains('div', section).should('exist')
  })

  cy.get(selectors.rule.nameInput)
    .should('exist')
    .and('have.attr', 'type', 'text')
  cy.get(selectors.ui.enabledToggle)
    .should('exist')
    .and('be.checked')
  cy.contains('span', selectors.ui.enabledLabelText).should('exist')
  cy.get(selectors.rule.descriptionInput)
    .should('exist')
    .and('have.attr', 'type', 'text')
  cy.get(selectors.rule.positionSelectedText).should('exist')
  cy.get(selectors.rule.positionSelectValue).should('contain.text', 'Last')

  cy.get(selectors.rule.cancelButton)
    .should('exist')
    .and('contain.text', 'Cancel')
  cy.get(selectors.rule.saveButton)
    .should('exist')
    .and('contain.text', 'Save')
    .and('be.disabled')
}

function filterRulesBySearch(query) {
  cy.get(selectors.ui.searchInput, { timeout: 30000 })
    .should('exist')
    .clear({ force: true })
    .type(query)

  cy.get(selectors.rule.tableBodyRows, { timeout: 30000 })
    .should('exist')
    .filter(':visible')
    .should('have.length.greaterThan', 0)
    .first()
    .find('td')
    .eq(2)
    .should('contain.text', query)
}

module.exports = { loginAndNavigateToAccessPolicy, createRule,publishRule, checkSuccessMessage, selectors, msgs, assertAccessPolicyUi, assertActionsMenuItems, MENU_ITEMS, assertNewRuleFormUi, filterRulesBySearch, variables }
