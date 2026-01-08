# Advanced Data Bindings System

## Overview

The Advanced Data Bindings System enables CardHelper to intelligently react to data changes. Fields can be conditionally shown/hidden, computed from other fields, calculated using formulas, joined with external data, and linked through dependency chains.

Think of bindings as **smart rules** that make your card templates dynamic and data-aware.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  React Component Layer                   │
│  DataBindingBuilder, ConditionalFields, ComputedFields  │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              React Hooks Layer                           │
│  useDataBindings, useBindingEvaluation,                 │
│  useConditionalFields, useComputedFields, etc.          │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│                  Express API Layer                       │
│  POST /create, /evaluate, /evaluate-all                 │
│  GET /card/:cardId, PUT /update, DELETE /delete         │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│          DataBindingsService Layer                       │
│  - Binding management (CRUD)                            │
│  - Formula evaluation engine                            │
│  - Conditional logic evaluation                         │
│  - Lookup operations                                    │
│  - Dependency resolution                                │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              MySQL Database Layer                        │
│  - data_bindings (binding definitions)                  │
│  - binding_evaluation_cache (caching layer)             │
│  - binding_audit_log (operation tracking)               │
└─────────────────────────────────────────────────────────┘
```

## Binding Types

### 1. **Conditional Bindings**
Show/hide fields based on conditions.

```javascript
{
  id: "condition_1",
  fieldId: "status_field",
  type: "conditional",
  sourceField: "order_type",
  condition: {
    operator: "equals",
    value: "express"
  }
}
```

**Supported Operators:**
- `equals` - Exact match
- `notEquals` - Not equal
- `greaterThan` - Greater than (numeric)
- `lessThan` - Less than (numeric)
- `contains` - String contains
- `startsWith` - String starts with
- `in` - Value in list
- `isEmpty` - Field is empty
- `isNotEmpty` - Field has value

**Example Use Case:** Show expedited shipping fields only when order_type = "express"

### 2. **Computed Bindings**
Transform field values using built-in functions.

```javascript
{
  id: "computed_1",
  fieldId: "full_name",
  type: "computed",
  sourceField: "first_name",
  metadata: {
    computationType: "uppercase"
  }
}
```

**Available Transformations:**
- `uppercase` - Convert to uppercase
- `lowercase` - Convert to lowercase
- `titlecase` - Title case (First Letter Capitalized)
- `length` - String length
- `reverse` - Reverse string
- `trim` - Remove whitespace
- `concatenate` - Join multiple fields
- `custom` - Custom JavaScript function

**Example Use Case:** Auto-populate full_name by concatenating first_name and last_name

### 3. **Formula Bindings**
Calculate values using mathematical expressions.

```javascript
{
  id: "formula_1",
  fieldId: "total_price",
  type: "formula",
  formula: "SUM(${base_price}, ${tax}, ${shipping})"
}
```

**Built-in Functions:**
- `SUM(...args)` - Sum values
- `AVG(...args)` - Average
- `MAX(...args)` - Maximum
- `MIN(...args)` - Minimum
- `IF(condition, trueVal, falseVal)` - Conditional expression
- `CONCAT(...args)` - String concatenation
- `LEN(str)` - String length
- `UPPER(str)` - Uppercase
- `LOWER(str)` - Lowercase
- `ABS(n)` - Absolute value
- `ROUND(n, decimals)` - Round to decimals

**Example Use Cases:**
- Calculate total: `${quantity} * ${price}`
- Tiered discounts: `IF(${quantity} > 100, ${price} * 0.9, ${price})`
- Format currency: `ROUND(${amount}, 2)`

### 4. **Lookup Bindings**
Join with external data tables.

```javascript
{
  id: "lookup_1",
  fieldId: "customer_type",
  type: "lookup",
  sourceField: "customer_id",
  lookupTable: "customers",
  matchField: "id",
  returnField: "customer_type"
}
```

**How it works:**
1. Takes value from `sourceField` (customer_id)
2. Queries external `lookupTable` (customers)
3. Matches on `matchField` (id)
4. Returns value from `returnField` (customer_type)

**Example Use Case:** Populate customer_type by looking up customer profile

### 5. **Dependency Bindings**
Link fields together for cascading updates.

```javascript
{
  id: "dep_1",
  fieldId: "shipping_cost",
  type: "dependency",
  dependsOn: ["country_id", "weight"]
}
```

When country_id or weight changes, shipping_cost re-evaluates.

**Example Use Case:** Shipping cost depends on country and weight

## API Endpoints

### 1. Create a Binding
**POST** `/api/data-bindings/create`

```javascript
Request:
{
  cardId: "card_123",
  binding: {
    id: "binding_1",
    fieldId: "status_field",
    type: "conditional",
    sourceField: "order_type",
    condition: {
      operator: "equals",
      value: "express"
    }
  }
}

