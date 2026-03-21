#include "BPlusTree.h"
#include "BruteForceDB.h"
#include <string>
#include <vector>
#include <cstring>

extern "C" {

    // BPlusTree Basic Operations
    BPlusTree<int, std::string>* BPlusTree_new(int order){
        return new BPlusTree<int, std::string>(order);
    }

    void BPlusTree_delete(BPlusTree<int, std::string>* tree){
        delete tree;
    }

    void BPlusTree_insert(BPlusTree<int, std::string>* tree, int key, const char* value){
        tree->insert(key, std::string(value));
    }

    bool BPlusTree_search(BPlusTree<int, std::string>* tree, int key, char* out_value, int max_len){
        std::string val;
        if(tree->search(key, val)){
            strncpy(out_value, val.c_str(), max_len - 1);
            out_value[max_len - 1] = '\0';
            return true;
        }
        return false;
    }

    bool BPlusTree_remove(BPlusTree<int, std::string>* tree, int key){
        return tree->remove(key);
    }

    bool BPlusTree_update(BPlusTree<int, std::string>* tree, int key, const char* new_value){
        return tree->update(key, std::string(new_value));
    }

    // BPlusTree Internal Logic (Publicly exposed)
    void* BPlusTree_get_root(BPlusTree<int, std::string>* tree){
        return tree->get_root();
    }

    void BPlusTree__insert_non_full(BPlusTree<int, std::string>* tree, void* node, int key, const char* value){
        tree->_insert_non_full(static_cast<BPlusTreeNode<int, std::string>*>(node), key, std::string(value));
    }

    void BPlusTree__split_child(BPlusTree<int, std::string>* tree, void* parent, int index){
        tree->_split_child(static_cast<BPlusTreeNode<int, std::string>*>(parent), index);
    }

    void BPlusTree__delete(BPlusTree<int, std::string>* tree, void* node, int key){
        tree->_delete(static_cast<BPlusTreeNode<int, std::string>*>(node), key);
    }

    void BPlusTree__fill_child(BPlusTree<int, std::string>* tree, void* node, int index){
        tree->_fill_child(static_cast<BPlusTreeNode<int, std::string>*>(node), index);
    }

    void BPlusTree__borrow_from_prev(BPlusTree<int, std::string>* tree, void* node, int index){
        tree->_borrow_from_prev(static_cast<BPlusTreeNode<int, std::string>*>(node), index);
    }

    void BPlusTree__borrow_from_next(BPlusTree<int, std::string>* tree, void* node, int index){
        tree->_borrow_from_next(static_cast<BPlusTreeNode<int, std::string>*>(node), index);
    }

    void BPlusTree__merge(BPlusTree<int, std::string>* tree, void* node, int index){
        tree->_merge(static_cast<BPlusTreeNode<int, std::string>*>(node), index);
    }

    // Results Handling
    void* BPlusTree_range_query(BPlusTree<int, std::string>* tree, int start_key, int end_key, int* out_count){
        auto results = tree->range_query(start_key, end_key);
        *out_count = results.size();
        return new std::vector<std::pair<int, std::string>>(std::move(results));
    }

    void* BPlusTree_get_all(BPlusTree<int, std::string>* tree, int* out_count){
        auto results = tree->get_all();
        *out_count = results.size();
        return new std::vector<std::pair<int, std::string>>(std::move(results));
    }

    int Vector_get_key(void* vec_ptr, int index){
        auto* vec = static_cast<std::vector<std::pair<int, std::string>>*>(vec_ptr);
        return (*vec)[index].first;
    }

    const char* Vector_get_value(void* vec_ptr, int index){
        auto* vec = static_cast<std::vector<std::pair<int, std::string>>*>(vec_ptr);
        return (*vec)[index].second.c_str();
    }

    void Vector_delete(void* vec_ptr){
        delete static_cast<std::vector<std::pair<int, std::string>>*>(vec_ptr);
    }

    // Metadata & Visualisation
    const char* BPlusTree_get_dot(BPlusTree<int, std::string>* tree){
        static std::string last_dot;
        last_dot = tree->get_dot();
        return last_dot.c_str();
    }

    const char* BPlusTree_get_json(BPlusTree<int, std::string>* tree){
        static std::string last_json;
        last_json = tree->get_json();
        return last_json.c_str();
    }

    size_t BPlusTree_get_memory_usage(BPlusTree<int, std::string>* tree){
        return tree->get_memory_usage();
    }

    // BruteForceDB Wrappers
    BruteForceDB<int, std::string>* BruteForceDB_new(){
        return new BruteForceDB<int, std::string>();
    }

    void BruteForceDB_delete(BruteForceDB<int, std::string>* db){
        delete db;
    }

    void BruteForceDB_insert(BruteForceDB<int, std::string>* db, int key, const char* value){
        db->insert(key, std::string(value));
    }

    bool BruteForceDB_search(BruteForceDB<int, std::string>* db, int key, char* out_value, int max_len){
        std::string val;
        if(db->search(key, val)){
            strncpy(out_value, val.c_str(), max_len - 1);
            out_value[max_len - 1] = '\0';
            return true;
        }
        return false;
    }

    bool BruteForceDB_remove(BruteForceDB<int, std::string>* db, int key){
        return db->remove(key);
    }

    void* BruteForceDB_range_query(BruteForceDB<int, std::string>* db, int start_key, int end_key, int* out_count){
        auto results = db->range_query(start_key, end_key);
        *out_count = results.size();
        return new std::vector<std::pair<int, std::string>>(std::move(results));
    }

    size_t BruteForceDB_get_memory_usage(BruteForceDB<int, std::string>* db){
        return db->get_memory_usage();
    }
}
