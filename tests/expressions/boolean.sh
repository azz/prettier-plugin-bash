#!/bin/bash

foo && bar

foo && bar || baz

foo || bar || baz

foo && {
  bar
  baz
}

foo || {
  bar
}
