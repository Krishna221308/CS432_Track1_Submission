CS 432 Databases - Assignment 2: Application Development and Database Index Structure Implementation

Deadline: 6:00 PM, 22 March 2026 Instructor: Dr. Yogesh K. Meena Total Marks: 100 (Module A: 40, Module B: 60) 
Overview

The assignment transitions from database design to active implementation through two independent modules.

    Module A (The Engine): Build a lightweight DBMS B+ Tree indexing engine from scratch in Python.

    Module B (The Interface): Develop a secure, optimized local web application with an API layer and Role-Based Access Control (RBAC).

Module A: Lightweight DBMS with B+ Tree Index (40 Marks)
Core Requirements

    Implement a B+ Tree from scratch in Python to act as the indexing engine.

    Insertion: Insert keys while ensuring automatic node splitting.

    Deletion: Remove keys with proper merging and redistribution.

    Exact Search: Check if a key exists.

    Range Queries: Retrieve all keys within a specific range.

    Value Storage: Associate values (table records) with the tree keys.

Benchmarking & Analysis

    Compare the B+ Tree against a linear "Brute ForceDB" approach.

    Measure and compare insertion time, search time, deletion time, range query time, and memory usage .

    Conduct automated benchmarking using random key sets (e.g., range(100, 100000, 1000)).

    Visualize the benchmarking results using Matplotlib plots.

Visualization

    Use graphviz (specifically graphviz.Digraph) to visualize the tree.

    The visualization must show the hierarchy of internal/leaf nodes, parent-child relationships, and highlight the linked-list connections in the leaf nodes .

Deliverables for Module A

    Source Code: db_manager.py, table.py, bplustree.py, bruteforce.py, requirements.txt.

    report.ipynb: A Jupyter Notebook containing the introduction, implementation details, benchmarking graphs/tables, tree visualizations, and conclusion .

    Video Demonstration: A 3-5 minute screen capture with audio explaining the code, demonstrating operations, showing Graphviz visuals, and explaining the Matplotlib performance graphs . Provide an unlisted YouTube or Google Drive link.

Module B: Local API Development, RBAC, and Database Optimisation (60 Marks)
Core Requirements

    Tech Stack: You may choose your preferred backend language, local server environment, and directory structure.

    Local DB Setup: Initialize a local database handling your Task 1 project-specific tables and core system data (members, credentials). Do not duplicate core data inside project tables.

    API & UI: Develop a web UI and local REST APIs for CRUD operations on your tables. Include a "Member Portfolio" feature restricted to authenticated users.

    Security & RBAC: APIs must validate sessions locally. Enforce RBAC: Admins get full access, Regular Users get restricted/read-only access .

    Audit Logging: Database modifications must be logged locally to a file (e.g., audit.log) or table. Unauthorized direct database modifications must be identifiable.

SQL Indexing & Optimisation

    Identify slow or frequently accessed API endpoints.

    Apply SQL indexing (single, composite, or unique) targeting WHERE, JOIN, or ORDER BY clauses.

    Quantitatively measure API and SQL execution times before and after indexing .

    Use the EXPLAIN statement to document how the access plan changed.

Deliverables for Module B

    Source Code: Complete code for UI, APIs, auth logic, and SQL creation scripts.

    Security Logs: The audit.log files showing session validation and unauthorized modifications.

    Optimisation Report (PDF or .ipynb): Document schema design, security implementation, indexing strategy, and before/after performance benchmarks .

    Video Demonstration: A 3-5 minute video with audio narrating the UI/API functionality, RBAC constraints, and the logging mechanism .

Submission Guidelines

    Submit a single private GitHub repository link.

    Organize into separate Module_A and Module_B folders.

Appendix Code Boilerplates

A. bplustree.py 
Python

class BPlusTree:
    def search(self, key): pass
    def insert(self, key, value): pass
    def _insert_non_full(self, node, key, value): pass
    def _split_child(self, parent, index): pass
    def delete(self, key): pass
    def _delete(self, node, key): pass
    def _fill_child(self, node, index): pass
    def _borrow_from_prev(self, node, index): pass
    def _borrow_from_next(self, node, index): pass
    def _merge(self, node, index): pass
    def update(self, key, new_value): pass
    def range_query(self, start_key, end_key): pass
    def get_all(self): pass
    def visualize_tree(self): pass
    def _add_nodes(self, dot, node): pass
    def _add_edges(self, dot, node): pass

B. bruteforce.py 
Python

class BruteForceDB:
    def __init__(self):
        self.data = []

    def insert(self, key):
        self.data.append(key)

    def search(self, key):
        return key in self.data

    def delete(self, key):
        if key in self.data:
            self.data.remove(key)

    def range_query(self, start, end):
        return [k for k in self.data if start <= k <= end]

C. API Documentation Requirements 

    /login (POST): Accepts JSON user and password. Returns 200 with a session_token or 401 on failure.

    /isAuth (GET): Checks session_token. Returns 200 with user role details or 401 if invalid/expired.

    / (GET): Welcome endpoint. Returns 200 with a welcome message.

Copy that text above and drop it into a new chat. Do you want me to start mapping out the pure Python implementation of the bplustree.py methods while you do that?