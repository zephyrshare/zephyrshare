# 2024-04-24

Please design a Next.js user onboarding flow with 1 total step. Note, this step will be required.

First, A user will authenticate with NextAuth EmailProvider then be REQUIRED to go through the onboarding flow. However, the application should check if the user has a value defined for `dataOwnerId` or `dataCustomerId`, and if so, they should be finished with onboarding and the `hasOnboarded` boolean should be set to true.

Onboarding step 1:
User enters the name of his company in an input box. User check a toggle below the input box whether he is aware that "Company has a ZephyrShare account"

- Note, if the user checks this toggle, show text: "Please contact your ZephyrShare account admin for access" and the "Next" button will be disabled

If the user does not check the toggle, he will choose from a select component titled "My organization will be" with options "Purchasing data" and "Selling data"

Note, do not show the Sidebar or TopNavbar during onboarding.

Here is the User prisma model:

```
model User {
  id              String           @id @default(cuid())
  name            String?
  username        String?
  gh_username     String?
  email           String?          @unique
  emailVerified   DateTime?
  image           String?
  createdAt       DateTime?        @default(now())
  updatedAt       DateTime         @updatedAt
  role            String           @default("OWNER_ADMIN")
  organizationId  String?
  apiToken        String?          @unique
  hasOnboarded    Boolean          @default(false)
  accounts        Account[]
  marketDataFiles MarketDataFile[]
  sessions        Session[]
  dataOwnerId     String?
  dataOwner       DataOwner?       @relation(fields: [dataOwnerId], references: [id])
  dataCustomerId  String?
  dataCustomer    DataCustomer?    @relation(fields: [dataCustomerId], references: [id])
}
```
