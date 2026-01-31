<# 
.SYNOPSIS
  Git threads setup.

.DESCRIPTION
  Script for setting up the number of Git threads.

.FILE
  git_thread.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if ((-not $args[0])) {
  return Write-Host "Error: Parameters missing`nUsage: git_threads.ps1 [<threads>]"
}

git config --global pack.threads $args[0]

