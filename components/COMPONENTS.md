


## Shadcn/ui Components

#### To add a new component
Ex, add a button component
```
npx shadcn-ui@latest add button
```

#### To change to theme between "default" and "new-york"
Edit the "style" prop within `components.json` to "new-york" or "default" then re-add the component

Ex, change the DataTable component to "new-york" theme
1. Update the `components.json` file
```json
{
  "style": "new-york"
}
```
1. Re-add the Table component
```
pnpm dlx shadcn-ui@latest add table
```
