#include "PerformanceAnalyzer.h"
#include <iostream>
#include <chrono>
#include <random>
#include <vector>

using namespace std::chrono;

void PerformanceAnalyzer::measure_insertion(int num_keys){
    BPlusTree<int, std::string> btree(4);
    BruteForceDB<int, std::string> brute;
    std::vector<int> keys;

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, num_keys * 10);

    for(int i = 0; i < num_keys; ++i){
        keys.push_back(dis(gen));
    }

    auto start_btree = high_resolution_clock::now();
    for(int key : keys){
        btree.insert(key, "data");
    }
    auto stop_btree = high_resolution_clock::now();
    auto duration_btree = duration_cast<microseconds>(stop_btree - start_btree);

    auto start_brute = high_resolution_clock::now();
    for(int key : keys){
        brute.insert(key, "data");
    }
    auto stop_brute = high_resolution_clock::now();
    auto duration_brute = duration_cast<microseconds>(stop_brute - start_brute);

    std::cout << "Insert," << num_keys << "," << duration_btree.count() << "," << duration_brute.count() << "\n";
}

void PerformanceAnalyzer::measure_search(int num_keys){
    BPlusTree<int, std::string> btree(4);
    BruteForceDB<int, std::string> brute;
    std::vector<int> keys;

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, num_keys * 10);

    for(int i = 0; i < num_keys; ++i){
        int k = dis(gen);
        keys.push_back(k);
        btree.insert(k, "data");
        brute.insert(k, "data");
    }

    std::string out_val;
    auto start_btree = high_resolution_clock::now();
    for(int key : keys){
        btree.search(key, out_val);
    }
    auto stop_btree = high_resolution_clock::now();
    auto duration_btree = duration_cast<microseconds>(stop_btree - start_btree);

    auto start_brute = high_resolution_clock::now();
    for(int key : keys){
        brute.search(key, out_val);
    }
    auto stop_brute = high_resolution_clock::now();
    auto duration_brute = duration_cast<microseconds>(stop_brute - start_brute);

    std::cout << "Search," << num_keys << "," << duration_btree.count() << "," << duration_brute.count() << "\n";
}

void PerformanceAnalyzer::measure_deletion(int num_keys){
    BPlusTree<int, std::string> btree(4);
    BruteForceDB<int, std::string> brute;
    std::vector<int> keys;

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, num_keys * 10);

    for(int i = 0; i < num_keys; ++i){
        int k = dis(gen);
        keys.push_back(k);
        btree.insert(k, "data");
        brute.insert(k, "data");
    }

    auto start_btree = high_resolution_clock::now();
    for(int key : keys){
        btree.remove(key);
    }
    auto stop_btree = high_resolution_clock::now();
    auto duration_btree = duration_cast<microseconds>(stop_btree - start_btree);

    auto start_brute = high_resolution_clock::now();
    for(int key : keys){
        brute.remove(key);
    }
    auto stop_brute = high_resolution_clock::now();
    auto duration_brute = duration_cast<microseconds>(stop_brute - start_brute);

    std::cout << "Delete," << num_keys << "," << duration_btree.count() << "," << duration_brute.count() << "\n";
}

void PerformanceAnalyzer::measure_range_query(int num_keys, int range_size){
    BPlusTree<int, std::string> btree(4);
    BruteForceDB<int, std::string> brute;

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> dis(1, num_keys * 10);

    for(int i = 0; i < num_keys; ++i){
        int k = dis(gen);
        btree.insert(k, "data");
        brute.insert(k, "data");
    }

    int start_key = dis(gen);
    int end_key = start_key + range_size;

    auto start_btree = high_resolution_clock::now();
    btree.range_query(start_key, end_key);
    auto stop_btree = high_resolution_clock::now();
    auto duration_btree = duration_cast<microseconds>(stop_btree - start_btree);

    auto start_brute = high_resolution_clock::now();
    brute.range_query(start_key, end_key);
    auto stop_brute = high_resolution_clock::now();
    auto duration_brute = duration_cast<microseconds>(stop_brute - start_brute);

    std::cout << "Range," << num_keys << "," << duration_btree.count() << "," << duration_brute.count() << "\n";
}

void PerformanceAnalyzer::track_memory_usage(){
    int btree_node_size = sizeof(BPlusTreeNode<int, std::string>);
    int brute_pair_size = sizeof(std::pair<int, std::string>);
    
    std::cout << "Memory,NodeBytes," << btree_node_size << ",PairBytes," << brute_pair_size << "\n";
}