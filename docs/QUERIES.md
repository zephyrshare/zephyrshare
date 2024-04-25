## User Queries

Create a new test user

```
INSERT INTO "User" (
  id,
  name,
  username,
  email,
  role,
  "createdAt",
  "updatedAt"
) VALUES (
  'aoiefjoiwef',
  'Zonal Exchange',
  'zonalexchange',
  'test@zexchange.com',
  'OWNER_ADMIN', -- Assuming this is the default role you want to assign
  NOW(),
  NOW()
);
```

```
INSERT INTO "User" (
  id,
  name,
  username,
  email,
  role,
  "createdAt",
  "updatedAt"
) VALUES (
  'qweiojwqef',
  'DRW Trader',
  'drwtrader',
  'trader@drwholdings.com',
  'CUSTOMER_ADMIN', -- Assuming this is the default role you want to assign
  NOW(),
  NOW()
);
```

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
