const { loginAndNavigateToAccessPolicy, createRule, publishRule, checkSuccessMessage, msgs, assertAccessPolicyUi, assertActionsMenuItems, MENU_ITEMS, assertNewRuleFormUi, filterRulesBySearch, variables } = require('./Clienconnectivity_Driver.cy')


describe('Client connectivity Policy Tests', () => {
  beforeEach(() => {
    loginAndNavigateToAccessPolicy()
  })

  // it('Access Policy UI is rendered correctly', () => {
  //   assertAccessPolicyUi()
  // })

  // it('Actions menu contains expected items', () => {
  //   assertActionsMenuItems(MENU_ITEMS)
  // })


  // it('New Rule form should display the required fields and controls', () => {
  //   assertNewRuleFormUi()
  // })


  // it('Create New Rule', () => {
  //   createRule(variables.RULE_BASIC_LAST)
  //   checkSuccessMessage(msgs.CREATE_SUCCESS)
  //   publishRule()
  //   checkSuccessMessage(msgs.PUBLISH_SUCCESS)
  // })

  // it('Create New Rule with Country', () => {
  //   createRule(variables.RULE_WITH_COUNTRY)
  //    checkSuccessMessage(msgs.CREATE_SUCCESS)
  //    publishRule()
  //    checkSuccessMessage(msgs.PUBLISH_SUCCESS)
  // })

  // it('Create New Rule with Action', () => {
  //   createRule(variables.RULE_WITH_ACTION)
  //    checkSuccessMessage(msgs.CREATE_SUCCESS)
  //    publishRule()
  //    checkSuccessMessage(msgs.PUBLISH_SUCCESS)

  // })

  // it('Create New Rule with Position = First', () => {
  //   createRule(variables.RULE_POSITION_FIRST)
  //   checkSuccessMessage(msgs.CREATE_SUCCESS)
  //   publishRule()
  //   checkSuccessMessage(msgs.PUBLISH_SUCCESS)
  // })

  it('should filter the rule list based on search input', () => {
    filterRulesBySearch(variables.SearchRule)
  })


})
