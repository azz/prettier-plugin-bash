#!/bin/bash

(
  git clone ... somedir
  cd somedir
  git log --oneline
  cd ..
  rm -rf somedir
)
