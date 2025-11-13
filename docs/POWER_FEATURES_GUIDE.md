# Power Features Guide

This guide covers the three new no-code power features that dramatically increase user capabilities:

1. **Visual Conditional Logic Builder** - Complex if-then-else logic without code
2. **Formula Builder with AI** - Natural language to formula conversion
3. **Bulk Operations Panel** - Batch processing with CSV import/export

---

## Feature 1: Visual Conditional Logic Builder

### Overview

Create complex conditional rules with a drag-and-drop interface. No coding required.

### Usage

```jsx
import { ConditionBuilder } from './components/ConditionalLogic/ConditionBuilder'

function MyComponent() {
  const [conditions, setConditions] = useState([])

  const availableFields = [
    { value: 'status', label: 'Status', type: 'string' },
    { value: 'amount', label: 'Amount', type: 'number' },
    { value: 'date', label: 'Date', type: 'date' }
  ]

  const availableComponents = [
    { value: 'comp_1', label: 'Premium Section' },
    { value: 'comp_2', label: 'Standard Section' }
  ]

  return (
    <ConditionBuilder
      conditions={conditions}
      onChange={setConditions}
      availableFields={availableFields}
      availableComponents={availableComponents}
    />
  )
}
```

### Features

- **Multiple Conditions**: Combine with AND/OR logic
- **8 Operators**: equals, not equals, greater than, less than, contains, starts with, is empty, is not empty
- **6 Action Types**:
  - Show/Hide Components
  - Set Field Values
  - Apply Themes
  - Trigger Validation
  - Send Notifications
- **Nested Rules**: Create complex multi-condition logic
- **Visual Interface**: No code required

### Example Use Cases

1. **VIP Treatment**:
   ```
   IF contact.status equals "VIP"
   THEN show Premium Support Section
   AND apply Gold Theme
   ```

2. **Discounts**:
   ```
   IF deal.amount > 10000
   THEN set discount = 20%
   ELSE set discount = 10%
   ```

3. **Required Fields**:
   ```
   IF form.type equals "enterprise"
   THEN show Legal Documents Section
   AND trigger validation on company_tax_id
   ```

### API Integration

The condition builder integrates with your existing DataBindingsService:

```javascript
// Save conditions
await api.post('/api/data-bindings/create', {
  type: 'conditional',
  condition: conditionConfig
})

// Evaluate at runtime
const result = await api.post('/api/data-bindings/evaluate', {
  bindingId: 'cond_123',
  data: currentFormData
})
```

---

## Feature 2: Formula Builder with AI

### Overview

Create mathematical and text formulas using natural language or visual builder.

### Usage

```jsx
import { FormulaBuilder } from './components/FormulaBuilder/FormulaBuilder'

function MyComponent() {
  const [formula, setFormula] = useState('')

  const availableFields = [
    { value: 'deal_value', label: 'Deal Value' },
    { value: 'discount_percent', label: 'Discount %' }
  ]

  const handleTest = async (formula) => {
    const response = await api.post('/api/data-bindings/evaluate-formula', {
      formula,
      testData: { deal_value: 1000, discount_percent: 10 }
    })
    return response.data
  }

  return (
    <FormulaBuilder
      value={formula}
      onChange={setFormula}
      availableFields={availableFields}
      onTest={handleTest}
    />
  )
}
```

### Modes

1. **AI Generate** - Natural language to formula:
   ```
   "Calculate 10% commission on deal value"
   → ${deal_value} * 0.10
   ```

2. **Visual Builder** - Click to insert functions:
   ```
   Click "SUM" → Click field "revenue" → Formula created
   ```

3. **Code Editor** - Direct formula editing

### Available Functions

**Math Functions**:
- `SUM(...)` - Add numbers
- `AVG(...)` - Calculate average
- `MAX(...)` - Find maximum
- `MIN(...)` - Find minimum
- `ROUND(number, decimals)` - Round
- `ABS(number)` - Absolute value

**Text Functions**:
- `CONCAT(...)` - Combine text
- `UPPER(text)` - Uppercase
- `LOWER(text)` - Lowercase
- `LEN(text)` - Text length

**Logic Functions**:
- `IF(condition, trueValue, falseValue)` - Conditional
- `COUNT(...)` - Count items

