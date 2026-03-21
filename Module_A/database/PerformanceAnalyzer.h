#ifndef PERFORMANCEANALYZER_H
#define PERFORMANCEANALYZER_H
#include "BPlusTree.h"
#include "BruteForceDB.h"

class PerformanceAnalyzer {
public:
    void measure_insertion(int num_keys);
    void measure_search(int num_keys);
    void measure_deletion(int num_keys);
    void measure_range_query(int num_keys, int range_size);
    void track_memory_usage();
};

#endif