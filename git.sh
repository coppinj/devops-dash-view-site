#!/bin/bash

git config core.filemode false
git submodule foreach --recursive git config core.filemode false
