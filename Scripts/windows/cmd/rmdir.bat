@REM Name:     rmdir.bat
@REM Author:   Daniel Ribeirinha-Braga
@REM Purpose:  Script for removing directory and all subdirectories.

@echo off

if [%1]==[] (
  echo Error: Parameters missing
  echo usage: rmdir.bat [directory] 
  goto :eof
)

rmdir /s %1

