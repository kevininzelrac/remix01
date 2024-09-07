# Remix Monorepo

## VS Code Setup

Recommended settings:

```json
{
    "editor.tabSize": 2,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": "always"
    },
    "eslint.workingDirectories": [
        {"pattern": "./apps/*/"},
        {"pattern": "./packages/*/"}
    ],
    "eslint.useFlatConfig": true,
    "json.schemas": [
        {
            "fileMatch": [ "*tsconfig*.json" ],
            "url": "http://json.schemastore.org/tsconfig",
        }
    ],
}
```