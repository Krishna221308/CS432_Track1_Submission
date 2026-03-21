from performance_analyzer import PerformanceAnalyzer
import os

# Ensure we use the correct libstdc++ if needed, 
# though bplustree.py now handles this internally.

def debug():
    print("Starting small-scale benchmark for debugging...")
    # Test with very small numbers to see if it crashes during splits/merges
    analyzer = PerformanceAnalyzer(range(10, 101, 10))
    try:
        analyzer.run_benchmarks()
        analyzer.save_to_csv('debug_results.csv')
        print("Benchmark completed successfully without crashing.")
    except Exception as e:
        print(f"Benchmark failed with error: {e}")

if __name__ == "__main__":
    debug()