### Example Formulas

```javascript
// Commission calculation
${deal_value} * 0.10

// Full name
CONCAT(${first_name}, " ", ${last_name})

// Conditional pricing
IF(${quantity} > 100, ${price} * 0.9, ${price})

// Complex calculation
SUM(${base_price}, ${tax}, ${shipping}) * IF(${is_member}, 0.95, 1)
```

### API Endpoints

**Generate Formula from AI**:
```javascript
POST /api/ai/generate-formula
{
  "description": "Calculate total with 10% discount",
  "availableFields": ["price", "quantity"]
}

Response:
{
  "formula": "${price} * ${quantity} * 0.9",
  "explanation": "Multiplies price by quantity and applies 10% discount"
}
```

**Evaluate Formula**:
```javascript
POST /api/data-bindings/evaluate-formula
{
  "formula": "${amount} * 0.1",
  "data": { "amount": 1000 }
}

Response:
{
  "result": 100,
  "success": true
}
```

---

## Feature 3: Bulk Operations Panel

### Overview

Process hundreds of records at once with CSV import/export, batch updates, and progress tracking.

### Usage

```jsx
import { BulkOperationsPanel } from './components/BulkOperations/BulkOperationsPanel'

function MyComponent() {
  const availableFields = [
    { value: 'status', label: 'Status' },
    { value: 'owner', label: 'Owner' }
  ]

  const handleExecute = async (operation) => {
    const { type, record, updates } = operation

    // Your batch processing logic
    await api.post('/api/bulk-operations/execute-update', {
      record,
      updates
    })
  }

  return (
    <BulkOperationsPanel
      availableFields={availableFields}
      onExecute={handleExecute}
      objectType="contacts"
    />
  )
}
```

### Features

**CSV Import**:
- Upload CSV files
- Auto-detect headers
- Preview data before processing
- Error handling

**Bulk Operations**:
- **Update**: Change multiple fields across records
- **Delete**: Remove multiple records (with confirmation)
- **Duplicate**: Clone multiple records

**Progress Tracking**:
- Real-time progress bar
- Error logging
- Pause/Resume capability
- Cancel operation

**CSV Export**:
- Export processed records
- Download results
- Include error reports

### API Endpoints

**Create Bulk Job**:
```javascript
POST /api/bulk-operations/create-job
{
  "operationType": "update",
  "recordCount": 100,
  "config": {}
}

Response:
{
  "jobId": "job_1234567890",
  "status": "created"
}
```

**Execute Update**:
```javascript
POST /api/bulk-operations/execute-update
{
  "jobId": "job_1234567890",
  "records": [...],
  "fieldUpdates": [
    { "field": "status", "value": "active" }
  ]
}

Response:
{
  "success": true,
  "processed": 100,
  "errors": []
}
```

**Get Job Status**:
```javascript
GET /api/bulk-operations/job-status/job_1234567890

Response:
{
  "id": "job_1234567890",
  "status": "running",
  "current": 45,
  "total": 100,
  "errors": []
}
```

**Get History**:
```javascript
GET /api/bulk-operations/history?limit=20

Response:
{
  "history": [
    {
      "jobId": "job_1234567890",
      "operationType": "update",
      "totalRecords": 100,
      "status": "completed",
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## Integration Example

Here's how to integrate all three features into a card builder:

```jsx
import { useState } from 'react'
import { ConditionBuilder } from './components/ConditionalLogic/ConditionBuilder'
import { FormulaBuilder } from './components/FormulaBuilder/FormulaBuilder'
import { BulkOperationsPanel } from './components/BulkOperations/BulkOperationsPanel'

