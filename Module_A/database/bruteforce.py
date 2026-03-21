import ctypes
import os
import platform

# =============================================================================
# Library Loading & Environment Setup
# =============================================================================

# Pre-load system libstdc++ to avoid version mismatches in environments like Conda
if platform.system() == "Linux":
    paths = [
        "/usr/lib/libstdc++.so.6",
        "/usr/lib/x86_64-linux-gnu/libstdc++.so.6"
    ]
    for path in paths:
        if os.path.exists(path):
            try:
                ctypes.CDLL(path, mode=ctypes.RTLD_GLOBAL)
                break
            except Exception:
                pass

# Load the shared library
_dir = os.path.dirname(os.path.abspath(__file__))
lib_path = os.path.join(_dir, "libdbms.so")
lib = ctypes.CDLL(lib_path)


# =============================================================================
# C-Types Function Definitions
# =============================================================================

lib.BruteForceDB_new.argtypes = []
lib.BruteForceDB_new.restype = ctypes.c_void_p

lib.BruteForceDB_delete.argtypes = [ctypes.c_void_p]

lib.BruteForceDB_insert.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_char_p]

lib.BruteForceDB_search.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_char_p, ctypes.c_int]
lib.BruteForceDB_search.restype = ctypes.c_bool

lib.BruteForceDB_remove.argtypes = [ctypes.c_void_p, ctypes.c_int]
lib.BruteForceDB_remove.restype = ctypes.c_bool

lib.BruteForceDB_range_query.argtypes = [ctypes.c_void_p, ctypes.c_int, ctypes.c_int, ctypes.POINTER(ctypes.c_int)]
lib.BruteForceDB_range_query.restype = ctypes.c_void_p

lib.Vector_get_key.argtypes = [ctypes.c_void_p, ctypes.c_int]
lib.Vector_get_key.restype = ctypes.c_int

lib.Vector_get_value.argtypes = [ctypes.c_void_p, ctypes.c_int]
lib.Vector_get_value.restype = ctypes.c_char_p

lib.Vector_delete.argtypes = [ctypes.c_void_p]

lib.BruteForceDB_get_memory_usage.argtypes = [ctypes.c_void_p]
lib.BruteForceDB_get_memory_usage.restype = ctypes.c_size_t


class BruteForceDB:
    """
    Python wrapper for the C++ BruteForceDB implementation.
    Maintains data in a linear vector for comparison purposes.
    """

    def __init__(self):
        self.db = lib.BruteForceDB_new()

    def __del__(self):
        if hasattr(self, 'db') and self.db:
            lib.BruteForceDB_delete(self.db)

    def insert(self, key, value="data"):
        lib.BruteForceDB_insert(self.db, key, str(value).encode('utf-8'))

    def search(self, key):
        out_value = ctypes.create_string_buffer(1024)
        if lib.BruteForceDB_search(self.db, key, out_value, 1024):
            return True
        return False

    def delete(self, key):
        return lib.BruteForceDB_remove(self.db, key)

    def range_query(self, start, end):
        count = ctypes.c_int()
        vec_ptr = lib.BruteForceDB_range_query(self.db, start, end, ctypes.byref(count))
        
        results = []
        for i in range(count.value):
            key = lib.Vector_get_key(vec_ptr, i)
            results.append(key)
            
        lib.Vector_delete(vec_ptr)
        return results

    def get_memory_usage(self):
        return lib.BruteForceDB_get_memory_usage(self.db)
