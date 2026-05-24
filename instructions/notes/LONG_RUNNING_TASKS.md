# LONG_RUNNING_TASKS notes
Intent: prevent looping; force a minimal interview when long tasks are likely; preserve state for resume.
Trigger: estimated_output_tokens>=8000 (overlay).
Interview: exactly 1 high-impact question when last reply had no question/interview.
State: VW_STATE must be recorded in the ledger and treated as the resume source of truth; estimate is never recomputed on resume. Avoid pasting VW_STATE into chat unless the user explicitly asks; prefer a VW_STATE_REF pointer (resumeId + ledger event path/hash).
