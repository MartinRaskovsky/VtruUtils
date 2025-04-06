# Makefile for admin tools
# Author: Dr. Martín Raskovsky
# Date: April 2025
#
# Usage:
#   cd src/admin
#   make

all: constants tokenfactory libsections perldefs web3 sectionsummary

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

perldefs: generate_perl_defs.js section-config.js
	@echo "🐪 Generating Defs.generated.pm..."
	node generate_perl_defs.js
	fix_perl_defs.sh

web3: generate_web3_block.js section-config.js
	@echo "🐪 Generating libWeb3.generated.js..."
	node generate_web3_block.js

sectionsummary: generate_section_summary.js
	@echo "🐪 Generating SectionSummary.generated.pm..."
	generate_section_summary.js

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

