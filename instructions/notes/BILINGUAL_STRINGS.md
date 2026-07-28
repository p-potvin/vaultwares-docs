# Bilingual Strings Policy Notes

Welcome to the VaultWares bilingual strings policy! This guide provides the rationale and best practices for handling text that needs to be displayed in multiple languages across our applications.

## Why Bilingual Support Matters

Our products are used by diverse audiences, and hardcoding text in a single language prevents us from serving a wider user base. By externalizing strings and managing them properly, we make our applications resilient to localization changes and easier for translators to work with.

## Guidelines for Managing Strings

### 1. Never Hardcode UI Text
Any text that is visible to the end-user (buttons, labels, error messages, tooltips) must never be hardcoded directly into the application logic or component templates.

### 2. Centralize and Key Your Strings
All user-facing strings must be extracted into centralized dictionary files (e.g., JSON, YAML, or specialized localization modules).
- Use clear, descriptive keys (e.g., `error.network.timeout` rather than just `timeout`).
- This separation of concerns means developers don't have to touch UI code to fix a typo or update a translation.

### 3. Context is Crucial
When adding new strings to a dictionary, always provide context if the word is ambiguous. For example, the English word "Book" could be a noun (a thing you read) or a verb (to reserve a room). Translators need to know the context to provide an accurate translation.

### 4. Ensure Fallbacks
Always configure your localization system to fall back gracefully. If a string is missing in French, it should fall back to the English default rather than displaying an empty space or an ugly translation key (like `{{header.title}}`) to the user.

## When is it "Done"?
A feature is complete when all its text is fully externalized, uses clear keys, and can be switched dynamically between our supported languages without breaking the UI layout.
