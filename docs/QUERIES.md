

## User Queries

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

Add an organizationId
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


## Agreement Queries

Manually updated a table column to not nullable
```
ALTER TABLE "Agreement"
ALTER COLUMN "contentType" SET NOT NULL;
```

Add 'clswa063w00012dw3qdo4iomf' to the OrganizationId column for all rows
```
UPDATE "Agreement"
SET "organizationId" = 'clswa063w00012dw3qdo4iomf'
WHERE "organizationId" IS NULL;
```


## Organization Queries

```
SELECT * FROM "Organization";
```

Delete every organizations from Organization table
```
DELETE FROM "Organization";
```

