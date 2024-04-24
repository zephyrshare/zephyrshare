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

## Organization Queries

```
SELECT * FROM "Organization";
```

Delete every organizations from Organization table

```
DELETE FROM "Organization";
```
