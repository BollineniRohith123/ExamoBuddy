# PostgreSQL Setup Guide for aaPanel

This guide provides step-by-step instructions for setting up PostgreSQL on aaPanel and configuring it for remote access for the ExamoBuddy application.

## Accessing PostgreSQL in aaPanel

1. Log in to your aaPanel dashboard at https://server.alviongs.com:19676/
2. Navigate to the "Database" section in the left sidebar
3. Select the "PostgreSQL" tab

## Creating a New Database

1. Click on the "Add DB" button
2. Fill in the following details:
   - **Database Name**: `examobuddy`
   - **Username**: Create a secure username
   - **Password**: Create a strong password
3. Click "Submit" to create the database

## Enabling Remote Access

By default, aaPanel PostgreSQL does not allow remote access. Follow these steps to enable it:

1. In the aaPanel dashboard, go to the "Security" section in the left sidebar
2. Open port 5432 (PostgreSQL's default port) in the firewall settings
3. Click "Add" to save the rule

## Configuring PostgreSQL for Remote Access

You need to modify PostgreSQL configuration files to allow remote connections:

1. In aaPanel, go to the "Terminal" section
2. Run the following commands:

```bash
# Navigate to PostgreSQL configuration directory
cd /www/server/pgsql/data

# Edit postgresql.conf
nano postgresql.conf
```

3. Find the line that contains `listen_addresses` and change it to:
```
listen_addresses = '*'
```

4. Save and exit (Ctrl+X, then Y, then Enter)

5. Next, edit the pg_hba.conf file:
```bash
nano pg_hba.conf
```

6. Add the following line at the end of the file to allow remote connections:
```
host    all             all             0.0.0.0/0               md5
```

7. Save and exit (Ctrl+X, then Y, then Enter)

8. Restart PostgreSQL to apply the changes:
```bash
systemctl restart postgresql
```

## Installing pgvector Extension

The pgvector extension is required for vector embeddings in ExamoBuddy:

1. In the aaPanel terminal, run:
```bash
# Install development packages
apt-get update
apt-get install postgresql-server-dev-14 build-essential git

# Clone pgvector repository
git clone https://github.com/pgvector/pgvector.git
cd pgvector

# Build and install
make
make install

# Connect to PostgreSQL and enable the extension
psql -U postgres
```

2. Once in the PostgreSQL shell, run:
```sql
CREATE EXTENSION vector;
\q
```

## Connecting to the Database

You can now connect to your PostgreSQL database using the following connection details:

- **Host**: server.alviongs.com
- **Port**: 5432
- **Database**: examobuddy
- **Username**: Your created username
- **Password**: Your created password

## Testing the Connection

To test the connection from your local machine, you can use the `psql` command-line tool:

```bash
psql -h server.alviongs.com -p 5432 -U your_username -d examobuddy
```

You should be prompted for your password, and after entering it correctly, you should be connected to the PostgreSQL server.

## Configuring ExamoBuddy to Use the Database

Update the `.env` file in the `backend` directory with your PostgreSQL connection details:

```
# Database configuration
DB_HOST=server.alviongs.com
DB_PORT=5432
DB_NAME=examobuddy
DB_USER=your_username
DB_PASSWORD=your_password
```

## Troubleshooting

If you encounter connection issues:

1. **Check Firewall Settings**: Ensure port 5432 is open in both aaPanel's firewall and any cloud provider's security group.

2. **Verify PostgreSQL is Running**: In the aaPanel terminal, run:
   ```bash
   systemctl status postgresql
   ```

3. **Check PostgreSQL Logs**: Look for error messages in the logs:
   ```bash
   tail -f /www/server/pgsql/data/pg_log/postgresql-*.log
   ```

4. **Test Local Connection**: Try connecting locally on the server first:
   ```bash
   psql -U postgres -d examobuddy
   ```

5. **Verify Configuration**: Double-check the `postgresql.conf` and `pg_hba.conf` files for correct settings.
