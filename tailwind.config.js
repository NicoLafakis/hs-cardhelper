/**
 * @fileoverview Tailwind CSS configuration for CardHelper UI
 * @module tailwind.config
 * @description Configures Tailwind utility classes, theme extensions, and plugins
 * @license MIT
 * @author CardHelper Team
 */

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0091ae',
        secondary: '#f5f8fa',
      }
    },
  },
  plugins: [],
}
