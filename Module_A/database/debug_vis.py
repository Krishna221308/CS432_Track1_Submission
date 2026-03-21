from bplustree import BPlusTree
import os

# Ensure libstdc++ is pre-loaded correctly
# bplustree.py handles this.

def debug_vis():
    print("Testing B+ Tree visualization with HTML-like labels...")
    tree = BPlusTree(order=3)
    for k in [10, 20, 30, 40, 50]:
        tree.insert(k, f"v{k}")
    
    dot = tree.visualize_tree()
    print("Generated DOT Source:")
    print(dot.source)
    
    try:
        dot.render('debug_tree', format='png', cleanup=True)
        print("Successfully rendered debug_tree.png")
    except Exception as e:
        print(f"Failed to render: {e}")

if __name__ == "__main__":
    debug_vis()