Response:
{
  success: true,
  binding: { ...binding }
}
```

### 2. Evaluate Single Binding
**POST** `/api/data-bindings/evaluate`

```javascript
Request:
{
  cardId: "card_123",
  bindingId: "binding_1",
  data: {
    order_type: "express",
    customer_id: "cust_456"
  }
}

Response:
{
  success: true,
  result: true,  // or false, or computed value
  bindingId: "binding_1"
}
```

### 3. Evaluate All Bindings
**POST** `/api/data-bindings/evaluate-all`

Evaluate entire binding set for a data record - returns results for all fields.

```javascript
Request:
{
  cardId: "card_123",
  data: {
    order_type: "express",
    quantity: 50,
    price: 100,
    customer_id: "cust_456"
  }
}

Response:
{
  success: true,
  results: {
    status_field: true,        // conditional result
    full_name: "JOHN DOE",     // computed result
    total_price: 5000,         // formula result
    customer_type: "premium",  // lookup result
    shipping_cost: 25          // dependency result
  }
}
```

### 4. Get Card Bindings
**GET** `/api/data-bindings/card/:cardId`

Retrieve all bindings for a card.

```javascript
Response:
{
  success: true,
  bindings: [
    { id: "binding_1", fieldId: "status", type: "conditional", ... },
    { id: "binding_2", fieldId: "total", type: "formula", ... }
  ],
  totalBindings: 2
}
```

### 5. Update Binding
**PUT** `/api/data-bindings/update`

```javascript
Request:
{
  cardId: "card_123",
  bindingId: "binding_1",
  updates: {
    condition: {
      operator: "greaterThan",
      value: "100"
    }
  }
}

Response:
{
  success: true
}
```

### 6. Delete Binding
**DELETE** `/api/data-bindings/delete`

```javascript
Request:
{
  cardId: "card_123",
  bindingId: "binding_1"
}

Response:
{
  success: true
}
```

### 7. Health Check
**GET** `/api/data-bindings/health`

```javascript
Response:
{
  status: "healthy",
  service: "Data Bindings",
  supportedTypes: ["conditional", "computed", "formula", "lookup", "dependency"],
  capabilities: {
    conditional: "Show/hide based on field conditions",
    computed: "Transform field values",
    formula: "Evaluate mathematical and function-based formulas",
    lookup: "Join with external data tables",
    dependency: "Create dependent field relationships"
  }
}
```

## React Hooks

### useDataBindings
Manage all bindings for a card.

```javascript
const {
  bindings,          // array of binding configs
  loading,           // boolean
  error,             // error message or null
  createBinding,     // async function
  updateBinding,     // async function
  deleteBinding,     // async function
  refetch            // function to reload
} = useDataBindings(cardId)
```

### useBindingEvaluation
Evaluate bindings with data records.

```javascript
const {
  results,                  // object with field results
  loading,                  // boolean
  error,                    // error message or null
  evaluateAllBindings,      // async function
  evaluateSingleBinding     // async function
} = useBindingEvaluation(cardId, data, autoEvaluate = true)
```

### useConditionalFields
Check field visibility.

```javascript
const {
  isFieldVisible,    // function(fieldId) => boolean
  visibleFields,     // function(fieldIds[]) => filteredIds[]
  conditions         // raw condition results
} = useConditionalFields(cardId, data)

