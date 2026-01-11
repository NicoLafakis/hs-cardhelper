/**
 * @fileoverview Module exports
 * @module src/components/Collaboration/index
 * @license MIT
 * @author CardHelper Team
 */

/**
 * Collaboration Components Export
 */

export { CollaboratorsPanel } from './CollaboratorsPanel'
export { VersionHistory } from './VersionHistory'
export { ConflictResolver } from './ConflictResolver'

export default {
  CollaboratorsPanel: () => import('./CollaboratorsPanel'),
  VersionHistory: () => import('./VersionHistory'),
  ConflictResolver: () => import('./ConflictResolver'),
}
