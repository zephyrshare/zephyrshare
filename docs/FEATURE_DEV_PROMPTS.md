


## 2024-03-27
Please add the following to the project: I'd like for customers to be able to upload data files to ZephyrShare.
- On the app/(app)/datafiles/page.tsx please add a data table (similar to the one on the app/(app)/agreements/page.tsx)
- create the needed columns file (app/(app)/agreements/file-table-columns.tsx)
- On the app/(app)/datafiles/page.tsx please add an "Upload File" button (new component, components/upload-file-button.tsx) 
- Create a DataFile model in the `schema.prisma` (note that Data Files will belong to organizations. Also note the User who uploaded the Data File as uploaderId which will be a reference to the User id)
- Create a getDataFilesByOrganization in lib/actions.ts and use it to populate the table when the /datafiles route loads
- Also in lib/actions.ts create deleteDataFile and addDataFile actions

Please add anything else you think I may be missing to help complete this feature. As a note, PLEASE follow the "Development Guidelines for Our Next.js 14 React Application" set forth in docs/BASE_PROMPTS.md and try to rely on the existing style and software architecture of the codebase as much as possible when building this feature.