// Usage:
if (isFieldVisible('shipping_field')) {
  // Render shipping fields
}
```

### useComputedFields
Access computed values.

```javascript
const {
  computedValues,    // object with computed results
  getComputedValue   // function(fieldId) => value
} = useComputedFields(cardId, data)

// Usage:
const fullName = getComputedValue('full_name')
```

### useFormulaFields
Access formula calculation results.

```javascript
const {
  formulaResults,    // object with formula results
  getFormulaResult   // function(fieldId) => value
} = useFormulaFields(cardId, data)

// Usage:
const total = getFormulaResult('total_price')
```

### useLookupFields
Access lookup results.

```javascript
const {
  lookupValues,      // object with lookup results
  getLookupValue     // function(fieldId) => value
} = useLookupFields(cardId, data)

// Usage:
const customerType = getLookupValue('customer_type')
```

### useDependentFields
Track field dependencies.

```javascript
const {
  dependencies,      // object mapping binding IDs to dependent fields
  getDependents,     // function(fieldId) => dependentIds[]
  loading            // boolean
} = useDependentFields(cardId)
```

### useBindingValidator
Validate binding configurations.

```javascript
const {
  validateBinding,      // function that validates any binding
  validateConditional,  // specific validators
  validateFormula,
  validateLookup
} = useBindingValidator()

// Usage:
const validation = validateBinding(bindingConfig)
if (validation.valid) {
  // Create binding
} else {
  console.error(validation.error)
}
```

## Component API

### DataBindingBuilder
The main UI component for managing bindings.

```javascript
import { DataBindingBuilder } from '../components/DataBindings'

<DataBindingBuilder
  cardId="card_123"
  cardFields={[
    { id: 'field_1', label: 'Order Type' },
    { id: 'field_2', label: 'Status' }
  ]}
  onClose={() => setShowBindings(false)}
/>
```

**Features:**
- 5 tabs (Conditional, Computed, Formula, Lookup, Dependency)
- Create/edit/delete bindings
- Visual binding preview
- Type-specific editors with validation
- Formula help with function reference

## Database Schema

### data_bindings Table
Stores binding definitions.

```sql
CREATE TABLE data_bindings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(255) NOT NULL,
  binding_id VARCHAR(255) NOT NULL,
  field_id VARCHAR(255) NOT NULL,
  type ENUM('conditional', 'computed', 'formula', 'lookup', 'dependency'),
  source_field VARCHAR(255),
  condition JSON,                    -- for conditionals
  formula LONGTEXT,                  -- for formulas
  lookup_table VARCHAR(255),         -- for lookups
  match_field VARCHAR(255),
  return_field VARCHAR(255),
  depends_on JSON,                   -- for dependencies
  metadata JSON,                     -- flexible storage
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE KEY unique_binding (card_id, binding_id),
  INDEX idx_card_id (card_id),
  INDEX idx_field_id (field_id),
  INDEX idx_type (type)
)
```

### binding_evaluation_cache Table
Caches binding evaluation results (1-hour TTL).

```sql
CREATE TABLE binding_evaluation_cache (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(255) NOT NULL,
  binding_id VARCHAR(255) NOT NULL,
  data_hash VARCHAR(255) NOT NULL,
  result JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP DEFAULT DATE_ADD(NOW(), INTERVAL 1 HOUR),
  UNIQUE KEY unique_cache_entry (card_id, binding_id, data_hash),
  INDEX idx_expires_at (expires_at)
)
```

### binding_audit_log Table
Tracks all binding operations.

```sql
CREATE TABLE binding_audit_log (
  id INT AUTO_INCREMENT PRIMARY KEY,
  card_id VARCHAR(255) NOT NULL,
  binding_id VARCHAR(255),
  user_id VARCHAR(255),
  action ENUM('create', 'update', 'delete', 'evaluate'),
  changes JSON,
  result VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  INDEX idx_card_id (card_id),
  INDEX idx_user_id (user_id),
  INDEX idx_action (action)
)
```

## Usage Examples

### Example 1: Show/Hide Shipping Fields
```javascript
// Create conditional binding
const binding = {
  id: 'shipping_visibility',
  fieldId: 'shipping_section',
  type: 'conditional',
  sourceField: 'order_type',
  condition: { operator: 'equals', value: 'physical' }
}

