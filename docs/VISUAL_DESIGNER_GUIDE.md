# Visual Designer Guide

## Overview

CardHelper now features a professional drag-and-drop visual designer that allows you to create HubSpot cards with complete freedom of layout and positioning - similar to Figma or Canva.

## Key Features

### ✅ **Free-Form Positioning**
- Drag components anywhere on the canvas
- Precise X/Y coordinate control
- No more rigid vertical stacking
- Position elements exactly where you want them

### ✅ **Resize Components**
- 8 resize handles on each selected component
- Drag corners to resize diagonally
- Drag edges to resize width or height only
- Minimum size constraints (50px width, 30px height)

### ✅ **Grid Snapping**
- Automatic grid snapping for precise alignment
- Default grid size: 8px
- Hold **Shift** while dragging/resizing to disable snapping
- Toggle grid visibility in toolbar

### ✅ **Layering Control**
- Z-index management for overlapping elements
- "Bring to Front" button to move component on top
- "Send to Back" button to move component behind others
- Components automatically ordered by z-index

### ✅ **Selection & Interaction**
- Click component to select it
- Blue border and shadow indicates selection
- Toolbar appears above selected component
- Click canvas background to deselect all

### ✅ **Properties Panel**
- **Position Controls**: X and Y coordinates
- **Size Controls**: Width and Height in pixels
- **Content Properties**: Component-specific settings
- Real-time updates as you type

---

## How to Use

### Adding Components

1. **Drag from Palette**
   - Find component in left sidebar
   - Click and drag onto canvas
   - Drop at desired position

2. **Click to Add**
   - Click component in palette
   - Component appears at default position (100, 100)
   - Drag to reposition

### Moving Components

1. **Drag to Move**
   - Click and hold component
   - Drag to new position
   - Release to place
   - **Hold Shift** to disable grid snapping

2. **Numeric Input**
   - Select component
   - Open Properties panel (right sidebar)
   - Enter exact X, Y coordinates
   - Changes apply immediately

### Resizing Components

1. **Corner Handles** (8 blue dots)
   - **Corners**: Resize width and height simultaneously
   - **Edges**: Resize one dimension only
   - **Hold Shift**: Disable grid snapping for pixel-perfect control

2. **Properties Panel**
   - Enter exact width and height values
   - Minimum: 50px width, 30px height
   - Changes apply immediately

### Layering & Ordering

1. **Bring to Front** (↑ button)
   - Moves component above all others
   - Increases z-index to highest + 1

2. **Send to Back** (↓ button)
   - Moves component below all others
   - Decreases z-index to lowest - 1

3. **Selection Priority**
   - Higher z-index = selected first when overlapping
   - Toolbar shows current layer position

### Keyboard Shortcuts

- **Ctrl+Z / Cmd+Z**: Undo last action
- **Ctrl+Shift+Z / Cmd+Shift+Z**: Redo action
- **Ctrl+Y / Cmd+Y**: Redo (alternative)
- **Shift + Drag**: Disable grid snapping
- **Shift + Resize**: Disable grid snapping
- **Click Canvas**: Deselect all

---

## Component Types

### Basic Components

**Text**
- Displays text content
- Font size control (small/medium/large)
- Default size: 200x100px

**Button**
- Interactive button with label
- URL linking support
- Default size: 200x100px

**Table**
- Data table with title
- Column configuration
- Default size: 400x200px

**Container** (NEW)
- Wrapper for nesting other components
- Drop zone for child elements
- Default size: 300x200px

---

## Properties Panel

### Position Section
- **X**: Horizontal position (pixels from left)
- **Y**: Vertical position (pixels from top)
- Type numbers for precise placement

### Size Section
- **Width**: Component width in pixels
- **Height**: Component height in pixels
- Minimum enforced automatically

### Content Section
Component-specific properties:

**Text Component**
- Text Content (multi-line textarea)
- Font Size (small/medium/large)

**Button Component**
- Button Label (text)
- URL (link destination)

**Table Component**
- Table Title (text)
- Column configuration (future)

**Container Component**
- No additional properties
- Used for nesting/grouping

---

## Technical Details

### Data Model

Each component now includes:

