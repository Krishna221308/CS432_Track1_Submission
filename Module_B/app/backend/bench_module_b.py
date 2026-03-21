import time
import random
import psycopg2
import os
import sys

# Add the current directory to sys.path to import modules
sys.path.append(os.getcwd())
from bplustree import BPlusTree
from db import get_connection

def setup_benchmark_data(num_items=5000):
    """Ensure the database and B+ Tree are populated with consistent test data."""
    print(f"Populating database with {num_items} test lost items...")
    conn = get_connection()
    cur = conn.cursor()
    
    try:
        # Get valid order IDs to associate with lost items
        cur.execute("SELECT order_id FROM freshwash.laundry_order LIMIT 1000")
        order_ids = [r[0] for r in cur.fetchall()]
        
        if not order_ids:
            print("Error: No orders found in database. Run bulk_data_gen.py first.")
            return None, None

        # Clean old data to avoid interference
        cur.execute("DELETE FROM freshwash.lost_item WHERE item_description LIKE 'Test Item %'")
        
        # Insert test data
        items = []
        for i in range(1, num_items + 1):
            order_id = random.choice(order_ids)
            desc = f"Test Item {i}"
            comp = round(random.uniform(50, 500), 2)
            cur.execute(
                "INSERT INTO freshwash.lost_item (lost_id, order_id, item_description, compensation_amount) "
                "VALUES (%s, %s, %s, %s)",
                (i + 100000, order_id, desc, comp) # Offset IDs to avoid conflicts
            )
            items.append((i + 100000, desc))
            
        conn.commit()
        print("Database populated.")
        
        # Populate Module A B+ Tree
        print("Populating Module A B+ Tree index...")
        tree = BPlusTree(order=4)
        for lid, desc in items:
            tree.insert(lid, desc)
        print("B+ Tree populated.")
        
        return items, tree
        
    except Exception as e:
        conn.rollback()
        print(f"Error during setup: {e}")
        return None, None
    finally:
        cur.close()
        conn.close()

def run_benchmarks(items, tree):
    """Compare performance across different access methods."""
    num_tests = 500
    test_ids = [random.choice(items)[0] for _ in range(num_tests)]
    
    print(f"\nRunning {num_tests} search operations...")
    
    # 1. PostgreSQL (B-Tree Index Scan)
    conn = get_connection()
    cur = conn.cursor()
    start = time.perf_counter()
    for lid in test_ids:
        cur.execute("SELECT item_description FROM freshwash.lost_item WHERE lost_id = %s", (lid,))
        cur.fetchone()
    pg_time = (time.perf_counter() - start) * 1000
    print(f"PostgreSQL (B-Tree Index): {pg_time:.2f} ms total ({pg_time/num_tests:.4f} ms/op)")

    # 2. Module A B+ Tree (In-memory Index)
    start = time.perf_counter()
    for lid in test_ids:
        tree.search(lid)
    tree_time = (time.perf_counter() - start) * 1000
    print(f"Module A B+ Tree Index: {tree_time:.2f} ms total ({tree_time/num_tests:.4f} ms/op)")

    # 3. Range Query Comparison
    num_range_tests = 50
    range_ranges = []
    for _ in range(num_range_tests):
        start_id = random.randint(100001, 104000)
        end_id = start_id + 500
        range_ranges.append((start_id, end_id))

    print(f"\nRunning {num_range_tests} range queries (width 500)...")
    
    # PG Range
    start = time.perf_counter()
    for s, e in range_ranges:
        cur.execute("SELECT item_description FROM freshwash.lost_item WHERE lost_id BETWEEN %s AND %s", (s, e))
        cur.fetchall()
    pg_range_time = (time.perf_counter() - start) * 1000
    print(f"PostgreSQL Range: {pg_range_time:.2f} ms total ({pg_range_time/num_range_tests:.4f} ms/op)")

    # B+ Tree Range
    start = time.perf_counter()
    for s, e in range_ranges:
        tree.range_query(s, e)
    tree_range_time = (time.perf_counter() - start) * 1000
    print(f"Module A B+ Tree Range: {tree_range_time:.2f} ms total ({tree_range_time/num_range_tests:.4f} ms/op)")

    cur.close()
    conn.close()
    
    # Speedup Factors
    print(f"\nSpeedup (Search): {pg_time / tree_time:.1f}x faster using Module A Engine")
    print(f"Speedup (Range): {pg_range_time / tree_range_time:.1f}x faster using Module A Engine")

if __name__ == "__main__":
    items, tree = setup_benchmark_data(5000)
    if items:
        run_benchmarks(items, tree)
