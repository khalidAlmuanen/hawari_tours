# 🔧 Database Connection Fix Guide

## Issue Identified
- Error: `P1001: Can't reach database server at db.mgosbdllfilesbhzviam.supabase.co:5432`
- Database connection to Supabase is failing

## Root Causes & Solutions

### 1. **Check DATABASE_URL Format**
Your DATABASE_URL should follow this format:
```
postgresql://postgres:[YOUR-PASSWORD]@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres
```

### 2. **Supabase Project Status**
- Check if your Supabase project is active
- Verify you're not on a paused/suspended plan
- Ensure database is enabled in your project

### 3. **Network/Connection Issues**
- Supabase might be blocking connections from your region/IP
- Check if you need to use connection pooling
- Verify port 5432 is accessible

### 4. **Authentication Issues**
- Reset your database password in Supabase dashboard
- Update the password in your DATABASE_URL
- Ensure correct database user (usually 'postgres')

### 5. **Alternative Connection Methods**
Try these URL formats:

**Standard:**
```
postgresql://postgres:password@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres
```

**With SSL:**
```
postgresql://postgres:password@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres?sslmode=require
```

**With Connection Pooling:**
```
postgresql://postgres:password@db.mgosbdllfilesbhzviam.supabase.co:6543/postgres?pgbouncer=true
```

## Steps to Fix

### Step 1: Verify Current Configuration
```bash
# Check your .env file
cat .env | grep DATABASE_URL
```

### Step 2: Test Connection with Different URLs
Update your .env file with each format and test:

```bash
# Test 1: Standard format
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres"

# Test 2: With SSL
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres?sslmode=require"

# Test 3: Connection pooling
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.mgosbdllfilesbhzviam.supabase.co:6543/postgres?pgbouncer=true"
```

### Step 3: Reset Supabase Database Password
1. Go to Supabase Dashboard
2. Settings → Database
3. Scroll to "Connection string"
4. Click "Reset database password"
5. Copy the new connection string
6. Update your .env file

### Step 4: Check Supabase Project Status
- Ensure project is active (not paused)
- Verify database is enabled
- Check billing status

### Step 5: Alternative - Use Direct URL
Add DIRECT_URL to your .env:
```
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.mgosbdllfilesbhzviam.supabase.co:5432/postgres"
```

## Testing the Fix

After each change, test the connection:
```bash
node test-db-connection.js
```

Or with Prisma:
```bash
npx prisma db pull
```

## Common Issues

### Issue: "Connection refused"
- Solution: Check if Supabase project is active
- Try using port 6543 with connection pooling

### Issue: "Authentication failed"
- Solution: Reset database password in Supabase
- Update DATABASE_URL with new password

### Issue: "SSL required"
- Solution: Add `?sslmode=require` to DATABASE_URL

### Issue: "Timeout"
- Solution: Check network connectivity
- Try from different network/location

## Final Verification

Once connected successfully:
1. Run `npx prisma generate`
2. Run `npx prisma db push` or `npx prisma migrate dev`
3. Test with `node test-db-connection.js`

## Emergency Fallback

If Supabase continues to fail:
1. Use local PostgreSQL for development
2. Try alternative database providers (Neon, Railway)
3. Contact Supabase support

---

**Next Steps:**
1. Update your .env file with correct DATABASE_URL
2. Test connection with the script
3. Run migrations once connected
4. Verify all tables are created correctly
