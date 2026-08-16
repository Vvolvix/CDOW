Add-Type -AssemblyName System.Drawing

$srcDir = "C:\Users\moham\.zcode\workspace\default\CDOW\public\img\cases"
$files = Get-ChildItem -Path $srcDir -Filter "*.png"
Write-Host "Optimizing $($files.Count) case images..."

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
$encoder = [System.Drawing.Imaging.Encoder]::Quality
$encoderParams = New-Object System.Drawing.Imaging.EncoderParameters(1)
$encoderParams.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter($encoder, 82L)

foreach ($f in $files) {
    try {
        $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
        $ms = New-Object System.IO.MemoryStream(,$bytes)
        $bmp = [System.Drawing.Image]::FromStream($ms)

        $newW = 340
        $newH = [int]($bmp.Height * ($newW / $bmp.Width))
        $resized = New-Object System.Drawing.Bitmap($newW, $newH)
        $g = [System.Drawing.Graphics]::FromImage($resized)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.DrawImage($bmp, 0, 0, $newW, $newH)

        $bmp.Dispose()
        $ms.Dispose()
        $g.Dispose()

        $outJpg = $f.FullName -replace '\.png$', '.jpg'
        $outPng = $f.FullName

        # Save lightweight JPG (~30KB)
        $resized.Save($outJpg, $jpegCodec, $encoderParams)
        
        # Save optimized PNG (~90KB)
        $resized.Save($outPng, [System.Drawing.Imaging.ImageFormat]::Png)
        $resized.Dispose()
        
        Write-Host "Optimized: $($f.Name)"
    } catch {
        Write-Host "Error optimizing $($f.Name): $_"
    }
}

Write-Host "Done optimizing all case images!"
