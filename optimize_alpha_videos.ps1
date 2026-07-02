$ErrorActionPreference = "Stop"

$videos = @(
    "public\images\about\about_bottom_smoke_hq.webm",
    "public\images\about\about_page_video.mov",
    "public\images\about\butterflies_loop.mov",
    "public\images\about\paint-splatter-transparent.webm"
)

foreach ($video in $videos) {
    if (Test-Path $video) {
        $dir = Split-Path $video -Parent
        $base = [System.IO.Path]::GetFileNameWithoutExtension($video)
        $out = Join-Path $dir "$base`_optimized.webm"
        
        Write-Host "Optimizing $video to $out ..."
        
        # -c:v libvpx-vp9: Use VP9 codec for WebM
        # -pix_fmt yuva420p: Preserve Alpha Channel
        # -b:v 1M: 1 Mbps bitrate (significantly reduces 50MB files)
        # -c:a libopus: Compress audio if exists
        # -auto-alt-ref 0: Helps with transparency rendering in VP9
        ffmpeg -y -i "$video" -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 1.5M -crf 30 -auto-alt-ref 0 -c:a libopus -b:a 96k "$out"
        
        Write-Host "✅ Created $out"
    } else {
        Write-Host "⚠️ File not found: $video"
    }
}
