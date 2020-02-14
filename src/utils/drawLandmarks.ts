import BrowserImageManipulation from 'browser-image-manipulation'
import {imgSrcToBlob} from 'blob-util'

import {FaceLandmarks} from '../interfaces/FaceLandmarks'

export async function drawLandmarks(url: string, landmark: FaceLandmarks): Promise<string> {
  const fillColor = '#76ff03'
  const lineWidth = '1'

  const blob = await imgSrcToBlob(
    url,
    'image/jpeg',
    'Anonymous',
  )

  const transformed = await new BrowserImageManipulation()
    .loadBlob(blob)
    .drawLine(landmark.top_lip, fillColor, lineWidth)
    .drawLine(landmark.bottom_lip, fillColor, lineWidth)
    .drawLine(landmark.nose_bridge, fillColor, lineWidth)
    .drawLine(landmark.chin, fillColor, lineWidth)
    .drawLine(landmark.right_eyebrow, fillColor, lineWidth)
    .drawLine(landmark.left_eyebrow, fillColor, lineWidth)
    .drawPolygon(landmark.right_eye, undefined, fillColor, lineWidth)
    .drawPolygon(landmark.left_eye, undefined, fillColor, lineWidth)
    .resize(800, 800)
    .saveAsImage()

  return transformed.toString()
}
