/**
 * @fileoverview Module exports
 * @module src/components/CardStates/index
 * @license MIT
 * @author CardHelper Team
 */

/**
 * CardStates Components - Multi-state Card Behaviors feature
 *
 * This module provides state management and conditional logic for cards:
 * - StateManager: Component state management (hover, active, disabled, etc.)
 * - StateEditor: Visual editor for configuring component states
 * - ConditionalLogic: Conditional visibility and behavior rules
 */

export {
  default as StateManager,
  StateEditor,
  CardStateProvider,
  useCardState,
  COMPONENT_STATES,
  STATE_STYLE_PROPERTIES,
  getPreviewStyles,
} from './StateManager'

export {
  default as ConditionalLogic,
  evaluateCondition,
  evaluateRule,
  OPERATORS,
  ACTIONS,
} from './ConditionalLogic'
