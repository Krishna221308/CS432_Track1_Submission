# FreshWash Database Setup Guide

## Prerequisites
- PostgreSQL 15+ installed and running
- psql command-line tool available

## Setup Steps

### 1. Start PostgreSQL Service (if not running)
```bash
# macOS
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo service postgresql start
sudo systemctl start postgresql

# Linux (Fedora/RHEL)
sudo systemctl start postgresql
```

### 2. Connect to PostgreSQL as superuser
```bash
psql -U postgres
```
You'll be prompted for the password. Default is usually blank or "postgres".

### 3. Inside psql, create the database
```sql
-- Create the database
CREATE DATABASE freshwashdb
    ENCODING    = 'UTF8'
    LC_COLLATE  = 'en_US.UTF-8'
    LC_CTYPE    = 'en_US.UTF-8'
    TEMPLATE    = template0;

-- Connect to the database
\c freshwashdb
```

### 4. Load the schema
Back in your terminal (exit psql if needed):
```bash
psql -U postgres -d freshwashdb -f sql/schema.sql
```

Or while still in psql:
```sql
\i sql/schema.sql
```

### 5. Verify the setup
```sql
-- Connect to freshwashdb
\c freshwashdb

-- List all tables
\dt freshwash.*

-- Check if data was loaded
SELECT COUNT(*) FROM freshwash.users;
```

You should see at least 6 users (1 admin + 2 users + 3 employees).

## Quick One-Liner Setup (if PostgreSQL is running)
```bash
psql -U postgres -c "CREATE DATABASE freshwashdb ENCODING 'UTF8';" && \
psql -U postgres -d freshwashdb -f sql/schema.sql && \
echo "✓ Database initialized successfully!"
```

## Connection Details
- **Host:** localhost
- **Port:** 5432 (default)
- **Database:** freshwashdb
- **User:** postgres
- **Password:** mypassword (as per db.py config)

## Troubleshooting

### Members/employee assignment column missing (after pulling new code)
If you created the DB earlier, your database may not include the newer `assigned_employee_id` column yet.
Run:

```sql
ALTER TABLE freshwash.member
  ADD COLUMN IF NOT EXISTS assigned_employee_id INT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_schema='freshwash'
      AND table_name='member'
      AND constraint_name='fk_member_assigned_employee'
  ) THEN
    ALTER TABLE freshwash.member
      ADD CONSTRAINT fk_member_assigned_employee
      FOREIGN KEY (assigned_employee_id)
      REFERENCES freshwash.employee(employee_id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_member_assigned_employee_id
  ON freshwash.member (assigned_employee_id);
```

### "connection to server on socket failed"
PostgreSQL service is not running. Start it using the commands above.

### "FATAL: Peer authentication failed"
Try using `psql -U postgres -h localhost` to force TCP connection instead of socket.

### "database freshwashdb does not exist"
Run step 3 above to create the database first.

### "relation freshwash.users does not exist"
Run step 4 above to load the schema into the database.

## Testing Credentials
- **Admin Login:**
  - Username: `admin`
  - Password: `nimba`

- **Sample User:**
  - Username: `aarav.patel`
  - Password: (not set, use signup)

- **Sample Employee:**
  - Username: `ramesh.kumar`
  - Password: `emp123`
