# Remix Monorepo

## Runnig scripts

```sh
pnpm run -r --stream --color <script name>
```

## Creating a migration

```sh
# Autogenerate Prisma SQL migration
pnpm run --filter ./packages/db migrate create <migration_name>
# Create empty TS migration
pnpm run --filter ./packages/db migrate create try_this <migration_name> --type=ts
```

## Running migrations

```sh
# Apply migrations
pnpm run --filter ./packages/db migrate up
# Roll back migrations
pnpm run --filter ./packages/db migrate down
```

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