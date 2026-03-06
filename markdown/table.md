# Table System Documentation

Complete guide for the advanced data table system used in this e-commerce platform. This documentation covers all components, features, implementation details, and API integration patterns for the category management and other admin features.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Dependencies](#core-dependencies)
4. [Core Components](#core-components)
5. [Columns System](#columns-system)
6. [Filtering System](#filtering-system)
7. [Pagination](#pagination)
8. [Bulk Actions](#bulk-actions)
9. [How-To Guides](#how-to-guides)
10. [Files Structure](#files-structure)
11. [Files Using Table System](#files-using-table-system)

---

## Overview

The table system is a comprehensive, production-ready data table solution built with:
- **React Table (TanStack)** v8.21.3 - Core table logic and state management
- **Radix UI** - Accessible UI components
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

### Key Features

- Server-side pagination support
- Multi-column sorting
- Advanced filtering with faceted search
- Bulk actions with confirmation dialogs
- Column visibility toggles
- Row selection with checkboxes
- URL-based state synchronization
- Type-safe column definitions
- Responsive design
- Empty states and error handling
- Loading states with skeleton loaders

---

## Architecture

### Component Hierarchy

```
DataTable (Main Component)
├── DataTableProvider (Context)
├── DataTableToolbar
│   ├── Search Input
│   ├── DataTableFacetedFilter (Multiple)
│   ├── Reset Filters Button
│   ├── EnhancedDataTableSelectedActions
│   │   ├── Selection Count Badge
│   │   ├── Bulk Action Buttons
│   │   └── Clear Selection Button
│   └── DataTableViewOptions
│       └── Column Visibility Toggle
├── Table
│   ├── TableHeader (Sticky)
│   │   └── DataTableColumnHeader (Sortable)
│   ├── TableBody
│   │   ├── Row (each data row)
│   │   │   └── TableCell
│   │   └── Empty State Row
│   └── TableFooter
└── DataTablePagination
    ├── Page Size Selector
    └── Navigation Buttons
```

### State Management

The table uses React Context (`DataTableProvider`) to manage:
- Table instance from React Table
- Selected rows
- Column visibility state
- Filters and search
- Options for status, type, and deletion
- Bulk actions and handlers

**Key Context Values:**
```typescript
interface DataTableContextValue<TData> {
  table: Table<TData>                          // React Table instance
  displayKey: keyof TData                      // Key for display in UI
  selectedRows: TData[]                        // Currently selected row data
  hasSelectedRows: boolean                     // Quick check
  clearSelection: () => void                   // Deselect all rows
  
  typeOptions?: FacetOption[]                  // Options for type filter
  statusOptions?: FacetOption[]                // Options for status filter
  deletionOptions?: FacetOption[]              // Options for deletion filter
  
  filters?: Record<string, string | null>     // Current filter values
  setFilter?: (key: string, value: string | null) => void
  setSearch?: (q: string) => void
  clearFilters?: () => void
  
  bulkActions?: BulkAction<TData>[]
  runBulkAction?: (actionId: string) => void
  isBulkActionLoading?: boolean
  rowCount?: number                            // Total row count
}
```

---

## Core Dependencies

### External Packages

```json
{
  "@tanstack/react-table": "^8.21.3",      // Core table logic
  "@radix-ui/react-*": "^1.x.x",           // UI components
  "lucide-react": "^0.536.0",              // Icons
  "sonner": "^2.0.7",                      // Toast notifications
  "@trpc/client": "^11.x.x",               // tRPC client for API calls
  "@prisma/client": "^5.x.x",              // Prisma ORM types
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "typescript": "^5.9.2"
}
```

### Internal UI Components Used

```
@/shared/components/ui/
├── table (Table, TableHeader, TableBody, etc.)
├── button
├── input
├── checkbox
├── badge
├── card
├── separator
├── dropdown-menu
├── popover
├── command
├── select
├── tooltip
└── alert-dialog
```

### Utility Functions & Hooks

```
@/shared/utils/
├── lib/utils.ts (cn() - class merging)
├── lib/logger.utils.ts (debugLog, debugError)
├── lib/list-query.utils.ts (URL query parsing for API filters)
└── hooks/use-table-url-sync.ts (URL state sync)

@/core/trpc/
├── react.ts (useQuery, useMutation hooks)
└── server.ts (Server-side API calls)

@/shared/config/
├── api.config.ts (STATUS constants, API response handling)
└── options.config.ts (status, display type, visibility, color options)
```

---

## Core Components

### 1. DataTable (Main Component)

**File:** `src/shared/components/table/data-table.tsx`

**Purpose:** Main table component that orchestrates all sub-components and manages state.

**Props:**
```typescript
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]           // Column definitions
  data: TData[]                                 // Row data
  displayKey: keyof TData                       // Key for search/display
  
  // Optional filter options
  typeOptions?: FacetOption[]
  statusOptions?: FacetOption[]
  deletionOptions?: FacetOption[]
  
  // Bulk actions
  bulkActions?: BulkAction<TData>[]
  
  // Pagination
  pageCount?: number                            // Total pages
  rowCount?: number                             // Total rows
}

interface FacetOption {
  label: string
  value: string
  color: string
  icon?: ComponentType<{ className?: string }>
}
```

**Key Features:**
- Manages all table state (sorting, filters, pagination, selection)
- Provides context to child components
- Handles bulk actions with confirmation dialogs
- URL-synced state through `useTableUrlSync()` hook
- Manual pagination mode for server-side pagination

**Usage Example:**
```typescript
<DataTable
  data={items}
  columns={columns}
  displayKey="name"
  statusOptions={statusFilters}
  typeOptions={typeFilters}
  bulkActions={actions}
  pageCount={pageCount}
  rowCount={totalCount}
/>
```

---

### 2. DataTableProvider & Context

**File:** `src/shared/components/table/data-table-context.tsx`

**Purpose:** Provides table state and handlers to child components via React Context.

**Usage in Components:**
```typescript
import { useDataTableContext } from './data-table-context'

export function SomeTableComponent() {
  const {
    table,
    selectedRows,
    filters,
    setFilter,
    bulkActions,
  } = useDataTableContext<YourDataType>()
  
  return (/* component JSX */)
}
```

---

### 3. DataTableToolbar

**File:** `src/shared/components/table/data-table-toolbar.tsx`

**Purpose:** Renders search, filters, and bulk action buttons above the table.

**Components Used:**
- Search input for filtering by displayKey
- Multiple DataTableFacetedFilter instances
- Reset filters button
- EnhancedDataTableSelectedActions (bulk actions)
- DataTableViewOptions (column visibility)

**Key Logic:**
```typescript
const isFiltered = 
  table?.getState().columnFilters.length > 0 ||
  Object.values(filters ?? {}).some((v) => v !== null && v !== undefined)
```

---

### 4. DataTableColumnHeader

**File:** `src/shared/components/table/data-table-column-header.tsx`

**Purpose:** Header cell with sorting and visibility toggle dropdown.

**Features:**
- Clickable dropdown for sort options (ASC, DESC, HIDE)
- Visual indicators for current sort direction
- Only renders if column can be sorted

**Sort Icons:**
- `ArrowUp` - Ascending
- `ArrowDown` - Descending
- `ChevronsUpDown` - No sorting

---

### 5. DataTableFacetedFilter

**File:** `src/shared/components/table/data-table-faceted-filter.tsx`

**Purpose:** Advanced filter dropdown with checkboxes and facet counts.

**Props:**
```typescript
interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>  // React Table column
  title?: string                   // Filter label
  options: FacetOption[]          // Filter options
  value?: string | null           // Current value
  onSelect?: (value: string | null) => void  // Callback
}
```

**Features:**
- Popover-based UI
- Search/filter within options
- Visual count of available values
- Selected badge display
- Clear filter option

---

### 6. DataTableRowActions

**File:** `src/shared/components/table/data-table-row-actions.tsx`

**Purpose:** Dropdown menu for per-row actions (View, Edit, Delete).

**Props:**
```typescript
interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  isPending?: boolean
  onView?: (row: Row<TData>) => void
  onEdit?: (row: Row<TData>) => void
  onDelete?: (row: Row<TData>) => void
}
```

**Icons:**
- Eye - View
- Edit - Edit
- Trash - Delete (destructive styling)

---

### 7. DataTablePagination

**File:** `src/shared/components/table/data-table-pagination.tsx`

**Purpose:** Pagination controls and page size selector.

**Features:**
- Page size dropdown (10, 20, 30, 40, 50)
- First/Previous/Next/Last navigation buttons
- Current page display
- Selected row count

**Event Handlers:**
```typescript
const handlePageChange = (page: number) => {
  table.setPageIndex(page)
  setPagination(page + 1, table.getState().pagination.pageSize)
}

const handlePageSizeChange = (size: number) => {
  table.setPageSize(size)
  setPagination(1, size) // Reset to page 1
}
```

---

### 8. DataTableViewOptions

**File:** `src/shared/components/table/data-table-view-options.tsx`

**Purpose:** Settings dropdown for toggling column visibility.

**Features:**
- Dropdown with checkboxes for each column
- Only shows columns that can be hidden
- Toggles column visibility

---

### 9. EnhancedDataTableSelectedActions

**File:** `src/shared/components/table/data-table-selection-action.tsx`

**Purpose:** Displays selected row count and bulk action buttons when rows are selected.

**Components:**
1. **Selection Count Badge** - Shows count in popover with selected items list
2. **Action Buttons** - Icon buttons for each available bulk action
3. **Clear Selection Button** - Deselects all rows

**Only renders if:**
```typescript
if (!hasSelectedRows) return null
```

---

### 10. DataTableLoading

**File:** `src/shared/components/table/data-table-loading.tsx`

**Purpose:** Skeleton loader displayed while loading table data.

**Features:**
- Skeleton shimmer effects
- Mimics table structure
- Header, 5 rows, pagination

---

### 11. DataTableError

**File:** `src/shared/components/table/data-table-error.tsx`

**Purpose:** Error state display with retry button.

**Props:**
```typescript
interface DataTableErrorProps {
  error?: Error | string
  onRetry?: () => void
  title?: string
  description?: string
}
```

---

## Columns System

### Overview

Columns are defined using TanStack React Table's `ColumnDef` type. The application provides a set of pre-built, reusable column builders in `data-table-columns.tsx`.

### Column Definition Structure

```typescript
interface ColumnDef<TData, TValue> {
  id?: string                                      // Unique column ID
  accessorKey?: keyof TData | (row: TData) => any  // Data accessor
  header?: string | (context) => ReactNode        // Header content
  cell?: (context) => ReactNode                    // Cell renderer
  footer?: (context) => ReactNode                  // Footer content
  
  // Sorting
  enableSorting?: boolean                          // Can sort
  enableMultiSort?: boolean                        // Multi-sort support
  sortingFn?: SortingFn<TData>                    // Custom sort function
  
  // Filtering
  enableColumnFilter?: boolean                     // Can filter
  filterFn?: FilterFn<TData>                      // Custom filter
  enableHiding?: boolean                           // Can toggle visibility
}
```

### File: `data-table-columns.tsx`

**Common Column Builders (Exported as `commonColumns`):**

#### 1. Select Column
```typescript
commonColumns.selectColumn<CategoryBase>()
```
- Checkbox for row selection
- Header checkbox for select/deselect all
- Not sortable or hideable

#### 2. ID Column
```typescript
commonColumns.idColumn<CategoryBase>()
```
- Displays unique ID
- Width: 200px
- Truncated

#### 3. Title Column
```typescript
commonColumns.titleColumn<CategoryBase>()
```
- Displays title field
- Width: 200px
- Truncated

#### 4. Name Column
```typescript
commonColumns.nameColumn<CategoryBase>()
```
- Displays name field
- Width: 220px
- Simple text

#### 5. Email Column
```typescript
commonColumns.emailColumn<CategoryBase>()
```
- Displays email with Mail icon
- Width: 220px
- Truncated with tooltip fallback

#### 6. Description Column
```typescript
commonColumns.descriptionColumn<CategoryBase>()
```
- Displays description with fallback "No description found"
- Width: 260px
- Truncated

#### 7. Status Column
```typescript
commonColumns.statusColumn<CategoryBase>()
```
- Displays status as badge with icon
- Filterable
- Custom filter function for array values
- Uses `statusOptions` from props

**Filter Logic:**
```typescript
filterFn: (row, id, value) => {
  const rowValue = row.getValue(id) ?? ''
  return (value as string[]).includes(rowValue as string)
}
```

#### 8. Visibility Column
```typescript
commonColumns.visibilityColumn<CategoryBase>()
```
- Displays visibility status as badge
- Filterable like status column
- Uses visibility options

#### 9. Display Type Column
```typescript
commonColumns.displayTypeColumn<CategoryBase>()
```
- Shows display type (Default, Featured, Latest)
- Filterable
- Icon and badge display

#### 10. Color Column
```typescript
commonColumns.colorColumn<CategoryBase>()
```
- Shows color square with color name
- Uses `colorClass` mapping for Tailwind classes
- Fallback dash if no color

**Color Class Mapping:**
```typescript
const colorClass = {
  'bg-red-500': 'Red',
  'bg-blue-500': 'Blue',
  'bg-green-500': 'Green',
  // ... more colors
}
```

#### 11. Created At / Updated At / Deleted At Columns
```typescript
commonColumns.createdAtColumn<CategoryBase>()
commonColumns.updatedAtColumn<CategoryBase>()
commonColumns.deletedAtColumn<CategoryBase>()
```
- Displays date with Clock icon
- Formats date with `toLocaleDateString()`
- Badge display

#### 12. Image Column
```typescript
commonColumns.imageColumn<CategoryBase>()
```
- Displays image in Avatar component
- Falls back to `mediaUrl` if image not found
- Fallback ImageIcon if no image
- Size: h-12 w-auto

#### 13. Featured Column (Is Featured)
```typescript
commonColumns.isFeaturedColumn<CategoryBase>()
```
- Shows Star icon if featured
- Dash fallback if not featured
- Yellow star color

#### 14. Popularity Column
```typescript
commonColumns.popularityColumn<CategoryBase>()
```
- Shows colored square based on popularity value
- Uses backgroundColor for color value
- Dash fallback if no popularity

#### 15. Posts Count Column
```typescript
commonColumns.postsCountColumn<CategoryBase>()
```
- Displays post count as badge with prefix "Posts: "
- Integer value expected

#### 16. Slug Column (View Link)
```typescript
commonColumns.slugColumn<CategoryBase>(baseUrl)
```
- Creates clickable "View" link
- Takes base URL as parameter
- Links to `${url}/${slug}`
- Width: 120px

#### 17. Full Name Column
```typescript
commonColumns.fullNameColumn<CategoryBase>()
```
- Displays full name with bold font
- Width: 140px

#### 18. Actions Column
```typescript
commonColumns.actionsColumn<CategoryBase>({
  editRoute?: string
  deleteMutation?: { isPending: boolean }
  invalidateCache?: () => Promise<void>
  onView?: (row: Row<T>) => void
  onEdit?: (row: Row<T>) => void
  onDelete?: (row: Row<T>) => void
})
```
- Renders DataTableRowActions component
- Not sortable or hideable
- Takes callback handlers for View, Edit, Delete

### Building Custom Columns

**Example: Custom Email with Validation**
```typescript
function customEmailColumn<T>(): ColumnDef<T>[] {
  return [
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Email Address"
        />
      ),
      cell: ({ row }) => {
        const email = String(row.getValue('email'))
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        
        return (
          <div className={!isValid ? 'text-red-500' : ''}>
            {email}
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
  ]
}
```

### Column Keys Reference

```typescript
const keys = {
  ID: 'id',
  SLUG: 'slug',
  SELECT: 'select',
  ACTIONS: 'actions',
  VISIBILITY: 'visibility',
  POSTS_COUNT: 'postsCount',
  STATUS: 'status',
  DESCRIPTION: 'description',
  CREATED_AT: 'createdAt',
  FULL_NAME: 'fullName',
  DELETED_AT: 'deletedAt',
  EMAIL: 'email',
  NAME: 'name',
  IMAGE: 'image',
  DISPLAY_TYPE: 'displayType',
  UPDATED_AT: 'updatedAt',
  TITLE: 'title',
  COLOR: 'color',
  IS_FEATURED: 'isFeatured',
  POPULARITY: 'popularity',
}
```

---

## Filtering System

### Overview

The filtering system supports:
1. **Search Filtering** - By `displayKey` field via text input
2. **Faceted Filtering** - Multiple predefined options with checkboxes
3. **URL-based State** - Filters persist in URL query parameters

### Filter Configuration

**File:** `src/shared/components/table/data-table-filter.config.ts`

Defines reusable filter options for consistent filtering across tables:

```typescript
interface FilterType {
  value: string
  label: string
  icon: LucideIcon
  color: string
}

const filters = {
  status: [
    { value: 'draft', label: 'Draft', icon: Clock, color: 'text-yellow-500' },
    { value: 'in_review', label: 'In Review', icon: User, color: 'text-blue-500' },
    { value: 'scheduled', label: 'Scheduled', icon: ClockPlus, color: 'text-emerald-500' },
    { value: 'published', label: 'Published', icon: Target, color: 'text-primary' },
    { value: 'archive', label: 'Archived', icon: UserX, color: 'text-muted-foreground' },
  ],
  
  types: [
    { value: 'default', label: 'Default', icon: User, color: '' },
    { value: 'featured', label: 'Featured', icon: Target, color: '' },
    { value: 'latest', label: 'Latest', icon: Flame, color: '' },
  ],
  
  deletionStatus: [
    { value: 'false', label: 'Active', icon: Target, color: 'text-primary' },
    { value: 'true', label: 'Trash', icon: UserX, color: 'text-destructive' },
  ],
}
```

**Usage in Table:**
```typescript
import { filters } from '@/shared/components/table/data-table-filter.config'

<DataTable
  statusOptions={filters.status}
  typeOptions={filters.types}
  deletionOptions={filters.deletionStatus}
/>
```

### How Filtering Works

#### 1. Search Filter
```typescript
// In DataTableToolbar
const column = table.getColumn(displayKey as string)

<Input
  value={filters?.q ?? (column.getFilterValue() as string) ?? ''}
  onChange={(event) => {
    column.setFilterValue(event.target.value)
    setSearch?.(event.target.value)
  }}
/>
```

- Automatically filters rows where `displayKey` value includes search text
- Updates URL with `?q=searchterm`

#### 2. Faceted Filter
```typescript
// In DataTableToolbar
<DataTableFacetedFilter
  title="Status"
  options={statusOptions}
  value={filters?.status}
  onSelect={(val) => setFilter?.('status', val)}
/>
```

- Creates checkbox-based filter dropdown
- Displays count of available values for each option
- Updates URL with `?status=value`

#### 3. Filter Logic
```typescript
filterFn: (row, id, value) => {
  const rowValue = row.getValue(id) ?? ''
  return (value as string[]).includes(rowValue as string)
}
```

- Checks if row's field value is in selected filter values
- Works as "OR" logic within a filter (multiple selections)

### URL State Synchronization

**Hook:** `useTableUrlSync()` in `src/shared/utils/hooks/use-table-url-sync.ts`

**How it works:**
1. Table filters, sorting, and pagination are synced to URL query parameters
2. URL changes trigger server-side re-fetch via `searchParams` prop
3. URL state is decoded and used to request filtered API data

#### Available URL Parameters:
```
?q=search              // Search query (displayKey field)
?status=draft          // Status filter
?displayType=featured  // Display type filter
?visibility=public     // Visibility filter
?color=red            // Color filter
?page=1               // Current page (1-indexed)
?limit=20             // Page size
```

#### How Pagination & Filtering Works Together:

```typescript
// 1. User changes filter or pagination in client component
// 2. DataTable updates URL via useTableUrlSync
// 3. URL change detected by Next.js (Next.js App Router)
// 4. Page component receives new searchParams
// 5. Server re-fetches data with new filters

// URL -> searchParams -> getListQueryFromSearchParams -> API call
const listQuery = getListQueryFromSearchParams(searchParams)
// Returns: { filters: {...}, pagination: {...}, search: {...}, sort: {...} }

const { data } = await api.category.getMany(listQuery)
```

#### Clearing Filters

When user clicks "Reset" button in toolbar:
```typescript
// In DataTableToolbar
{isFiltered && (
  <Button
    onClick={() => {
      table?.resetColumnFilters()
      clearFilters?.()  // Removes all filter params from URL
    }}
  >
    Reset
  </Button>
)}

// This removes: status, displayType, visibility, color, q, page
// And resets table to first page with no filters
```

**Reset Button in Toolbar:**
```typescript
{isFiltered && (
  <Button
    variant="ghost"
    onClick={() => {
      table?.resetColumnFilters()
      clearFilters?.()
    }}
  >
    Reset <X />
  </Button>
)}
```

---

## Pagination

### Overview

The table implements **manual server-side pagination** with URL-based state.

### Features

- Page size selector (10, 20, 30, 40, 50 items)
- First/Previous/Next/Last navigation
- Current page display
- Selected row count display

### Configuration

**In DataTable component:**
```typescript
const pagination = useMemo(
  () => ({
    pageIndex: Math.max(0, parseInt(searchParams.get('page') ?? '1') - 1),
    pageSize: parseInt(searchParams.get('limit') ?? '20'),
  }),
  [searchParams],
)

const table = useReactTable({
  // ... other config
  pageCount: pageCount ?? -1,
  manualPagination: true,  // Server-side pagination
  state: {
    pagination,
  },
})
```

### Pagination Handlers

```typescript
const handlePageChange = (page: number) => {
  table.setPageIndex(page)
  setPagination(page + 1, table.getState().pagination.pageSize)
}

const handlePageSizeChange = (size: number) => {
  table.setPageSize(size)
  setPagination(1, size) // Reset to page 1
}
```

**URL Updates:**
- Page changes: `?page=1&limit=20`
- Size changes: Reset to `?page=1&limit=30`

### Calculating Page Count

When passing `pageCount` prop, calculate as:
```typescript
pageCount={Math.ceil((data?.pageTotalCount ?? 0) / (data?.pageLimit ?? 20))}
```

---

## Bulk Actions

### Overview

Bulk actions allow performing operations on multiple selected rows with optional confirmation dialogs.

### File: `src/shared/components/table/custom-action/bulk-operations.factory.ts`

### BulkAction Interface

```typescript
export interface BulkAction<TData> {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  
  requiresConfirmation?: boolean
  confirmationMessage?: (selectedRows: TData[]) => string
  disabledCondition?: (selectedRows: TData[]) => boolean
  
  run: (selectedRows: TData[]) => Promise<unknown> | unknown
  successMessage?: (selectedRows: TData[]) => string
}
```

### Properties Explained

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `id` | string | Yes | Unique action identifier |
| `label` | string | Yes | Display name for the action |
| `icon` | Component | No | Lucide icon to display |
| `variant` | string | No | Button variant (default: 'default') |
| `requiresConfirmation` | boolean | No | Show confirmation dialog (default: false) |
| `confirmationMessage` | function | No | Custom confirmation message |
| `disabledCondition` | function | No | Disable action based on selected rows |
| `run` | function | Yes | Async function to execute |
| `successMessage` | function | No | Custom success toast message |

### Example: Category Bulk Actions

```typescript
const bulkActions: BulkAction<CategoryBase>[] = [
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    variant: 'destructive',
    requiresConfirmation: true,
    confirmationMessage: (rows) =>
      `Delete ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}?`,
    run: async (rows) => {
      await Promise.all(
        rows.map((r) => deleteApi.mutateAsync({ where: { slug: r.slug }, hard: false }))
      )
      await utils.invalidateQueries()
      router.refresh()
    },
    successMessage: (rows) =>
      `Deleted ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}`,
  },
  
  {
    id: 'publish',
    label: 'Publish',
    icon: Eye,
    variant: 'default',
    requiresConfirmation: true,
    disabledCondition: (rows) => rows.some((r) => r.status === Status.PUBLISHED),
    confirmationMessage: (rows) =>
      `Publish ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}?`,
    run: async (rows) => {
      await Promise.all(
        rows.map((r) =>
          updateApi.mutateAsync({
            where: { slug: r.slug },
            data: { status: Status.PUBLISHED },
          })
        )
      )
      await utils.invalidateQueries()
      router.refresh()
    },
  },
]
```

### useBulkActions Hook

```typescript
export function useBulkActions<TData>({
  actions,
  onSuccess,
}: {
  actions: BulkAction<TData>[]
  onSuccess?: (action: BulkAction<TData>, selectedRows: TData[]) => void
}) {
  const [isBulkActionLoading, setIsBulkActionLoading] = useState(false)

  const runBulkAction = useCallback(
    async (actionId: string, selectedRows: TData[]) => {
      const action = actions.find((a) => a.id === actionId)
      if (!action) return

      if (action.disabledCondition?.(selectedRows)) {
        toast.warning('This action cannot be performed on the selected items')
        return
      }

      setIsBulkActionLoading(true)
      try {
        await action.run(selectedRows)
        toast.success(
          action.successMessage?.(selectedRows) ??
            `Successfully ${action.label.toLowerCase()} ${selectedRows.length} item(s)`,
        )
        onSuccess?.(action, selectedRows)
      } catch (error) {
        toast.error(`Failed to ${action.label.toLowerCase()} items`)
      } finally {
        setIsBulkActionLoading(false)
      }
    },
    [actions, onSuccess],
  )

  return { isBulkActionLoading, runBulkAction }
}
```

### Confirmation Dialog

When `requiresConfirmation` is true, an `AlertDialog` appears:

```typescript
<AlertDialog open={!!confirmationData} onOpenChange={(open) => !open && setConfirmationData(null)}>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        {confirmationData?.variant === 'destructive' ? '⚠️ ' : ''}
        {confirmationData?.actionLabel}
      </AlertDialogTitle>
      <AlertDialogDescription>{confirmationData?.message}</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={() => bulk.runBulkAction(confirmationData.actionId, confirmationData.rows)}>
        {confirmationData?.actionLabel}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## How-To Guides

### 1. Create a New Table (Category Example)

**Step 1: Create Columns Hook**
```typescript
// src/modules/category/components/category.columns.tsx
'use client'

import { commonColumns } from '@/shared/components/table/data-table-columns'
import type { CategoryBase } from '../dto/category.dto'
import { useMemo } from 'react'
import { api } from '@/core/trpc/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { STATUS } from '@/shared/config/api.config'

export function useCategoryColumns() {
  const router = useRouter()
  const utils = api.useUtils()

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: ({ status, message }) => {
      if (status === STATUS.SUCCESS) {
        toast.success(message)
        utils.category.getMany.invalidate()
      } else {
        toast.error(message)
      }
    },
  })

  return useMemo(() => [
    ...commonColumns.selectColumn<CategoryBase>(),
    ...commonColumns.nameColumn<CategoryBase>(),
    ...commonColumns.slugColumn<CategoryBase>('/category'),
    ...commonColumns.descriptionColumn<CategoryBase>(),
    ...commonColumns.displayTypeColumn<CategoryBase>(),
    ...commonColumns.statusColumn<CategoryBase>(),
    ...commonColumns.createdAtColumn<CategoryBase>(),
    ...commonColumns.actionsColumn<CategoryBase>({
      onEdit: (row) => {
        router.push(`/studio/categories/${row.getValue('slug')}`)
      },
      onDelete: (row) => {
        deleteCategory.mutate({
          where: { slug: row.getValue('slug') },
          hard: false,
        })
      },
    }),
  ], [deleteCategory, router])
}
```

**Step 2: Create Bulk Actions Hook**
```typescript
// src/modules/category/components/category.bulk-actions.ts
'use client'

import { Trash2, Eye, FileText, Archive } from 'lucide-react'
import { Status } from '@prisma/client'
import type { CategoryBase } from '../dto/category.dto'
import { api } from '@/core/trpc/react'
import type { BulkAction } from '@/shared/components/table/custom-action/bulk-operations.factory'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function useCategoryBulkActions(): BulkAction<CategoryBase>[] {
  const utils = api.useUtils()
  const router = useRouter()

  const update = api.category.update.useMutation()
  const del = api.category.delete.useMutation()

  return [
    {
      id: 'publish',
      label: 'Publish',
      icon: Eye,
      variant: 'default',
      requiresConfirmation: true,
      confirmationMessage: (rows) =>
        `Publish ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}?`,
      disabledCondition: (rows) => rows.some((r) => r.status === Status.PUBLISHED),
      run: async (rows) => {
        await Promise.all(
          rows.map((r) =>
            update.mutateAsync({
              where: { slug: r.slug },
              data: { status: Status.PUBLISHED },
            })
          )
        )
        await utils.category.getMany.invalidate()
        router.refresh()
        toast.success(`Published ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}`)
      },
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      variant: 'destructive',
      requiresConfirmation: true,
      confirmationMessage: (rows) =>
        `Delete ${rows.length} categor${rows.length !== 1 ? 'ies' : 'y'}?`,
      run: async (rows) => {
        await Promise.all(
          rows.map((r) => del.mutateAsync({ where: { slug: r.slug }, hard: false }))
        )
        await utils.category.getMany.invalidate()
        router.refresh()
      },
    },
  ]
}
```

**Step 3: Use in Table Component**
```typescript
// src/modules/category/components/category.table.tsx
'use client'

import { DataTable } from '@/shared/components/table/data-table'
import { filters } from '@/shared/components/table/data-table-filter.config'
import type { CategoryGetManyOutput } from '../dto/category.dto'
import { useCategoryColumns } from './category.columns'
import { useCategoryBulkActions } from './category.bulk-actions'

export default function CategoryTable({
  data,
}: {
  data: CategoryGetManyOutput['data']
}) {
  const columns = useCategoryColumns()
  const bulkActions = useCategoryBulkActions()

  return (
    <DataTable
      data={data?.items ?? []}
      columns={columns}
      displayKey="name"
      statusOptions={filters.status}
      typeOptions={filters.types}
      bulkActions={bulkActions}
      pageCount={Math.ceil((data?.pageTotalCount ?? 0) / (data?.pageLimit ?? 20))}
      rowCount={data?.pageTotalCount}
    />
  )
}
```

**Step 4: Use in Server Page Component**
```typescript
// src/app/studio/categories/page.tsx
import { api } from '@/core/trpc/server'
import { getListQueryFromSearchParams } from '@/shared/utils/lib/list-query.utils'
import CategoryTable from '@/modules/category/components/category.table'
import Shell from '@/shared/components/layout/shell'

export default async function CategoriesPage({ searchParams }: PageProps) {
  const input = await searchParams
  const listQuery = getListQueryFromSearchParams(input)

  const { data } = await api.category.getMany({
    filters: listQuery.filters,
    pagination: listQuery.pagination,
    search: listQuery.search,
    sort: listQuery.sort,
  })

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <h1>Categories</h1>
        <CategoryTable data={data} />
      </Shell.Section>
    </Shell>
  )
}
```

---

### 2. Add Custom Sorting

```typescript
// In column definition
{
  accessorKey: 'price',
  header: ({ column }) => (
    <DataTableColumnHeader column={column} title="Price" />
  ),
  cell: ({ row }) => {
    const price = row.getValue('price') as number
    return `$${price.toFixed(2)}`
  },
  sortingFn: (rowA, rowB) => {
    const priceA = rowA.getValue('price') as number
    const priceB = rowB.getValue('price') as number
    return priceA - priceB
  },
}
```

---

### 3. Add Custom Filtering

```typescript
// In column definition
{
  accessorKey: 'email',
  filterFn: (row, id, value) => {
    const email = String(row.getValue(id))
    // Multiple email domain filtering
    return (value as string[]).some((domain) => email.endsWith(domain))
  },
}
```

---

### 4. Add Row Styling

```typescript
// In DataTable, modify TableRow
<TableRow
  data-state={row.getIsSelected() && 'selected'}
  className={cn(
    row.original.status === 'archived' && 'opacity-50 line-through'
  )}
>
  {/* cells */}
</TableRow>
```

---

### 5. Handle Row Click

```typescript
// In DataTable component
{table.getRowModel().rows.map((row) => (
  <TableRow
    key={row.id}
    data-state={row.getIsSelected() && 'selected'}
    className="cursor-pointer hover:bg-muted"
    onClick={() => {
      // Handle row click
      onRowClick?.(row.original)
    }}
  >
    {/* cells */}
  </TableRow>
))}
```

---

### 6. Dynamically Show/Hide Filters

```typescript
<DataTable
  statusOptions={showStatusFilter ? statusFilters : undefined}
  typeOptions={showTypeFilter ? typeFilters : undefined}
  // ...
/>
```

---

### 7. Custom Empty State

```typescript
// In table usage component
if (data?.items.length === 0) {
  return (
    <EmptyState
      title="No Data"
      description="Create your first item"
      action={{ label: 'Create', url: '/create' }}
    />
  )
}

return <DataTable {...props} />
```

---

### 8. Disable Bulk Actions Conditionally

```typescript
// In bulk actions
disabledCondition: (rows) => {
  return rows.some((r) => r.status === 'locked')
}
```

When disabled, the action button is grayed out and shows a warning toast if clicked.

---

### 9. Reset Pagination After Filter

**Already handled in `useTableUrlSync`:**
```typescript
// When filters change (not page), page resets to 1
if (!params.page && !Object.keys(params).every((k) => k === 'page' || k === 'limit')) {
  current.delete('page')
}
```

---

### 10. API Integration with tRPC

The system integrates with tRPC for type-safe API calls and server-side pagination. All filtering, sorting, and pagination happens on the server, not the client.

**Data Flow:**
1. User interacts with table (filter, search, paginate, sort)
2. URL is updated via `useTableUrlSync()`
3. Server receives new `searchParams`
4. `getListQueryFromSearchParams()` converts URL to API input
5. tRPC server procedure queries database with filters
6. Results sent back and rendered in table

**API Call Pattern (in page.tsx - Server Component):**
```typescript
import { api } from '@/core/trpc/server'
import { getListQueryFromSearchParams } from '@/shared/utils/lib/list-query.utils'

export default async function CategoriesPage({ searchParams }: PageProps) {
  const input = await searchParams
  const listQuery = getListQueryFromSearchParams(input)

  // Server-side API call with filters, pagination, search, sort
  const { data } = await api.category.getMany({
    filters: listQuery.filters,      // status, displayType, etc.
    pagination: listQuery.pagination, // page, limit
    search: listQuery.search,        // q (search term)
    sort: listQuery.sort,           // sortBy, sortOrder
  })

  return <CategoryTable data={data} />
}
```

**URL to API Input Conversion Example:**
```typescript
// URL: ?q=electronics&status=published&page=2&limit=20
// Converted to:
{
  search: { q: 'electronics' },
  filters: { status: 'published' },
  pagination: { page: 2, limit: 20 },
  sort: { sortBy: 'createdAt', sortOrder: 'desc' }
}
```

**Server Response Structure:**
```typescript
interface CategoryGetManyOutput {
  data: {
    items: CategoryBase[]      // Paginated items
    pageTotalCount: number     // Total records matching filters
    pageCount: number          // Total pages
    pageLimit: number          // Items per page
    page: number               // Current page
  }
}
```

**tRPC Mutation Pattern (Bulk Actions - Client Component):**
```typescript
// In client component (category.bulk-actions.ts)
const update = api.category.update.useMutation()
const del = api.category.delete.useMutation()

// Usage in bulk action:
run: async (rows) => {
  await Promise.all(
    rows.map((r) =>
      update.mutateAsync({
        where: { slug: r.slug },
        data: { status: Status.PUBLISHED },
      })
    )
  )
  // Invalidate and re-fetch
  await utils.category.getMany.invalidate()
  router.refresh()  // Triggers server re-render with new data
}
```

---

## Files Structure

### Table System Files (Ready in Your Project)

```
src/shared/components/table/
├── data-table.tsx                              # Main table component
├── data-table-columns.tsx                      # Column builders (commonColumns)
├── data-table-column-header.tsx                # Sortable column header
├── data-table-toolbar.tsx                      # Search + filters toolbar
├── data-table-pagination.tsx                   # Pagination controls
├── data-table-context.tsx                      # React Context provider
├── data-table-faceted-filter.tsx               # Advanced filter dropdown
├── data-table-row-actions.tsx                  # Row action menu (View/Edit/Delete)
├── data-table-view-options.tsx                 # Column visibility toggle
├── data-table-selection-action.tsx             # Bulk action buttons
├── data-table-loading.tsx                      # Skeleton loading state
├── data-table-error.tsx                        # Error display
├── data-table-filter.config.ts                 # Filter options config
└── custom-action/
    └── bulk-operations.factory.ts              # Bulk action logic
```

### Utility Files

```
src/shared/utils/
├── hooks/
│   └── use-table-url-sync.ts                   # URL state synchronization (in your project)
├── lib/
│   ├── utils.ts                                # cn() utility
│   ├── logger.utils.ts                         # Debug utilities
│   └── list-query.utils.ts                     # Convert URL params to API input
└── stable-id.ts                                # Unique ID generation for keys

src/shared/config/
├── api.config.ts                               # STATUS constants
└── options.config.ts                           # Filter options (your project)

src/core/trpc/
├── react.ts                                    # Client hooks (useQuery, useMutation)
└── server.ts                                   # Server-side API calls
```

### UI Component Dependencies

```
src/shared/components/ui/
├── table.tsx                                   # Base table elements
├── button.tsx
├── input.tsx
├── checkbox.tsx
├── badge.tsx
├── dropdown-menu.tsx
├── popover.tsx
├── command.tsx
├── tooltip.tsx
└── alert-dialog.tsx
```

---

## Files Using Table System

### Direct Usage

#### 1. Category Table
**File:** `src/modules/category/components/category.table.tsx`
- Uses: DataTable, commonColumns
- Features: Status filter, Display Type filter
- Bulk Actions: Delete, Publish, Draft, Archive, Make Public/Private
- API Integration: Uses `api.category.delete` and `api.category.update` mutations

**Columns:**
- Select, Name, Slug (View link), Description
- Display Type, Status, Color
- Created At, Updated At, Actions

**Related Files:**
- `category.columns.tsx` - Column definitions using commonColumns builder
- `category.bulk-actions.ts` - Bulk action definitions
- `category.config.ts` - Route and field configuration

### Integration Points

#### Data Fetching (Server-Side)
```typescript
// /app/studio/categories/page.tsx
import { api } from '@/core/trpc/server'
import { getListQueryFromSearchParams } from '@/shared/utils/lib/list-query.utils'

export default async function CategoriesPage({ searchParams }: PageProps) {
  const input = await searchParams
  const listQuery = getListQueryFromSearchParams(input)
  
  const { data } = await api.category.getMany({
    filters: listQuery.filters,
    pagination: listQuery.pagination,
    search: listQuery.search,
    sort: listQuery.sort,
  })

  return (
    <Shell>
      <Shell.Section variant="dashboard">
        <DashboardSection title="Categories" description="Manage your blog categories">
          <CategoryTable data={data} />
        </DashboardSection>
      </Shell.Section>
    </Shell>
  )
}
```

#### Page Component Structure
```typescript
// Page receives server-fetched data
// The CategoryTable is a 'use client' component that accepts data
// URL parameters control filtering and pagination
// All state changes (filters, sorting, pagination) update URL params
// URL changes trigger server re-fetch with new searchParams
```

### Configuration Files Used

#### Options Config
**File:** `src/shared/config/options.config.ts`

**Enums & Options:**
```typescript
enum Status { DRAFT, ARCHIVE, LIVE }
enum DisplayType { GRID, CAROUSEL, BANNER, LIST, FEATURED }
enum Visibility { PUBLIC, PRIVATE, HIDDEN }
enum Color { RED, ORANGE, YELLOW, GREEN, BLUE, PURPLE, PINK }

// Usage in DataTable:
import { filters } from '@/shared/components/table/data-table-filter.config'

<DataTable
  statusOptions={filters.status}
  typeOptions={filters.types}
  deletionOptions={filters.deletionStatus}
/>
```

**Available Options:**
- `statusOptions[]` - Status filter choices (Draft, Archive, Live)
- `displayTypeOptions[]` - Display Type filter choices
- `visibilityOptions[]` - Visibility filter choices
- `colorOptions[]` - Color filter choices
- `colorClass` - Tailwind CSS class mappings for color display

#### API Config
**File:** `src/shared/config/api.config.ts`
- `STATUS.SUCCESS` - Successful API response
- `STATUS.ERROR` - Error response

---

## Advanced Topics

### URL State Management Deep Dive

The `useTableUrlSync` hook synchronizes table state with URL parameters:

```typescript
// Reading from URL
const currentFilters = useMemo(() => {
  const filters: Record<string, string | null> = {}
  const keys = ['status', 'visibility', 'displayType', 'color', 'contentType', 'deleted']
  keys.forEach((key) => {
    filters[key] = searchParams.get(key)
  })
  return filters
}, [searchParams])

// Writing to URL
const updateUrl = useCallback((params) => {
  const current = new URLSearchParams(Array.from(searchParams.entries()))
  
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      current.delete(key)
    } else {
      current.set(key, String(value))
    }
  })
  
  router.push(`${pathname}?${current.toString()}`, { scroll: false })
}, [pathname, router, searchParams])
```

### React Table Internals

The table uses these React Table features:

```typescript
useReactTable({
  data,
  columns,
  state: {
    sorting,           // Current sort state
    columnVisibility,  // Hidden/visible columns
    rowSelection,      // Selected rows
    columnFilters,     // Filter values
    pagination,        // Current page/size
  },
  pageCount: pageCount,
  manualPagination: true,  // Server-side pagination
  enableRowSelection: true,
  
  // Core functions
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFacetedRowModel: getFacetedRowModel(),
  getFacetedUniqueValues: getFacetedUniqueValues(),
})
```

**Key Methods on Table Instance:**
- `getHeaderGroups()` - Get header structure
- `getRowModel()` - Get visible rows
- `getSelectedRowModel()` - Get selected rows
- `getFilteredRowModel()` - Get filtered row count
- `getPageCount()` - Total pages
- `setPageIndex(n)` - Change page
- `setPageSize(n)` - Change page size
- `toggleAllRowsSelected()` - Select/deselect all
- `resetColumnFilters()` - Clear all filters

---

## Troubleshooting

### Table Not Updating After Action
**Issue:** Rows don't refresh after bulk action
**Solution:** Invalidate cache and refresh server in bulk action
```typescript
run: async (rows) => {
  await del.mutateAsync({ where: { slug: r.slug }, hard: false })
  await utils.category.getMany.invalidate()  // ← Invalidate tRPC cache
  router.refresh()                           // ← Re-fetch from server
}
```

### Filters Not Persisting
**Issue:** Filters clear on page reload
**Solution:** Verify that:
1. DataTable uses `useTableUrlSync()` hook (it should by default)
2. Page component receives `searchParams` and passes them to `getListQueryFromSearchParams()`
3. API is being called with the correct filters

### Pagination Reset on Filter Change
**Issue:** Page resets to 1 when changing filters
**Solution:** This is intentional behavior. When filters change, the page index resets to show results from page 1. If you want to keep the current page:
```typescript
// Modify useTableUrlSync to NOT delete 'page' when filters change
if (!params.page && /* remove this condition */) {
  current.delete('page')
}
```

### Data Not Loading from API
**Issue:** Table shows empty despite data in database
**Solutions:**
1. Verify `getListQueryFromSearchParams()` is converting URL correctly
2. Check tRPC server procedure is called with correct input
3. Ensure server component is using `api` from `@/core/trpc/server` not `react`
4. Check database query filters match URL parameters

### Bulk Actions Not Working
**Issue:** Bulk action mutation fails
**Solutions:**
1. Ensure using `api.category.update.useMutation()` in client component
2. Verify API endpoint exists and accepts the mutation input
3. Check error logs: `onError` handler should show error message
4. Ensure `utils.category.getMany.invalidate()` is awaited before `router.refresh()`

### Bulk Actions Not Showing
**Issue:** Action buttons don't appear
**Causes:**
1. No rows selected - component returns null
2. All actions disabled - check `disabledCondition`
3. No bulkActions passed to DataTable

### Column Header Flickering
**Issue:** Column headers flicker or reset
**Solution:** Ensure columns are memoized
```typescript
return useMemo(() => [...columns], [dependencies])
```

### Performance Issues with Large Tables
**Issue:** Table sluggish with 1000+ rows
**Solutions:**
1. Use server-side pagination (already implemented)
2. Memoize expensive renderers
3. Use `virtualization` if needed (not included by default)

---

## Setup Checklist

Before using the table system for categories or other modules, ensure these utilities are created:

### 1. Navigation Utility
**File:** `src/core/language/utils/navigation.ts`

This is a wrapper around Next.js navigation without locale handling:

```typescript
'use client'

