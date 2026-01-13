/**
 * Remotion Configuration
 *
 * Configuration for Remotion CLI and preview server.
 */

import { Config } from '@remotion/cli/config'

// Set output codec
Config.setCodec('h264')

// Set output location for CLI renders
Config.setOutputLocation('out/video.mp4')

// Enable webpack caching
Config.setCachingEnabled(true)
