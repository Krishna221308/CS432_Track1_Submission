from table import Table

class DBManager:
    """
    Manages multiple Table objects.
    Acts as the entry point for database operations.
    """

    def __init__(self):
        self.tables = {}


    def create_table(self, name, order=4):
        """Initializes a new table if it doesn't already exist."""
        if name in self.tables:
            print(f"Table '{name}' already exists.")
            return False
            
        self.tables[name] = Table(name, order)
        return True


    def get_table(self, name):
        """Retrieves a table object by name."""
        return self.tables.get(name)


    def list_tables(self):
        """Returns a list of all table names in the database."""
        return list(self.tables.keys())


    def delete_table(self, name):
        """Removes a table from the database management system."""
        if name in self.tables:
            del self.tables[name]
            return True
            
        return False