await createBinding(binding)

// Use in component
const { isFieldVisible } = useConditionalFields(cardId, data)
{isFieldVisible('shipping_section') && <ShippingForm />}
```

### Example 2: Calculate Total Price
```javascript
const binding = {
  id: 'total_calc',
  fieldId: 'total',
  type: 'formula',
  formula: '${subtotal} + ${tax} - ${discount} + ${shipping}'
}

const { getFormulaResult } = useFormulaFields(cardId, data)
const total = getFormulaResult('total')
```

### Example 3: Lookup Customer Tier
```javascript
const binding = {
  id: 'customer_lookup',
  fieldId: 'tier',
  type: 'lookup',
  sourceField: 'customer_id',
  lookupTable: 'customers',
  matchField: 'id',
  returnField: 'tier'
}

const { getLookupValue } = useLookupFields(cardId, data)
const tier = getLookupValue('tier') // "gold", "silver", "bronze"
```

### Example 4: Cascading Selections
```javascript
const binding = {
  id: 'shipping_depends',
  fieldId: 'shipping_cost',
  type: 'dependency',
  dependsOn: ['country', 'weight']
}

// When country or weight changes, shipping_cost automatically recalculates
```

### Example 5: Auto-Format Names
```javascript
const binding = {
  id: 'format_name',
  fieldId: 'display_name',
  type: 'computed',
  sourceField: 'raw_name',
  metadata: { computationType: 'titlecase' }
}
```

## Performance Considerations

1. **Caching:** Binding results are cached for 1 hour with data-aware hashing
2. **Lazy Evaluation:** Use `useBindingEvaluation(..., autoEvaluate = false)` for manual control
3. **Debouncing:** Evaluation is debounced at 500ms when data changes
4. **Indexing:** Database queries use indexes on card_id, field_id, and type
5. **Formula Safety:** Formulas are evaluated in a sandboxed context

## Best Practices

1. **Name bindings descriptively** - Use IDs like `calc_total_price` not `b1`
2. **Keep formulas simple** - Complex logic can be split into multiple bindings
3. **Test with sample data** - Use the evaluation API before saving
4. **Monitor performance** - Use audit logs to identify slow bindings
5. **Document dependencies** - Note which fields depend on which
6. **Validate user input** - Especially in custom functions
7. **Use appropriate types** - Don't use formula for simple conditionals

## Troubleshooting

### Binding Not Evaluating
- Check that sourceField exists in data
- Verify field IDs match exactly (case-sensitive)
- Look for circular dependencies

### Formula Errors
- Ensure field references use `${fieldName}` syntax
- Check function names are capitalized (SUM, not sum)
- Verify parentheses match

### Slow Lookups
- Add indexes to lookup table
- Consider caching lookup results
- Reduce lookup table size if possible

### Circular Dependencies
The system prevents infinite loops but may skip some evaluations. Restructure bindings to be linear.

## Security

- All binding operations require JWT authentication
- Formulas are evaluated in isolated sandbox
- No direct SQL injection possible (parameterized queries)
- Audit log tracks all modifications
- User permissions can be enforced at the field level

## Future Enhancements

- [ ] Binding validation rules engine
- [ ] Complex multi-field formulas
- [ ] Real-time binding performance monitoring
- [ ] Binding versioning and rollback
- [ ] GraphQL support for bindings
- [ ] Advanced scheduling for binding re-evaluation
- [ ] Machine learning-based binding suggestions
