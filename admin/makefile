# Makefile for admin tools
# Author: Dr. Martín Raskovsky
# Date: April 2025
#
# Usage:
#   cd src/admin
#   make

all: constants tokenfactory libsections defs web3 sectionsummary nextcontracts contractabi

constants: generate_constants.js section-config.js
	@echo "🛠  Generating constants.generated.js..."
	node generate_constants.js
	fix_constants.sh

tokenfactory: generate_tokenfactory_map.js section-config.js
	@echo "🔧 Generating TokenFactory.generated.js..."
	node generate_tokenfactory_map.js

libsections: generate_libsections_keys.js section-config.js
	@echo "🔧 Generating libSections.generated.js..."
	node generate_libsections_keys.js

defs: generate_defs.js section-config.js
	@echo "🐪 Generating Defs.generated.pm..."
	node generate_defs.js
	fix_perl_defs.sh

web3: generate_web3_block.js section-config.js
	@echo "🐪 Generating libWeb3.generated.js..."
	node generate_web3_block.js

sectionsummary: generate_section_summary.js
	@echo "🐪 Generating SectionSummary.generated.pm..."
	generate_section_summary.js

nextcontracts: generate_contract_map_for_next.js section-config.js
	@echo "🟣 Generating contractMap.generated.js for Next.js..."
	node generate_contract_map_for_next.js

contractabi: generate_contract_abi_for_next.js section-config.js
	@echo "🧬 Generating contractAbi.generated.js..."
	node generate_contract_abi_for_next.js

clean:
	@echo "🧹 Cleaning generated files..."
	rm -f ../shared/constants.generated.js 
	rm -f ../lib/TokenFactory.generated.js
	rm -f ../lib/libSections.generated.js
	rm -f ../perl-lib/Defs.generated.pm
	rm -f ../lib/libWeb3.generated.js
	rm -f ../perl-lib/SectionSummary.generated.pm
	rm -f ../lib/TokenFactory.js.bak
	rm -f ../lib/libSections.js.bak
	rm -f ../lib/libWeb3.js.bak
	rm -f ../perl-lib/Defs.pm.bak
	rm -f ../perl-lib/SectionSummary.pm.bak
	rm -f ../shared/constants.js.bak
	rm -f ../next/lib/libDefs.js.bak
	rm -f ../next/generated/contractMap.js.bak
	rm -f ../next/generated/contractAbis.js.bak
	rm -f ../next/config/sectionSummaryConfig.js.bak
	rm -f ../shared/section-metadata.json.bak
