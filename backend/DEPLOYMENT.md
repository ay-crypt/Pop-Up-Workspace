# Complete Setup & Deployment Guide

## Backend Deployment Guide

### Local Development Setup

#### Step 1: Install PostgreSQL

**Windows:**
```powershell
# Using Chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Create Database

```bash
# Open PostgreSQL CLI
psql -U postgres

# In psql:
CREATE DATABASE popup_workspace_db;
\q
```

#### Step 3: Configure Backend

```bash
cd backend

# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Update DB_USER, DB_PASSWORD, JWT_SECRET, etc.
```

Example `.env` for local development:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=popup_workspace_db
DB_USER=postgres
DB_PASSWORD=your_secure_password
PORT=3000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_development
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

#### Step 4: Install Dependencies

```bash
npm install
```

#### Step 5: Run Migrations

```bash
npm run migrate
```

Expected output:
```
Starting database migrations...
✓ Migrations completed successfully
```

#### Step 6: Seed Sample Data (Optional)

```bash
npm run seed
```

This creates:
- 3 sample locations (NYC, San Francisco, London)
- 6 workspace spots with different categories
- Sample membership tiers

#### Step 7: Start Development Server

```bash
npm run dev
```

Expected output:
```
Pop-Up Workspace API listening on port 3000
```

### Test the API

```bash
# Health check
curl http://localhost:3000/health

# Get locations
curl http://localhost:3000/api/locations

# Get membership tiers
curl http://localhost:3000/api/memberships/tiers
```

---

## Production Deployment

### Option 1: Deploy to Heroku

#### Prerequisites
- Heroku CLI installed
- Heroku account

#### Steps

```bash
# Login to Heroku
heroku login

# Create Heroku app
heroku create your-app-name

# Add PostgreSQL add-on
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set NODE_ENV=production
heroku config:set CORS_ORIGIN=https://your-frontend.com

# Deploy
git push heroku main

# Run migrations on Heroku
heroku run npm run migrate

# Check logs
heroku logs --tail
```

### Option 2: Deploy to AWS EC2

#### Prerequisites
- AWS account
- EC2 instance running Ubuntu 20.04+
- Security groups allowing ports 80, 443, 3000

#### Steps

```bash
# SSH into EC2 instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install -y postgresql postgresql-contrib

# Create database
sudo -u postgres psql
CREATE DATABASE popup_workspace_db;
CREATE USER workspace_user WITH PASSWORD 'secure_password';
ALTER ROLE workspace_user SET client_encoding TO 'utf8';
ALTER ROLE workspace_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE workspace_user SET default_transaction_deferrable TO on;
ALTER ROLE workspace_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE popup_workspace_db TO workspace_user;
\q

# Clone your repository
git clone your-repo-url
cd backend

# Install dependencies
npm install

# Create .env file
nano .env
# Add production configuration

# Run migrations
npm run migrate

# Install PM2 for process management
sudo npm install -g pm2

# Start application with PM2
pm2 start src/server.js --name "popup-api"
pm2 startup
pm2 save

