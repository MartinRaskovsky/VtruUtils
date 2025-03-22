#!/usr/bin/env perl

use strict;
use warnings;
use lib '../perl-lib';
use SectionSummary qw(getSectionSummary);

my $summary = getSectionSummary();

print "✅ Loaded SectionSummary successfully.\n";

foreach my $section (@$summary) {
    print "Section: $section->{name}\n";
    foreach my $s (@{ $section->{sections} }) {
        print "  - $s\n";
    }
}

