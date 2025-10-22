/**
 * UI Components Index
 * Central export for all UI components
 */

// Atoms
export * from './atoms'

// Molecules
export * from './molecules'

// Component library metadata
export const UI_VERSION = '1.0.0'

export const COMPONENTS_REGISTRY = {
  atoms: [
    'Button',
    'Input',
    'Label',
    'Card',
    'CardHeader',
    'CardBody',
    'CardFooter',
    'Badge',
    'Spinner'
  ],
  molecules: [
    'FormField',
    'Modal'
  ]
}
