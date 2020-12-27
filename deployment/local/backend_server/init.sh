#!/bin/bash

npm install

while npm audit fix --force
do
    echo "audit fix"
done