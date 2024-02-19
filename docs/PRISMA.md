



# Prisma
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql

## Common Prisma Commands
- Setup a new Prisma project: `npx prisma init`
  - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
  - creates the .env file in the root directory of the project, which is used for defining environment variables (such as your database connection)
- Create a new Prisma migration (after changing `schema.prisma`): `npx prisma migrate dev --name <migration-name>`
- `npx prisma db push` 
- `npx prisma migrate status`


## Reset all Prisma Schema Migrations (Baseline the database)
"Baselining refers to initializing your migration history for a database that might already contain data and *cannot be rese*t* (such as your production database). Baselining tells Prisma Migrate to assume that one or more migrations have already been applied to your database."
(https://www.prisma.io/docs/getting-started/setup-prisma/add-to-existing-project/relational-databases/baseline-your-database-typescript-postgresql)

The goal is to avoid "database drift" where the database schema and the Prisma schema are out of sync. This can happen when you have a database that already contains data and you want to start using Prisma Migrate to manage your database schema.

Steps:
1. Delete all migrations within the `migrations` folder

2. Truncate (delete all rows from) the `_prisma_migrations` table in the database
```sql
TRUNCATE TABLE "_prisma_migrations";
```

3. Add a directory inside prisma/migrations with your preferred name for the migration. In this example, we will use 0_init as the migration name:
```
mkdir -p prisma/migrations/0_init
```
(-p will recursively create any missing folders in the path you provide.)

4. Next, generate the migration file with prisma migrate diff. Use the following arguments:

`--from-empty`: assumes the data model you're migrating from is empty
`--to-schema-datamodel`: the current database state using the URL in the datasource block
`--script`: output a SQL script

```
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql
```

5. Review the newly created migration file in prisma/migrations/0_init/migration.sql to make sure everything is correct. It should contain the SQL statements to create the tables and columns in your database.


6. Next, mark the migration as applied using prisma migrate resolve with the --applied argument.
```sql
npx prisma migrate resolve --applied 0_init 
```
The command will mark 0_init as applied by adding it to the _prisma_migrations table.



## Reset or remove Prisma Schema Migrations after a particular migration




## Queries

```
UPDATE "User"
SET "role" = 'ZEPHYR_ADMIN'
WHERE "id" = 'cls0x2q3p0000ligvucr2fzmc';
```


```
UPDATE "User"
SET "role" = 'OWNER_ADMIN'
WHERE "id" = 'clsp3iya60000gymxtb36k0ud';
```


Delete all users from User table where role is null
```
DELETE FROM "User"
WHERE "role" IS NULL;
```