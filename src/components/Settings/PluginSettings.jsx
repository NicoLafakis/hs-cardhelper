/**
 * Plugin Settings Component
 * Allows users to manage plugins (enable/disable)
 */

import { useState } from 'react'
import { usePlugins } from '../../core/PluginManager'
import { Button } from '../ui/atoms/Button'
import { Badge } from '../ui/atoms/Badge'
import { Card, CardHeader, CardBody } from '../ui/atoms/Card'
import { Spinner } from '../ui/atoms/Spinner'

export function PluginSettings() {
  const { plugins, enablePlugin, disablePlugin, initialized } = usePlugins()
  const [loading, setLoading] = useState({})

  const handleToggle = async (pluginId, currentlyEnabled) => {
    setLoading({ ...loading, [pluginId]: true })

    try {
      if (currentlyEnabled) {
        await disablePlugin(pluginId)
      } else {
        await enablePlugin(pluginId)
      }
    } catch (error) {
      console.error('Failed to toggle plugin:', error)
    } finally {
      setLoading({ ...loading, [pluginId]: false })
    }
  }

  if (!initialized) {
    return (
      <div className="flex items-center justify-center p-8">
        <Spinner size="lg" />
      </div>
    )
  }

  if (plugins.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        No plugins available
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Plugins</h2>
        <p className="text-gray-600 mt-1">
          Manage your CardHelper plugins. Enable or disable features as needed.
        </p>
      </div>

      <div className="grid gap-4">
        {plugins.map((plugin) => (
          <Card key={plugin.id} className="overflow-hidden">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {plugin.name}
                    </h3>
                    <Badge
                      variant={plugin.enabled ? 'success' : 'default'}
                      size="sm"
                    >
                      {plugin.enabled ? 'Enabled' : 'Disabled'}
                    </Badge>
                    {plugin.initialized && (
                      <Badge variant="info" size="sm">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {plugin.description}
                  </p>
                </div>

                <Button
                  variant={plugin.enabled ? 'danger' : 'primary'}
                  size="sm"
                  onClick={() => handleToggle(plugin.id, plugin.enabled)}
                  disabled={loading[plugin.id]}
                >
                  {loading[plugin.id] ? (
                    <Spinner size="sm" />
                  ) : plugin.enabled ? (
                    'Disable'
                  ) : (
                    'Enable'
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardBody className="bg-gray-50">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Version:</span>
                  <span className="ml-2 text-gray-600">{plugin.version}</span>
                </div>
                {plugin.author && (
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>
                    <span className="ml-2 text-gray-600">{plugin.author}</span>
                  </div>
                )}
                {plugin.dependencies.length > 0 && (
                  <div className="col-span-2">
                    <span className="font-medium text-gray-700">Dependencies:</span>
                    <div className="flex gap-2 mt-1">
                      {plugin.dependencies.map((dep) => (
                        <Badge key={dep} variant="default" size="sm">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Plugin Development</h4>
        <p className="text-sm text-blue-800">
          Want to create your own plugin? Check out the{' '}
          <code className="bg-blue-100 px-1 py-0.5 rounded">src/plugins/README.md</code>{' '}
          file for documentation and examples.
        </p>
      </div>
    </div>
  )
}

export default PluginSettings
