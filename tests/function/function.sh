#!/bin/bash

foo() {
  echo 'foo'
}

bar() {
  echo 'bar'
}

baz() {
  local x="$1"
  echo "x = $x"
  echo "args = $*"
}
