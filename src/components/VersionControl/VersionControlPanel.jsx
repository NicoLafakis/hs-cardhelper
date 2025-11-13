import React, { useState } from 'react'
import {
  X,
  Save,
  Clock,
  GitBranch,
  Eye,
  Trash2,
  Download,
  Upload,
  Search,
  Tag,
  Copy,
  RotateCcw,
  AlertCircle,
  Check
} from 'lucide-react'
import useVersionStore from '../../store/versionStore'
import useBuilderStore from '../../store/builderStore'

export default function VersionControlPanel({ isOpen, onClose }) {
  const [snapshotName, setSnapshotName] = useState('')
  const [snapshotDescription, setSnapshotDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSnapshots, setSelectedSnapshots] = useState([])
  const [showComparison, setShowComparison] = useState(false)
  const [newTag, setNewTag] = useState('')

  const {
    snapshots,
    createSnapshot,
    deleteSnapshot,
    compareSnapshots,
    exportSnapshots,
    importSnapshots,
    addTag,
    searchSnapshots,
    autoSaveEnabled,
    setAutoSaveEnabled
  } = useVersionStore()

  const { components, loadComponents } = useBuilderStore()

  const handleCreateSnapshot = () => {
    if (!snapshotName.trim()) {
      alert('Snapshot name is required')
      return
    }

    createSnapshot(snapshotName, snapshotDescription, components)
    setSnapshotName('')
    setSnapshotDescription('')
  }

  const handleRestoreSnapshot = (snapshot) => {
    if (!confirm(`Restore to "${snapshot.name}"? Current work will be lost if not saved.`)) {
      return
    }

    loadComponents(snapshot.components)
    onClose()
  }

  const handleDeleteSnapshot = (id) => {
    if (!confirm('Delete this snapshot? This cannot be undone.')) {
      return
    }
    deleteSnapshot(id)
  }

  const handleExport = () => {
    const data = exportSnapshots()
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `card-snapshots-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = importSnapshots(event.target.result)
      if (result.success) {
        alert(`Successfully imported ${result.count} snapshots`)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    }
    reader.readAsText(file)
  }

  const handleCompare = () => {
    if (selectedSnapshots.length !== 2) {
      alert('Please select exactly 2 snapshots to compare')
      return
    }

    setShowComparison(true)
  }

  const handleAddTag = (snapshotId) => {
    if (newTag.trim()) {
      addTag(snapshotId, newTag.trim())
      setNewTag('')
    }
  }

  const filteredSnapshots = searchQuery
    ? searchSnapshots(searchQuery)
    : snapshots

  const sortedSnapshots = [...filteredSnapshots].sort((a, b) =>
    new Date(b.createdAt) - new Date(a.createdAt)
  )

  if (!isOpen) return null

  // Comparison View
  if (showComparison && selectedSnapshots.length === 2) {
    const comparison = compareSnapshots(selectedSnapshots[0], selectedSnapshots[1])

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Compare Snapshots</h2>
            <button
              onClick={() => setShowComparison(false)}
              className="p-2 hover:bg-gray-100 rounded"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {/* Comparison Header */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <h3 className="font-semibold text-blue-900 mb-1">
                  {comparison.snapshot1.name}
                </h3>
                <p className="text-sm text-blue-700">
                  {new Date(comparison.snapshot1.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded p-4">
                <h3 className="font-semibold text-green-900 mb-1">
                  {comparison.snapshot2.name}
                </h3>
                <p className="text-sm text-green-700">
                  {new Date(comparison.snapshot2.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">Summary</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {comparison.summary.totalChanges}
                  </div>
                  <div className="text-sm text-gray-600">Total Changes</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    +{comparison.summary.added}
                  </div>
                  <div className="text-sm text-gray-600">Added</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    -{comparison.summary.removed}
                  </div>
                  <div className="text-sm text-gray-600">Removed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">
                    {comparison.summary.modified}
                  </div>
                  <div className="text-sm text-gray-600">Modified</div>
                </div>
              </div>
            </div>

            {/* Changes Detail */}
            <div className="space-y-4">
              {comparison.changes.added.length > 0 && (
                <div>
                  <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Added Components ({comparison.changes.added.length})
                  </h4>
                  <div className="space-y-2">
                    {comparison.changes.added.map(comp => (
                      <div key={comp.id} className="bg-green-50 border border-green-200 rounded p-3">
                        <span className="font-medium text-green-900">{comp.type}</span>
                        <span className="text-sm text-green-700 ml-2">
                          at ({comp.x}, {comp.y})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comparison.changes.removed.length > 0 && (
                <div>
                  <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Removed Components ({comparison.changes.removed.length})
                  </h4>
                  <div className="space-y-2">
                    {comparison.changes.removed.map(comp => (
                      <div key={comp.id} className="bg-red-50 border border-red-200 rounded p-3">
                        <span className="font-medium text-red-900">{comp.type}</span>
                        <span className="text-sm text-red-700 ml-2">
                          at ({comp.x}, {comp.y})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {comparison.changes.modified.length > 0 && (
                <div>
                  <h4 className="font-semibold text-yellow-700 mb-2 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Modified Components ({comparison.changes.modified.length})
                  </h4>
                  <div className="space-y-2">
                    {comparison.changes.modified.map(({ before, after }) => (
                      <div key={after.id} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <span className="font-medium text-yellow-900">{after.type}</span>
                        <div className="text-sm text-yellow-700 mt-1">
                          Position: ({before.x}, {before.y}) → ({after.x}, {after.y})
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Version Control View
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Version Control</h2>
            <p className="text-sm text-gray-600">Manage snapshots and track changes</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded text-gray-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm cursor-pointer">
                <Upload className="w-4 h-4" />
                Import
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
              </label>
              {selectedSnapshots.length === 2 && (
                <button
                  onClick={handleCompare}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                >
                  <GitBranch className="w-4 h-4" />
                  Compare
                </button>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
              />
              Auto-save (every 5 min)
            </label>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snapshots..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded text-sm"
            />
          </div>
        </div>

        {/* Create Snapshot Form */}
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Create New Snapshot</h3>
          <div className="space-y-2">
            <input
              type="text"
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="Snapshot name (required)"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <textarea
              value={snapshotDescription}
              onChange={(e) => setSnapshotDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={handleCreateSnapshot}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded text-sm hover:bg-primary-dark"
            >
              <Save className="w-4 h-4" />
              Create Snapshot
            </button>
          </div>
        </div>

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto p-4">
          {sortedSnapshots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">No snapshots yet</p>
              <p className="text-xs mt-1">Create your first snapshot to start tracking changes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedSnapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className={`border rounded p-4 transition-all ${
                    selectedSnapshots.includes(snapshot.id)
                      ? 'border-primary bg-primary bg-opacity-5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={selectedSnapshots.includes(snapshot.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedSnapshots([...selectedSnapshots, snapshot.id])
                          } else {
                            setSelectedSnapshots(selectedSnapshots.filter(id => id !== snapshot.id))
                          }
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{snapshot.name}</h4>
                        {snapshot.description && (
                          <p className="text-sm text-gray-600 mt-1">{snapshot.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(snapshot.createdAt).toLocaleString()}
                          </span>
                          <span>{snapshot.components.length} components</span>
                        </div>
                        {snapshot.tags && snapshot.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {snapshot.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleRestoreSnapshot(snapshot)}
                        className="p-2 hover:bg-green-100 text-green-600 rounded"
                        title="Restore this snapshot"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snapshot.id)}
                        className="p-2 hover:bg-red-100 text-red-600 rounded"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
