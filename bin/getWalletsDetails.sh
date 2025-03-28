#!/bin/sh

# Converts the JSON output of getVaultsDetails.js to CSV format.
# Usage: ./getVaultsDetails.sh [-m min_balance] [-c contract_name] [-l limit]
# Defaults: min_balance = 1000, contract_name = CreatorVaultFactory, no limit.

MIN_BALANCE=1000
CONTRACT="CreatorVaultFactory"
LIMIT=""
FULL="-F"
BSC="-bsc"
ETH="-eth"
DECIMALS="-D"

# Parse command-line arguments
while [ $# -gt 0 ]; do
    case "$1" in
        -m)
            if [ -n "$2" ] && [ "$2" -eq "$2" ] 2>/dev/null; then
                MIN_BALANCE=$2
                shift 2
            else
                echo "❌ Error: Invalid value for -m (min_balance). Must be a number."
                exit 1
            fi
            ;;
        -c)
            if [ -n "$2" ]; then
                CONTRACT=$2
                shift 2
            else
                echo "❌ Error: Missing contract name after -c."
                exit 1
            fi
            ;;
        -D)
            DECIMALS="-D"
            shift 1
            ;;
        -l)
            if [ -n "$2" ] && [ "$2" -eq "$2" ] 2>/dev/null; then
                LIMIT="-l $2"
                shift 2
            else
                echo "❌ Error: Invalid value for -l (limit). Must be a number."
                exit 1
            fi
            ;;
        -F)
            FULL="-F"
            shift 1
            ;;
        -bsc)
            BSC="-bsc"
            shift 1
            ;;
        -eth)
            ETH="-eth"
            shift 1
            ;;
        -h|--help)
            echo "Usage: $0 [-m min_balance] [-c contract_name] [-l limit] [-F] [-bsc] [-eth] [-D]"
            exit 0
            ;;
        *)
            echo "❌ Error: Unknown option '$1'"
            echo "Usage: $0 [-m min_balance] [-c contract_name] [-l limit] [-F] [-bsc] [-eth] [-D]"
            exit 1
            ;;
    esac
done

ARGS="-m $MIN_BALANCE"

# Check if required scripts exist
if ! command -v getVaultsDetails.js >/dev/null 2>&1; then
    echo "❌ Error: getVaultsDetails.js not found or not executable."
    exit 1
fi

if ! command -v jsonDetails2Csv.js >/dev/null 2>&1; then
    echo "❌ Error: jsonDetails2Csv.js not found or not executable."
    exit 1
fi

# Run getVaultsDetails.js
echo "🚀 Running: getVaultsDetails.js $ARGS $FULL $BSC $ETH $LIMIT"
getVaultsDetails.js $ARGS $FULL $BSC $ETH $LIMIT

if [ $? -ne 0 ]; then
    echo "❌ Error: getVaultsDetails.js execution failed."
    exit 1
fi

# Run jsonDetails2Csv.js
echo "🚀 Running: jsonDetails2Csv.js $ARGS $FULL $BSC $ETH $DECIMALS"
jsonDetails2Csv.js $ARGS $FULL $BSC $ETH $DECIMALS

if [ $? -ne 0 ]; then
    echo "❌ Error: jsonDetails2Csv.js execution failed."
    exit 1
fi

echo "✅ Conversion process completed successfully!"
