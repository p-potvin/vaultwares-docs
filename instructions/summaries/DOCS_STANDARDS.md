# DOCS_STANDARDS
Applies when: adding/editing docs-content pages or docs navigation.
Do:
- Every page must have YAML frontmatter with title and description.
- Use second-person voice; relative internal links; language tags on code blocks.
- Add new pages under `docs-content/` and regenerate resources (`npm run generate:page-resources`).
Do not:
- Create pages outside `docs-content/` or forget to regenerate resources.
Done when:
- Page renders, appears in the sidebar, and verification is recorded.
