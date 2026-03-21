from bplustree import BPlusTree

class Table:
    """
    Table abstraction using a B+ Tree for primary indexing.
    Supports basic CRUD and range operations.
    """

    def __init__(self, name, order=4):
        self.name = name
        self.index = BPlusTree(order)


    def insert(self, key, record):
        self.index.insert(key, record)


    def search(self, key):
        return self.index.search(key)


    def delete(self, key):
        return self.index.delete(key)


    def update(self, key, new_record):
        return self.index.update(key, new_record)


    def range_query(self, start_key, end_key):
        return self.index.range_query(start_key, end_key)


    def get_all(self):
        return self.index.get_all()


    def visualize(self):
        """Displays the B+ Tree structure for this table."""
        return self.index.visualize_tree()
