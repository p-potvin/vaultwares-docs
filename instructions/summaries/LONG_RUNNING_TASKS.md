# LONG_RUNNING_TASKS
Applies when: overlay if estimated_output_tokens>=8000.
Do:
- Stop blind retries; if repeated failures yield no new signal, ask for instruction.
- Interview gate: if your last reply asked no question and no interview occurred, ask exactly 1 question now and stop.
- Include a VW_STATE block whenever this protocol applies.
VW_STATE keys:
- routerCategories:[]
- protocolsSelected:[]
- overlaysApplied:[]
- estimate:{estimatedOutputTokens:number,rationale:string}
- interview:{askedQuestion:boolean,completed:boolean}
- resume:{resumeMode:boolean,resumeId:string}
Resume rule:
- On resume, do not re-run estimate; use VW_STATE.estimate as-is; set interview.completed=true; do not re-trigger interview for the same resumeId.
