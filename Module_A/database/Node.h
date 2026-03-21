#ifndef NODE_H
#define NODE_H
#include <vector>

template <typename K, typename V>
struct BPlusTreeNode{
    bool leaf;
    std::vector<K> keys;
    std::vector<V> values;
    std::vector<BPlusTreeNode*> children;
    BPlusTreeNode* next;

    BPlusTreeNode(bool leaf): leaf(leaf), next(nullptr){}
};

#endif