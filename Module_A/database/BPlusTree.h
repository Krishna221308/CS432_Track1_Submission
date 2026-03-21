#ifndef BPLUSTREE_H
#define BPLUSTREE_H

#include "Node.h"
#include <vector>
#include <string>
#include <utility>

template<typename K, typename V>
class BPlusTree{
private:
    BPlusTreeNode<K,V>* root;
    int order;

public:
    BPlusTree(int order);

    ~BPlusTree();

    bool search(const K& key, V& out_value) const;

    void insert(const K& key, const V& value);

    bool remove(const K& key);

    bool update(const K& key, const V& new_value);

    std::vector<std::pair<K, V>> range_query(const K& start_key, const K& end_key) const;

    std::vector<std::pair<K, V>> get_all() const;

    void visualize_tree() const;

    std::string get_dot() const;

    std::string get_json() const;

    size_t get_memory_usage() const;

    void _insert_non_full(BPlusTreeNode<K,V>* node, const K& key, const V& value);

    void _split_child(BPlusTreeNode<K,V>* parent, int index);

    void _delete(BPlusTreeNode<K,V>* node, const K& key);

    void _fill_child(BPlusTreeNode<K,V>* node, int index);

    void _borrow_from_prev(BPlusTreeNode<K,V>* node, int index);

    void _borrow_from_next(BPlusTreeNode<K,V>* node, int index);

    void _merge(BPlusTreeNode<K,V>* node, int index);

    void _add_nodes(std::string& dot, BPlusTreeNode<K,V>* node) const;

    void _add_edges(std::string& dot, BPlusTreeNode<K,V>* node) const;

    BPlusTreeNode<K,V>* get_root() const{
        return root;
    }
};

#endif
