# command -> ação -> agente

/pm -> create-prd -> prd-generator-agent
/pm -> create-epic -> epic-generator-agent
/pm -> create-story -> story-generator-agent

/tl -> create-tasks -> tasks-generator-agent
/tl -> create-techspec -> techspec-generator-agent

/dev -> implement-task -> task-implementor-agent
/dev -> review-task -> task-reviewer-agent

/qa -> test-task -> task-tester-agent