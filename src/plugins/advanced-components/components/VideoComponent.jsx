/**
 * Video Component
 * Embeds videos from various sources
 */

import ReactPlayer from 'react-player'
import { Video } from 'lucide-react'

export function VideoComponent({ config }) {
  const {
    url = '',
    title = 'Video',
    autoplay = false,
    controls = true,
    loop = false,
    muted = false,
    width = '100%',
    height = '360px'
  } = config

  if (!url) {
    return (
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <Video size={48} className="mb-2" />
          <p className="text-sm">No video URL provided</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}

      <div className="relative rounded-lg overflow-hidden bg-black">
        <ReactPlayer
          url={url}
          playing={autoplay}
          controls={controls}
          loop={loop}
          muted={muted}
          width={width}
          height={height}
          config={{
            youtube: {
              playerVars: { showinfo: 1 }
            },
            vimeo: {
              playerOptions: { byline: true }
            }
          }}
        />
      </div>

      {config.description && (
        <p className="text-sm text-gray-600 mt-3">{config.description}</p>
      )}
    </div>
  )
}

export default VideoComponent
