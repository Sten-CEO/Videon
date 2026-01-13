/**
 * Remotion Root Component
 *
 * Registers all compositions for the Remotion bundler.
 */

import React from 'react'
import { Composition } from 'remotion'
import { MarketingVideo, VIDEO_CONFIG } from './MarketingVideo'
import { defaultVideoProps } from './types'

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={VIDEO_CONFIG.id}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        component={MarketingVideo as any}
        durationInFrames={VIDEO_CONFIG.durationInFrames}
        fps={VIDEO_CONFIG.fps}
        width={VIDEO_CONFIG.width}
        height={VIDEO_CONFIG.height}
        defaultProps={defaultVideoProps}
      />
    </>
  )
}
