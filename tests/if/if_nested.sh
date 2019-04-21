#!/bin/bash

if $a; then
  if $b; then
    echo 'c'
  elif $c; then
    echo 'd'
  else 
    echo 'e'
  fi
elif $e; then
  echo 'f'
else
  echo 'g'
fi
