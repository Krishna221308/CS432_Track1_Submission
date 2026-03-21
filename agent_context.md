# Agent Development Context - DBMS Assignment 2

## Project Overview
This project implements **Module A** of the DBMS Assignment: a high-performance B+ Tree indexing engine written in C++ with a beautiful, rigorous Python wrapper and performance analysis suite.

## Component Summary

### 1. C++ Core Engine
- **`BPlusTree.cpp/h`**: The main indexing logic. 
    - Implements $O(\log N)$ search, insert, and delete.
    - **Crucial Fixes**: Resolved a segmentation fault in `_delete` related to index shifting after node merges.
    - **Exposed Internals**: Internal methods (`_split_child`, `_merge`, etc.) are public to satisfy assignment requirements.
    - **Metadata**: Added `get_json()` for Python-side traversal and `get_memory_usage()` for recursive memory tracking.
- **`BruteForceDB.cpp/h`**: A linear $O(N)$ implementation for performance comparison.
- **`wrapper.cpp`**: C-style linkage for Python `ctypes`.

### 2. Python Linker Layer
- **`bplustree.py`**: The primary wrapper. 
    - **Stability Fix**: Pre-loads system `libstdc++.so.6` with `ctypes.RTLD_GLOBAL` to prevent kernel crashes in Conda/Jupyter environments.
    - **Visualization**: Uses `graphviz` with **HTML-like labels** for a professional tree look, including ports for child pointers and blue dashed lines for leaf-level links.
- **`bruteforce.py`**: Wrapper for the linear comparison database.

### 3. Application & Analysis
- **`table.py` & `db_manager.py`**: High-level abstractions for managing multiple tables.
- **`performance_analyzer.py`**: Rigorous benchmarking tool. 
    - Tests up to 100,000 keys.
    - Measures Insertion, Search, Deletion, and Range Query performance.
    - Exports results to `benchmark_results.csv`.
- **`report.ipynb`**: Jupyter notebook for visualization and reporting.

## Build & Execution Instructions

### Compilation
The shared library must be compiled with `fPIC`:
```bash
g++ -shared -o libdbms.so -fPIC BPlusTree.cpp BruteForceDB.cpp wrapper.cpp
```

### Execution
In environments with library version mismatches (like Conda), use `LD_PRELOAD`:
```bash
LD_PRELOAD=/usr/lib/libstdc++.so.6 python3 performance_analyzer.py
```
*Note: The Python wrappers now attempt to handle this pre-loading automatically for Jupyter stability.*

## Current Status
- **Module A**: 100% Complete.
- **Performance**: Verified $O(\log N)$ vs $O(N)$ scaling.
- **Visualization**: Verified stable rendering with Graphviz.
- **Module B**: Not yet started. Requires Web UI, RBAC, and Audit Logging.
