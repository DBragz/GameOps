<#
.SYNOPSIS
  Previous command searcher.

.DESCRIPTION
  Searches through previous commands for a specific string.

.FILE
  search_history.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

if (-not $args[0]) {
  return Write-Host "Error: No search string provided`nUsage: search-history.ps1 [<SearchSring>]"
}

& "$PSScriptRoot\history.ps1" | Select-String -Pattern $args[0]

