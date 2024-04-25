# ZephyrShare

ZephyrShare is a financial market data sharing platform and AI-powered contract lifecycle management software that allows organizations to buy and sell financial market data.

## ZephyrShare Engineering Documentation

- [ZephyrShare UI Components Documentation](./components/COMPONENTS.md) - Shadcn/ui components and other components
- [ZephyrShare Auth Documentation](./lib/AUTH.md) - Authentication with NextAuth.js
- [ZephyrShare Prisma Documentation](./prisma/PRISMA.md) - Prisma ORM documentation
- [ZephyrShare Database Queries](./docs/QUERIES.md) - common database queries
- [ZephyrShare Playwright Documentation](./tests/PLAYWRIGHT.md) - Playwright testing documentation

## ZephyrShare Business Dictionary

- **"Market Data Source":** A specific "type" of market data that is provided by a Data Owner and can be purchased by a Data Customer. Market Data Sources are made up of 1 to many Market Data Files. For example, a Market Data Source could be "End of Day Contract Prices" for a futures exchange.
- **"Market Data File":** A specific file that contains market data. Market Data Files are associated with a Market Data Source. For example, a Market Data File could be "2021-01-01 End of Day Contract Prices".
- **"Data Owner":** The organization that provides market data to the platform. Data Owners can create Market Data Sources and Market Data Files.
- **"Data Customer":** The organization that purchases market data from the platform. Data Customers can purchase Market Data Files.
- **"Data Contract":** A buyer-seller agreement between a Data Owner and a Data Customer. A Data Contract is a unique combination of a Market Data Source + Data Owner + Data Customer that specifies cost, start date, end date, number of licenses as well as how the data may be used (may the customer publish it in charts? may the customer re-sell analysis with it?)
- **"Organization":** Can be a Data Owner, Data Customer, or both. Organizations can have multiple users.
