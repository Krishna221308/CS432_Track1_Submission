#ifndef BRUTEFORCEDB_H
#define BRUTEFORCEDB_H

#include <vector>
#include <utility>
#include <string>

template <typename K, typename V>
class BruteForceDB {
private:
    std::vector<std::pair<K, V>> data;

public:
    BruteForceDB(); 
    ~BruteForceDB();

    void insert(const K& key, const V& value);
    bool search(const K& key, V& out_value) const;
    bool remove(const K& key);
    std::vector<std::pair<K, V>> range_query(const K& start_key, const K& end_key) const;
    size_t get_memory_usage() const;
};

#endif