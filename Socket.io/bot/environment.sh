#!/bin/bash

config="secretStore: aws_sm
region: eu-west-1
secretName: $SECRET_NAME"

echo "$config" > ttkeysconfig.yaml