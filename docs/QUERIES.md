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

-- Add a DataOwner for zonalexchange
INSERT INTO "DataOwner" (
  id,
  name,
  description,
  logo,
  "createdAt",
  "emailDomain"
) VALUES (
  'new_dataowner_id', -- Provide a unique id
  'Zonal Exchange',
  'A leading provider of financial market data',
  'logo_url', -- Replace with actual logo URL if available
  NOW(),
  'zexchange.com'
);

-- Associate zonalexchange with this DataOwner
UPDATE "User"
SET "dataOwnerId" = 'new_dataowner_id'
WHERE username = 'zonalexchange';

-- Add a DataCustomer for drwtrader
INSERT INTO "DataCustomer" (
  id,
  name,
  description,
  logo,
  "createdAt",
  "emailDomain"
) VALUES (
  'new_datacustomer_id', -- Provide a unique id
  'DRW Holdings',
  'High-profile trading firm using diverse trading strategies',
  'logo_url', -- Replace with actual logo URL if available
  NOW(),
  'drwholdings.com'
);

-- Associate drwtrader with this DataCustomer
UPDATE "User"
SET "dataCustomerId" = 'new_datacustomer_id'
WHERE username = 'drwtrader';

-- Create a CustomerRelationship between the DataOwner and DataCustomer
INSERT INTO "CustomerRelationship" (
  id,
  "dataCustomerId",
  "dataOwnerId",
  "createdAt"
) VALUES (
  'new_relationship_id', -- Provide a unique id
  'new_datacustomer_id',
  'new_dataowner_id',
  NOW()
);
```
