# variables
TYPEORM:=bun run node_modules/typeorm/cli.js
TYPEORM_MIGRATION_CONFIG_FILE:=src/database/_typeorm/data-source.ts
TYPEORM_SEED_CONFIG_FILE:=src/database/_typeorm/seed-data-source.ts
TYPEORM_MIGRATION_DIR:=src/database/_typeorm/migrations
TYPEORM_SEED_DIR:=src/database/_typeorm/seeders

# generate a new migration
migration\:generate:
	@if [ -z "$(name)" ]; then \
		echo "Error: Migration name is required. Use 'make migration:generate name=migration-name'"; \
		exit 1; \
	fi
	@mkdir -p $(TYPEORM_MIGRATION_DIR)
	@$(TYPEORM) migration:generate -p -d $(TYPEORM_MIGRATION_CONFIG_FILE) $(TYPEORM_MIGRATION_DIR)/$(name)
	@bunx prettier --log-level=error -w $(TYPEORM_MIGRATION_DIR)
	@bunx oxlint --fix --type-aware --report-unused-disable-directives $(TYPEORM_MIGRATION_DIR)

# create a new empty migration
migration\:create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Migration name is required. Use 'make migration:create name=migration-name'"; \
		exit 1; \
	fi
	@mkdir -p $(TYPEORM_MIGRATION_DIR)
	@$(TYPEORM) migration:create $(TYPEORM_MIGRATION_DIR)/$(name)
	@bunx prettier --log-level=error -w $(TYPEORM_MIGRATION_DIR)
	@bunx oxlint --fix --type-aware --report-unused-disable-directives $(TYPEORM_MIGRATION_DIR)

# apply all pending migrations
migration\:apply:
	@$(TYPEORM) migration:run -d $(TYPEORM_MIGRATION_CONFIG_FILE)

# revert the last migration
migration\:revert:
	@$(TYPEORM) migration:revert -d $(TYPEORM_MIGRATION_CONFIG_FILE)

# create database seed
seeder\:create:
	@if [ -z "$(name)" ]; then \
		echo "Error: Seed name is required. Use 'make seeder:create name=seed-name'"; \
		exit 1; \
	fi
	@mkdir -p $(TYPEORM_SEED_DIR)
	@$(TYPEORM) migration:create $(TYPEORM_SEED_DIR)/$(name)
	@bunx prettier --log-level=error -w $(TYPEORM_SEED_DIR)

# apply all pending database seed
seeder\:apply:
	@$(TYPEORM) migration:run -d $(TYPEORM_SEED_CONFIG_FILE)

# revert the last seed
seeder\:revert:
	@$(TYPEORM) migration:revert -d $(TYPEORM_SEED_CONFIG_FILE)

# run test suites
test:
	@DB_LOGS_ENABLED=false bun run tests/setup/test.global.setup.ts
	@bunx --bun vitest run

# run test suites and collect coverage
test\:coverage:
	@DB_LOGS_ENABLED=false bun run tests/setup/test.global.setup.ts
	@bunx --bun vitest run --coverage

# introspect types from database
db\:types\:generate:
	@bunx kysely-codegen
