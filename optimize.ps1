# Compress Videos
Write-Host "Compressing 01.mp4..."
ffmpeg -y -v error -i "g:\Web design\Pesh AG2.0\public\hero\bgs\01.mp4" -c:v libx264 -preset ultrafast -crf 28 -vf scale=-1:1080 -c:a aac -b:a 128k "g:\Web design\Pesh AG2.0\public\hero\bgs\01_opt.mp4"

Write-Host "Compressing 02.mp4..."
ffmpeg -y -v error -i "g:\Web design\Pesh AG2.0\public\hero\bgs\02.mp4" -c:v libx264 -preset ultrafast -crf 28 -vf scale=-1:1080 -c:a aac -b:a 128k "g:\Web design\Pesh AG2.0\public\hero\bgs\02_opt.mp4"

# Compress Hero PNGs to WebP
Write-Host "Compressing Hero Images..."
$heroImgs = Get-ChildItem -Path "g:\Web design\Pesh AG2.0\public\hero" -Filter "*.png"
foreach ($img in $heroImgs) {
    $out = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    ffmpeg -y -v error -i $img.FullName -c:v libwebp -quality 80 $out
}

# Compress Stopmotion PNGs to WebP
Write-Host "Compressing Stopmotion Images..."
$stopImgs = Get-ChildItem -Path "g:\Web design\Pesh AG2.0\public\stopmotion" -Filter "*.png"
foreach ($img in $stopImgs) {
    $out = [System.IO.Path]::ChangeExtension($img.FullName, ".webp")
    ffmpeg -y -v error -i $img.FullName -c:v libwebp -quality 80 $out
}

Write-Host "Optimization Complete!"
