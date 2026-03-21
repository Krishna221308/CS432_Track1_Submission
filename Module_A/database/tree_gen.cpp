#include "BPlusTree.h"
#include <iostream>

int main() {
    BPlusTree<int, std::string> btree(4);
    
    for(int i = 1; i <= 20; ++i){
        btree.insert(i*10, "data");
    }
    
    btree.visualize_tree();
    
    return 0;
}