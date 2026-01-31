<# 
.SYNOPSIS
  Displays previous commands.

.DESCRIPTION
  Displays the preivous commands that were used.

.FILE
  history.ps1

.NOTES
  Author: Daniel Ribeirinha-Braga
#>

Get-Content (Get-PSReadlineOption).HistorySavePath

