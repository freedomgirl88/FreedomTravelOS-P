<#
Upload a file to a GitHub release by tag using the GITHUB_TOKEN environment variable.

Usage:
  $env:GITHUB_TOKEN = "ghp_xxx";
  .\scripts\upload_release_asset.ps1 -Repo "freedomgirl88/FreedomTravelOS" -Tag "v1.0.0" -File "release/FreedomTravelOS_v1.0.0_web.zip"

Requirements: PowerShell 7+ or Windows PowerShell with Invoke-RestMethod supporting -InFile.
#>

param(
    [Parameter(Mandatory=$true)] [string]$Repo,
    [Parameter(Mandatory=$true)] [string]$Tag,
    [Parameter(Mandatory=$true)] [string]$File
)

if (-not $env:GITHUB_TOKEN) {
    Write-Error "GITHUB_TOKEN environment variable is not set. Export a PAT with repo scope into GITHUB_TOKEN."
    exit 1
}

if (-not (Test-Path $File)) {
    Write-Error "File not found: $File"
    exit 1
}

$headers = @{ Authorization = "token $env:GITHUB_TOKEN"; "User-Agent" = "upload-release-asset-script" }

try {
    $release = Invoke-RestMethod -Headers $headers -Uri "https://api.github.com/repos/$Repo/releases/tags/$Tag" -Method Get -ErrorAction Stop
} catch {
    Write-Error "Failed to find release tag $Tag in $Repo. Create the release first or check the tag name. $_"
    exit 1
}

$upload_url = $release.upload_url -replace '\{\?name,label\}',''
$filename = (Get-Item $File).Name

$contentType = 'application/octet-stream'
if ($File.ToLower().EndsWith('.zip')) { $contentType = 'application/zip' }
elseif ($File.ToLower().EndsWith('.apk')) { $contentType = 'application/vnd.android.package-archive' }

Write-Output "Uploading $filename to release $Tag..."

Invoke-RestMethod -Headers @{ Authorization = "token $env:GITHUB_TOKEN"; "User-Agent"="upload-release-asset-script" } -Uri "$upload_url?name=$filename" -Method Post -InFile $File -ContentType $contentType -ErrorAction Stop

Write-Output "Upload complete: $filename"