function CardBuilder() {
  const [activeFeature, setActiveFeature] = useState(null)

  return (
    <div className="card-builder">
      {/* Feature Selector */}
      <div className="feature-toolbar">
        <button onClick={() => setActiveFeature('conditions')}>
          Add Conditional Logic
        </button>
        <button onClick={() => setActiveFeature('formula')}>
          Create Formula
        </button>
        <button onClick={() => setActiveFeature('bulk')}>
          Bulk Operations
        </button>
      </div>

      {/* Feature Panels */}
      {activeFeature === 'conditions' && (
        <ConditionBuilder
          conditions={card.conditions}
          onChange={(conditions) => updateCard({ conditions })}
          availableFields={card.fields}
          availableComponents={card.components}
        />
      )}

      {activeFeature === 'formula' && (
        <FormulaBuilder
          value={selectedField.formula}
          onChange={(formula) => updateField(selectedField.id, { formula })}
          availableFields={card.fields}
        />
      )}

      {activeFeature === 'bulk' && (
        <BulkOperationsPanel
          availableFields={card.fields}
          onExecute={handleBulkOperation}
          objectType="cards"
        />
      )}
    </div>
  )
}
```

---

## Database Schema

### Bulk Operations Tables

```sql
-- Job tracking
CREATE TABLE bulk_operation_jobs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(255) UNIQUE NOT NULL,
  user_id INT NOT NULL,
  operation_type ENUM('update', 'delete', 'duplicate', 'export', 'import'),
  total_records INT DEFAULT 0,
  processed_records INT DEFAULT 0,
  failed_records INT DEFAULT 0,
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'completed_with_errors'),
  config JSON,
  error_log JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completed_at TIMESTAMP NULL,
  INDEX idx_user_id (user_id),
  INDEX idx_job_id (job_id),
  INDEX idx_status (status)
);

-- Individual record tracking
CREATE TABLE bulk_operation_records (
  id INT AUTO_INCREMENT PRIMARY KEY,
  job_id VARCHAR(255) NOT NULL,
  record_id VARCHAR(255),
  status ENUM('pending', 'success', 'failed'),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_job_id (job_id)
);
```

---

## Performance Considerations

### Conditional Logic Builder

- Rules are evaluated in order
- Cached for frequently accessed conditions
- Use the simplest operators that meet your needs

### Formula Builder

- Formulas are parsed and cached
- Complex nested formulas may impact performance
- Use built-in functions when possible (faster than custom logic)

### Bulk Operations

- Processes 100ms delay between records (configurable)
- Maximum 10,000 records per job recommended
- Uses database transactions for consistency
- Error recovery and retry logic built-in

---

## Testing

### Unit Tests

```javascript
// Test conditional logic
test('evaluates AND condition correctly', async () => {
  const condition = {
    operator: 'AND',
    conditions: [
      { field: 'status', operator: 'equals', value: 'VIP' },
      { field: 'amount', operator: 'greaterThan', value: 1000 }
    ]
  }

  const result = await evaluateCondition(condition, {
    status: 'VIP',
    amount: 1500
  })

  expect(result).toBe(true)
})

// Test formula evaluation
test('calculates commission correctly', () => {
  const formula = '${amount} * 0.10'
  const result = evaluateFormula(formula, { amount: 1000 })
  expect(result).toBe(100)
})

// Test bulk operation
test('updates multiple records', async () => {
  const records = [{ id: 1 }, { id: 2 }]
  const updates = [{ field: 'status', value: 'active' }]

  const result = await executeBulkUpdate(records, updates)

  expect(result.processed).toBe(2)
  expect(result.errors).toHaveLength(0)
})
```

---

## Troubleshooting

### Conditional Logic Not Working

1. Check field types match operators
2. Verify field names in availableFields
3. Check console for evaluation errors
4. Test conditions individually before combining

### Formula Errors

1. Ensure field names use `${fieldName}` syntax
2. Check for syntax errors in formula
3. Verify all referenced fields exist
4. Test with sample data first

### Bulk Operations Slow

1. Reduce batch size
2. Increase delay between records
3. Check database indexes
4. Monitor server resources

---

## Best Practices

1. **Start Simple**: Test with small datasets before scaling
2. **Use Validation**: Always validate user input
3. **Provide Feedback**: Show progress and errors clearly
4. **Handle Errors Gracefully**: Don't fail entire batch for one error
5. **Document Formulas**: Add comments explaining complex formulas
6. **Test Conditions**: Verify logic with edge cases
7. **Backup Data**: Always backup before bulk deletes

---

## Support

For questions or issues:
- Check the main [README.md](../README.md)
- Review [DATABASE_SETUP.md](./DATABASE_SETUP.md)
- Open an issue on GitHub
- Contact support

---

**Version**: 1.0.0
**Last Updated**: 2025-01-11
