



# Prisma Guide for Zephyr Share
- https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql
- Database Entity Diagram: https://prisma-erd.simonknott.de/

![Prisma Database Diagram](./diagrams/2024-04-04_prisma_diagram.svg "Prisma Database Diagram")



## Prisma Studio
Prisma Studio is a visual editor for your database. It allows you to view and edit the data in your database, and it also provides a way to view the Prisma schema and the Prisma Client API. (https://www.prisma.io/docs/orm/tools/prisma-studio)

```
npx prisma studio
```
NOTE, if you've changed your `schema.prisma` file, you may need to regenerate the Prisma Client and push the schema changes before running Prisma Studio:
```
npx prisma generate
npx prisma db push
```


## Common Prisma Commands
- Setup a new Prisma project: `npx prisma init`
  - creates a new directory called prisma that contains a file called schema.prisma, which contains the Prisma schema with your database connection variable and schema models
  - creates the .env file in the root directory of the project, which is used for defining environment variables (such as your database connection)
- Create a new Prisma migration (after changing `schema.prisma`): `npx prisma migrate dev --name <migration-name>`
- Only validate the local `schema.prisma` file: `npx prisma validate`
- Format and validate the local `schema.prisma` file: `npx prisma format`
- See whether the current local Prisma schema is in sync with the database schema: `npx prisma migrate diff --from- --to- ??`
- Regenerate the Prisma Client: `npx prisma generate`
- `npx prisma db push` 
- `npx prisma db pull`
- `npx prisma migrate status`


## Prisma Relational DB Concepts

### Many-to-Many Relationships
https://www.prisma.io/docs/orm/prisma-schema/data-model/relations/many-to-many-relations

"Many-to-many (m-n) relations refer to relations where zero or more records on one side of the relation can be connected to zero or more records on the other side."

"In relational databases, m-n-relations are typically modelled via relation tables. m-n-relations can be either explicit or implicit in the Prisma schema. *We recommend using implicit m-n-relations if you do not need to store any additional meta-data in the relation table itself.* You can always migrate to an explicit m-n-relation later if needed."

#### Implicit M-N-Relations (Recommended)


#### Explicit M-N-Relations (May be used to store additional metadata in the relation table)
In an explicit m-n relation, the relation table is represented as a model in the Prisma schema and can be used in queries. Explicit m-n relations define three models:
- Two models with m-n relation, such as Category and Post.
- One model that represents the relation table, such as CategoriesOnPosts (also sometimes called JOIN, link or pivot table) in the underlying database. The fields of a relation table model are both annotated relation fields (post and category) with a corresponding relation scalar field (postId and categoryId).

The relation table CategoriesOnPosts connects related Post and Category records. In this example, the model representing the relation table also defines additional fields that describe the Post/Category relationship - who assigned the category (assignedBy), and when the category was assigned (assignedAt):

```
model Post {
  id         Int                 @id @default(autoincrement())
  title      String
  categories CategoriesOnPosts[]
}

model Category {
  id    Int                 @id @default(autoincrement())
  name  String
  posts CategoriesOnPosts[]
}

model CategoriesOnPosts {
  post       Post     @relation(fields: [postId], references: [id])
  postId     Int // relation scalar field (used in the `@relation` attribute above)
  category   Category @relation(fields: [categoryId], references: [id])
  categoryId Int // relation scalar field (used in the `@relation` attribute above)
  assignedAt DateTime @default(now())
  assignedBy String

  @@id([postId, categoryId])
}
```


### One-to-Many Relationships


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
or
```sql
DELETE FROM "_prisma_migrations"
WHERE "id" = 'fd6c8bab-a613-44ae-b908-b65e3c41f228';
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



## Reset Prisma Schema Migrations after a particular migration
This can also be used to fix database drift.


