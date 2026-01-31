<# 
.SYNOPSIS
  Git user setup.

.DESCRIPTION
  Script for setting up Git username and email.

.FILE
  git_init.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if ((-not $args[0]) -or (-not $args[1])) {
  return Write-Host "Error: Parameters missing`nUsage: git_init.ps1 [<username>] [<email>]"
}

git config --global user.name $args[0]
git config --global user.email $args[1]

