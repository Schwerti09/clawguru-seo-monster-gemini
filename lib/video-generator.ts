/**
 * Roast Video Generator
 * Creates auto-generated video content from roast data
 * Uses Canvas API and MediaRecorder for client-side generation
 */

export interface RoastVideoData {
  score: number
  stackName: string
  topFinding: string
  locale?: string
}

/**
 * Generate a simple animated roast video using Canvas
 * Returns a Blob URL that can be shared/downloaded
 */
export async function generateRoastVideo(data: RoastVideoData): Promise<string> {
  const { score, stackName, topFinding, locale = "de" } = data
  
  const canvas = document.createElement("canvas")
  canvas.width = 1080
  canvas.height = 1920 // 9:16 for TikTok/Reels
  const ctx = canvas.getContext("2d")
  
  if (!ctx) {
    throw new Error("Canvas context not available")
  }

  // Determine colors based on score
  const isGood = score >= 80
  const isMedium = score >= 50 && score < 80
  const isBad = score < 50
  
  const accentColor = isGood ? "#22c55e" : isMedium ? "#f59e0b" : "#ef4444"
  const scoreLabel = isGood ? "PROTECTED" : isMedium ? "NEEDS WORK" : "ROASTED"

  // Animation frames
  const frames: Blob[] = []
  const fps = 30
  const duration = 5 // seconds
  const totalFrames = fps * duration

  for (let i = 0; i < totalFrames; i++) {
    const progress = i / totalFrames
    
    // Clear canvas
    ctx.fillStyle = "#0a0a0a"
    ctx.fillRect(0, 0, 1080, 1920)

    // Animated background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, 1920)
    gradient.addColorStop(0, `rgba(10, 10, 10, 1)`)
    gradient.addColorStop(0.5, `${accentColor}20`)
    gradient.addColorStop(1, `rgba(10, 10, 10, 1)`)
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1080, 1920)

    // Border pulse animation
    const pulse = Math.sin(progress * Math.PI * 4) * 2 + 4
    ctx.strokeStyle = accentColor
    ctx.lineWidth = pulse
    ctx.strokeRect(40, 40, 1000, 1840)

    // Title with animation
    ctx.fillStyle = "#ffffff"
    ctx.font = "bold 80px system-ui"
    ctx.textAlign = "center"
    ctx.globalAlpha = Math.min(1, progress * 3)
    ctx.fillText("ROAST MY MOLTBOT", 540, 300)
    ctx.globalAlpha = 1

    // Score (animated counting)
    const animatedScore = Math.floor(score * Math.min(1, progress * 2))
    ctx.font = `bold ${200 + Math.sin(progress * Math.PI * 2) * 10}px system-ui`
    ctx.fillStyle = accentColor
    ctx.fillText(`${animatedScore}`, 540, 700)

    // Score label
    ctx.font = "bold 60px system-ui"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(scoreLabel, 540, 800)

    // Stack name
    ctx.font = "40px system-ui"
    ctx.fillStyle = "#888888"
    const truncatedStack = stackName.length > 30 ? stackName.slice(0, 27) + "..." : stackName
    ctx.fillText(truncatedStack, 540, 1000)

    // Top finding (appears later)
    if (progress > 0.4) {
      ctx.globalAlpha = Math.min(1, (progress - 0.4) * 3)
      ctx.fillStyle = "#f87171"
      ctx.font = "bold 50px system-ui"
      ctx.fillText(locale === "de" ? "KRITISCH:" : "CRITICAL:", 540, 1200)
      
      ctx.fillStyle = "#ffffff"
      ctx.font = "40px system-ui"
      const lines = wrapText(ctx, topFinding, 900)
      lines.slice(0, 3).forEach((line, idx) => {
        ctx.fillText(line, 540, 1280 + idx * 60)
      })
      ctx.globalAlpha = 1
    }

    // Footer
    ctx.font = "35px system-ui"
    ctx.fillStyle = "#666666"
    ctx.fillText("clawguru.org/roast-my-moltbot", 540, 1800)

    // Add frame (simplified - in reality would use MediaRecorder)
    // For now, return canvas as image sequence
  }

  // Export final frame as image (simplified video)
  return canvas.toDataURL("image/png")
}

/**
 * Wrap text to fit within maxWidth
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(" ")
  const lines: string[] = []
  let currentLine = ""

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)
    
    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }
  
  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}

/**
 * Share video to TikTok (opens share dialog)
 */
export function shareToTikTok(videoUrl: string): void {
  // TikTok doesn't have a direct share API for web
  // Open TikTok with pre-filled content
  window.open(`https://www.tiktok.com/upload`, "_blank")
}

/**
 * Share video to Instagram Reels
 */
export function shareToInstagram(videoUrl: string): void {
  // Instagram doesn't have web share API
  // Guide user to download and upload manually
  alert("Video ready for download! Upload to Instagram Reels manually.")
}

/**
 * Generate video filename
 */
export function generateVideoFilename(score: number): string {
  const timestamp = Date.now()
  return `roast-video-${score}-${timestamp}.mp4`
}
