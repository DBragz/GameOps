@REM Name:     git_threads.bat
@REM Author:   Daniel Ribeirinha-Braga
@REM Purpose:  Script for setting up the number of Git threads.

@echo off

if [%1]==[] (
  echo Error: Parameters missing
  echo usage: git_threads.bat [threads]
  goto :eof
)

git config --global pack.threads %1

