#!/bin/sh

# Converts the JSON output of getVaultsDetails.js to CSV format
# Usage: ./script.sh [-m min_balance] [-c contract_name] [-l limit]
# Defaults: min_balance = 4000, contract_name = CreatorVaultFactory, no limit

MIN_BALANCE=1000
CONTRACT="CreatorVaultFactory"
LIMIT=""
FULL="-F"
BSC="-bsc"
ETH=""

# Parse command-line arguments
while [ $# -gt 0 ]; do
    case "$1" in
        -m)
            MIN_BALANCE=$2
            shift 2
            ;;
        -c)
            CONTRACT=$2
            shift 2
            ;;
        -l)
            LIMIT="-l $2"
            shift 2
            ;;
        -F)
            FULL="-F"
            shift 1
            ;;
        -bsc)
            BSC="$1"
            shift 1
            ;;
        -eth)
            ETH="$1"
            shift 1
            ;;
        -h|--help)
            echo "Usage: $0 [-m min_balance] [-c contract_name] [-l limit]"
            exit 0
            ;;
        *)
            echo "Error: Unknown option $1"
            echo "Usage: $0 [-m min_balance] [-c contract_name] [-l limit]"
            exit 1
            ;;
    esac
done

#ARGS="-m $MIN_BALANCE -c $CONTRACT"
ARGS="-m $MIN_BALANCE"

echo "Running with arguments: $ARGS $FULL $BSC $ETH $LIMIT"

getVaultsDetails.js $ARGS $FULL $BSC $ETH $LIMIT
jsonDetails2Csv.js  $ARGS $FULL $BSC $ETH

