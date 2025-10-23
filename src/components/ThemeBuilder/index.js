/**
 * Theme Builder Components Export
 */

export { ThemeEditor } from './ThemeEditor'
export { ThemePresets } from './ThemePresets'
export { ThemeSwitcher } from './ThemeSwitcher'

export default {
  ThemeEditor: () => import('./ThemeEditor'),
  ThemePresets: () => import('./ThemePresets'),
  ThemeSwitcher: () => import('./ThemeSwitcher')
}
