#include "BruteForceDB.h"
#include <string>

template <typename K, typename V>

BruteForceDB<K,V>::BruteForceDB(){}

template <typename K, typename V>

BruteForceDB<K,V>::~BruteForceDB(){}

template <typename K, typename V>

void BruteForceDB<K,V>::insert(const K& key, const V& value){
    data.push_back({key, value});
}

template <typename K, typename V>

bool BruteForceDB<K,V>::search(const K& key, V& out_value) const{
    for(const auto& pair : data){
        if(pair.first == key){
            out_value = pair.second;
            return true;
        }
    }
    
    return false;
}

template <typename K, typename V>

bool BruteForceDB<K,V>::remove(const K& key){
    for(auto it = data.begin(); it != data.end(); ++it){
        if(it->first == key){
            data.erase(it);
            return true;
        }
    }
    
    return false;
}

template <typename K, typename V>

std::vector<std::pair<K,V>> BruteForceDB<K,V>::range_query(const K& start_key, const K& end_key) const{
    std::vector<std::pair<K,V>> result;
    
    for(const auto& pair : data){
        if(pair.first >= start_key && pair.first <= end_key){
            result.push_back(pair);
        }
    }
    
    return result;
}

template <typename K, typename V>
size_t BruteForceDB<K,V>::get_memory_usage() const{
    size_t usage = sizeof(BruteForceDB<K,V>);
    usage += data.capacity() * sizeof(std::pair<K,V>);
    for(const auto& pair : data){
        usage += pair.second.capacity();
    }
    return usage;
}

template class BruteForceDB<int, std::string>;