```javascript
{
  id: number,              // Unique identifier
  type: string,            // Component type (text, button, table, etc.)
  x: number,               // X position (pixels)
  y: number,               // Y position (pixels)
  width: number,           // Width (pixels)
  height: number,          // Height (pixels)
  zIndex: number,          // Layer order
  parentId: number | null, // Parent container (for nesting)
  children: [],            // Child components
  defaultProps: {}         // Component-specific properties
}
```

### Grid System

- **Grid Size**: 8px (configurable)
- **Snapping**: Automatic when dragging/resizing
- **Override**: Hold Shift key
- **Visual Grid**: Toggleable background pattern

### Canvas Specifications

- **Minimum Size**: 1200px × 800px
- **Scrollable**: Overflow creates scrollbars
- **Background**: Gray with optional grid
- **Click Zones**: Components have priority over canvas

---

## Best Practices

### Layout Design

1. **Start with Containers**
   - Use containers to group related components
   - Create sections (header, body, footer)

2. **Use Grid Snapping**
   - Keep grid snapping enabled for alignment
   - Creates professional, aligned layouts
   - Only disable when fine-tuning needed

3. **Layering Strategy**
   - Background elements: low z-index
   - Interactive elements: high z-index
   - Text overlays: highest z-index

4. **Sizing Guidelines**
   - Text: 200-400px width
   - Buttons: 100-200px width, 40-50px height
   - Tables: 400-800px width, 200-400px height
   - Containers: Match content size

### Performance

- **Component Limit**: Tested up to 100 components
- **Undo History**: 50 states preserved
- **Real-time Updates**: All changes instant
- **Auto-save**: Use Templates feature to save work

---

## Troubleshooting

### Component Won't Move
- **Issue**: Component appears stuck
- **Fix**: Check if component is selected (blue border)
- **Fix**: Ensure Properties panel shows correct component

### Grid Snapping Too Aggressive
- **Issue**: Can't position precisely
- **Fix**: Hold Shift while dragging
- **Fix**: Use Properties panel for exact coordinates

### Resize Handle Not Working
- **Issue**: Can't resize component
- **Fix**: Click component first to select it
- **Fix**: Ensure clicking directly on blue dots (handles)

### Component Hidden Behind Others
- **Issue**: Can't see or select component
- **Fix**: Use "Bring to Front" button on toolbar
- **Fix**: Click empty canvas area, then try selecting again

### Changes Not Saving to History
- **Issue**: Undo/Redo not working
- **Fix**: Position/Size changes during drag don't save to history
- **Fix**: Release mouse to commit change to history

---

## Future Enhancements

### Coming Soon
- [ ] Multi-select (Ctrl+Click)
- [ ] Alignment tools (align left, center, right)
- [ ] Distribution tools (space evenly)
- [ ] Copy/Paste components
- [ ] Duplicate component (Ctrl+D)
- [ ] Group/Ungroup components
- [ ] Rulers and guides
- [ ] Zoom in/out
- [ ] Pan canvas (spacebar + drag)

---

## API Reference

### Store Methods

```javascript
// Add component
addComponent(component, parentId, dropPosition)

// Move component
moveComponent(id, x, y, snap)

// Resize component
resizeComponent(id, width, height, snap)

// Layering
bringToFront(id)
sendToBack(id)

// Selection
selectComponent(id)

// Grid
toggleGrid()
setGridSize(size)
```

### Component Structure

```javascript
const component = {
  id: Date.now() + Math.random(),
  type: 'text',
  x: 100,
  y: 100,
  width: 200,
  height: 100,
  zIndex: 0,
  parentId: null,
  children: [],
  defaultProps: {
    content: 'Hello World',
    fontSize: 'medium'
  }
}
```

---

## Support

For questions or issues:
1. Check troubleshooting section above
2. Review keyboard shortcuts
3. Ensure latest version installed
4. Report bugs in GitHub issues

---

## Version History

### v2.0.0 - Visual Designer Launch
- Added free-form positioning
- Added resize handles
- Added grid snapping
- Added layering controls
- Added position/size properties panel
- Deprecated vertical stacking layout

### v1.0.0 - Initial Release
- Basic vertical stacking
- Limited component types
- Simple property editing