import {
  useRouter as useNextRouter,
  usePathname as useNextPathname,
  useSearchParams as useNextSearchParams,
} from 'next/navigation'

// Re-export Next.js navigation without locale handling
export const useRouter = useNextRouter
export const usePathname = useNextPathname
export const useSearchParams = useNextSearchParams
export { useTransition, useOptimistic } from 'react'
```

### 2. List Query Utility
**File:** `src/shared/utils/lib/list-query.utils.ts`

Converts URL search params to API filter input:

```typescript
import type { PageProps } from '@/shared/types/global.types'

interface ListQuery {
  filters: Record<string, string | undefined>
  pagination: { page: number; limit: number }
  search: { q: string | undefined }
  sort: { sortBy?: string; sortOrder?: 'asc' | 'desc' }
}

export function getListQueryFromSearchParams(params: Record<string, string | string[] | undefined>): ListQuery {
  const q = Array.isArray(params.q) ? params.q[0] : params.q
  const page = parseInt(Array.isArray(params.page) ? params.page[0] : (params.page || '1'))
  const limit = parseInt(Array.isArray(params.limit) ? params.limit[0] : (params.limit || '20'))

  const filters: Record<string, string | undefined> = {}
  const filterKeys = ['status', 'displayType', 'visibility', 'color', 'deleted']
  
  filterKeys.forEach((key) => {
    const value = params[key]
    if (value) {
      filters[key] = Array.isArray(value) ? value[0] : value
    }
  })

  return {
    filters,
    pagination: { page: Math.max(1, page), limit: Math.max(1, limit) },
    search: { q },
    sort: { sortBy: 'createdAt', sortOrder: 'desc' },
  }
}
```

### 3. Category Utilities

Once the table system is integrated with category listing:

**Files to create:**
- `src/modules/category/components/category.columns.tsx`
- `src/modules/category/components/category.bulk-actions.ts`
- `src/modules/category/components/category.table.tsx`
- `src/modules/category/components/category.config.ts`

**See:** [Create a New Table (Category Example)](#1-create-a-new-table-category-example) section above for complete implementation.

---

## Summary

The table system provides a complete, production-ready solution for data management with:

- **14+ core components** for different table aspects
- **18+ pre-built column types** for common fields
- **Advanced filtering** with multiple filter types
- **Bulk operations** with confirmation dialogs
- **URL-based state** for shareable table states
- **Server-side pagination & filtering** via tRPC
- **Type safety** throughout with TypeScript
- **Accessibility** via Radix UI components
- **Responsive design** that works on mobile
- **Customizable** for extending with new features

All components are modular and can be adapted for your project. The system is designed to work without `next-intl`, using standard Next.js navigation and plain text strings for UI labels.

