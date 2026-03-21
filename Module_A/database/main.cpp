#include "PerformanceAnalyzer.h"
#include <iostream>

int main() {
    PerformanceAnalyzer analyzer;

    std::cout << "Operation,NumKeys,BPlusTreeTime,BruteForceTime\n";

    for (int i = 100; i <= 100000; i += 1000) {
        analyzer.measure_insertion(i);
        analyzer.measure_search(i);
        analyzer.measure_deletion(i);
        analyzer.measure_range_query(i, i / 10);
    }

    analyzer.track_memory_usage();

    return 0;
}