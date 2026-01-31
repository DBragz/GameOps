<# 
.SYNOPSIS
  Git proxy setup.

.DESCRIPTION
  Script for setting up Git proxy.

.FILE
  git_proxy.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if ((-not $args[0])) {
  return Write-Host "Error: Parameters missing`nUsage: git_proxy.ps1 [<proxy>]"
}

git config --global http.proxy $args[0]
git config --global https.proxy $args[0]