# Setup Nginx reverse proxy
sudo apt-get install -y nginx
sudo nano /etc/nginx/sites-available/default
```

Example Nginx config:
```nginx
server {
    listen 80 default_server;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 3: Deploy with Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src ./src
COPY migrations ./migrations
COPY seeds ./seeds

EXPOSE 3000

CMD ["npm", "start"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "${DB_PORT}:5432"

  api:
    build: .
    ports:
      - "${PORT}:3000"
    environment:
      DB_HOST: postgres
      DB_PORT: ${DB_PORT}
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: ${NODE_ENV}
    depends_on:
      - postgres
    command: sh -c "npm run migrate && npm start"

volumes:
  postgres_data:
```

Deploy:
```bash
docker-compose up -d
```

---

## Environment Variables by Deployment Type

### Development
```
NODE_ENV=development
DB_HOST=localhost
DEBUG=true
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
```

### Staging
```
NODE_ENV=staging
DB_HOST=db.staging.internal
CORS_ORIGIN=https://staging.yourapp.com
```

### Production
```
NODE_ENV=production
DB_HOST=your-managed-db.rds.amazonaws.com
CORS_ORIGIN=https://yourapp.com
JWT_SECRET=long-random-secure-string-here
```

---

## Database Backup & Recovery

### Backup PostgreSQL

```bash
# Local backup
pg_dump -U postgres popup_workspace_db > backup.sql

# Compress backup
pg_dump -U postgres popup_workspace_db | gzip > backup.sql.gz

# Remote database backup (AWS RDS)
pg_dump -h your-rds-endpoint.rds.amazonaws.com \
  -U postgres popup_workspace_db > backup.sql
```

### Restore from Backup

```bash
# Restore from file
psql -U postgres popup_workspace_db < backup.sql

# Restore compressed backup
gunzip -c backup.sql.gz | psql -U postgres popup_workspace_db
```

---

## Monitoring & Logging

### Application Logs

```bash
# Development
npm run dev 2>&1 | tee logs/app.log

# Production (with PM2)
pm2 logs popup-api

# View Heroku logs
heroku logs --tail

# View AWS CloudWatch (set up in aws config)
aws logs tail /aws/lambda/popup-api --follow
```

### Database Health

```bash
# Check PostgreSQL connections
psql -U postgres -d popup_workspace_db -c "SELECT count(*) FROM pg_stat_activity;"

# Monitor slow queries
psql -U postgres -d popup_workspace_db -c "SELECT query, mean_time, calls FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;"
```

---

## Common Issues & Solutions

### Issue: "connect ECONNREFUSED" when starting server
**Solution:** PostgreSQL is not running
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Windows
# Start PostgreSQL from Services
```

### Issue: "database popup_workspace_db does not exist"
**Solution:** Create the database first
```bash
psql -U postgres -c "CREATE DATABASE popup_workspace_db;"
```

### Issue: "Migrations fail with permission error"
**Solution:** Grant proper permissions
```bash
psql -U postgres
GRANT ALL PRIVILEGES ON DATABASE popup_workspace_db TO postgres;
\q
```

### Issue: "JWT token invalid"
**Solution:** JWT_SECRET mismatch - ensure same secret in .env
```bash
# Generate secure secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Performance Optimization

### Database Optimization

```sql
-- Add indexes for frequently queried fields (already included in migrations)
-- Monitor query performance
EXPLAIN ANALYZE SELECT * FROM bookings WHERE customer_id = '...';

-- Vacuum and analyze
VACUUM ANALYZE;
```

### Application Optimization

```javascript
// Enable connection pooling (already configured)
// Use pagination for large datasets
// Implement caching for frequently accessed data

// Example with Redis caching
const redis = require('redis');
const client = redis.createClient();

async function getCachedLocations() {
  const cached = await client.get('locations_all');
  if (cached) return JSON.parse(cached);
  
  const locations = await Location.getAllLocations();
  await client.setEx('locations_all', 3600, JSON.stringify(locations));
  return locations;
}
```

---

## Security Checklist

- [ ] Change default database password
- [ ] Use strong JWT_SECRET (random 32+ character string)
- [ ] Enable HTTPS in production
- [ ] Configure CORS properly for your frontend domain
- [ ] Keep dependencies updated: `npm audit` and `npm update`
- [ ] Use environment variables for all secrets
- [ ] Enable database encryption at rest
- [ ] Regular database backups
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all endpoints

---

## Next Steps

1. **Payment Integration:** Add Stripe or PayPal
2. **Email Notifications:** Send booking confirmations
3. **Real-time Updates:** Implement WebSocket for spot availability
4. **Admin Dashboard:** Create admin APIs for managing locations/spots
5. **Analytics:** Track user metrics and bookings
6. **API Documentation:** Generate OpenAPI/Swagger docs

---

## Support & Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [Express.js Guide](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Heroku Deployment Guide](https://devcenter.heroku.com/)
- [AWS EC2 Guide](https://docs.aws.amazon.com/ec2/)
