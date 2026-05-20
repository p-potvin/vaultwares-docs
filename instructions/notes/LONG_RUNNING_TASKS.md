# LONG_RUNNING_TASKS notes
Intent: prevent looping; force a minimal interview when long tasks are likely; preserve state for resume.
Trigger: estimated_output_tokens>=8000 (overlay).
Interview: exactly 1 high-impact question when last reply had no question/interview.
State: VW_STATE must be included and treated as the resume source of truth; estimate is never recomputed on resume.
