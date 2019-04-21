#!/bin/bash

z=$(($z+3))

let z=z+3
let z=z-3
let z=z/3
let z=z*3
let z=z%3
let z=z**3

# TODO: Parser bug (parsed as double subshell)
# (( n += 1 ))
