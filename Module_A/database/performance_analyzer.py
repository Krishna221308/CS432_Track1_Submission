import time
import random
import csv
from bplustree import BPlusTree
from bruteforce import BruteForceDB

class PerformanceAnalyzer:
    """
    Benchmarks the B+ Tree engine against a BruteForceDB approach.
    Tracks time and memory metrics for common DB operations.
    """

    def __init__(self, key_ranges=None):
        if key_ranges is None:
            self.key_ranges = range(100, 10001, 1000)
        else:
            self.key_ranges = key_ranges
        self.results = []


    def run_benchmarks(self):
        """Executes full benchmark suite across all operation types."""
        print(f"{'NumKeys':<10} | {'Status'}")
        print("-" * 30)
        
        for num_keys in self.key_ranges:
            keys = random.sample(range(num_keys * 10), num_keys)
            
            # --- Benchmark Insertion ---
            btree = BPlusTree(order=4)
            bfdb = BruteForceDB()
            
            start = time.perf_counter()
            for k in keys:
                btree.insert(k, f"val{k}")
            btree_insert_time = (time.perf_counter() - start) * 1000
            
            start = time.perf_counter()
            for k in keys:
                bfdb.insert(k, f"val{k}")
            bfdb_insert_time = (time.perf_counter() - start) * 1000
            
            btree_mem = btree.get_memory_usage() / 1024
            bfdb_mem = bfdb.get_memory_usage() / 1024
            
            self._log_result(num_keys, "Insert", btree_insert_time, bfdb_insert_time, btree_mem, bfdb_mem)
            
            # --- Benchmark Search ---
            search_keys = random.sample(keys, min(100, num_keys))
            
            start = time.perf_counter()
            for k in search_keys:
                btree.search(k)
            btree_search_time = (time.perf_counter() - start) * 1000 / len(search_keys) * num_keys
            
            start = time.perf_counter()
            for k in search_keys:
                bfdb.search(k)
            bfdb_search_time = (time.perf_counter() - start) * 1000 / len(search_keys) * num_keys
            
            self._log_result(num_keys, "Search", btree_search_time, bfdb_search_time, btree_mem, bfdb_mem)
            
            # --- Benchmark Range Query ---
            ranges = []
            for _ in range(10):
                s = random.choice(keys)
                e = s + random.randint(10, 100)
                ranges.append((s, e))
                
            start = time.perf_counter()
            for s, e in ranges:
                btree.range_query(s, e)
            btree_range_time = (time.perf_counter() - start) * 1000 / 10
            
            start = time.perf_counter()
            for s, e in ranges:
                bfdb.range_query(s, e)
            bfdb_range_time = (time.perf_counter() - start) * 1000 / 10
            
            self._log_result(num_keys, "Range", btree_range_time, bfdb_range_time, btree_mem, bfdb_mem)

            # --- Benchmark Deletion ---
            del_keys = random.sample(keys, min(100, num_keys))
            
            start = time.perf_counter()
            for k in del_keys:
                btree.delete(k)
            btree_del_time = (time.perf_counter() - start) * 1000 / len(del_keys) * num_keys
            
            start = time.perf_counter()
            for k in del_keys:
                bfdb.delete(k)
            bfdb_del_time = (time.perf_counter() - start) * 1000 / len(del_keys) * num_keys
            
            self._log_result(num_keys, "Delete", btree_del_time, bfdb_del_time, btree_mem, bfdb_mem)
            
            print(f"{num_keys:<10} | Done")


    def _log_result(self, num_keys, op, btree_time, bfdb_time, btree_mem, bfdb_mem):
        self.results.append({
            "NumKeys": num_keys,
            "Operation": op,
            "BPlusTreeTime": btree_time,
            "BruteForceTime": bfdb_time,
            "BPlusTreeMem": btree_mem,
            "BruteForceMem": bfdb_mem
        })


    def save_to_csv(self, filename="benchmark_results.csv"):
        if not self.results:
            return
            
        keys = self.results[0].keys()
        with open(filename, 'w', newline='') as f:
            dict_writer = csv.DictWriter(f, fieldnames=keys)
            dict_writer.writeheader()
            dict_writer.writerows(self.results)


if __name__ == "__main__":
    # Rigorous benchmark up to 100,000 keys
    analyzer = PerformanceAnalyzer(range(1000, 100001, 10000))
    analyzer.run_benchmarks()
    analyzer.save_to_csv()
