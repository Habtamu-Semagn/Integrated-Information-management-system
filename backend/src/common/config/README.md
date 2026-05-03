# Database Configuration Module

This module provides MongoDB connection management with error handling, retry logic, and graceful shutdown capabilities for the Startup Backend System.

## Features

- ✅ **Automatic Connection Retry**: Retries connection up to 5 times with 5-second delays
- ✅ **Connection Pooling**: Configured with optimal pool sizes for performance
- ✅ **Error Handling**: Comprehensive error logging and handling
- ✅ **Graceful Shutdown**: Properly closes connections on SIGINT/SIGTERM signals
- ✅ **Connection Monitoring**: Event handlers for connection lifecycle events
- ✅ **Connection State Utilities**: Helper functions to check connection status

## Usage

### Basic Setup

```javascript
const { connectDB, setupConnectionHandlers } = require('./common/config/database.config');

// Setup event handlers
setupConnectionHandlers();

// Connect to MongoDB
await connectDB();
```

### Complete Server Integration

```javascript
require('dotenv').config();
const { connectDB, setupConnectionHandlers } = require('./common/config/database.config');

async function startServer() {
  try {
    // Validate environment variables
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }

    // Setup connection handlers
    setupConnectionHandlers();

    // Connect to database
    await connectDB();

    // Start Express server
    const app = require('./app');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
```

## API Reference

### `connectDB()`

Connects to MongoDB with automatic retry logic.

**Returns**: `Promise<void>`

**Throws**: `Error` if connection fails after all retry attempts

**Example**:
```javascript
await connectDB();
```

### `setupConnectionHandlers()`

Registers event handlers for connection lifecycle events and process signals.

**Returns**: `void`

**Example**:
```javascript
setupConnectionHandlers();
```

### `gracefulShutdown(signal)`

Gracefully closes database connections and exits the process.

**Parameters**:
- `signal` (string): The signal that triggered the shutdown (e.g., 'SIGINT', 'SIGTERM')

**Returns**: `Promise<void>`

**Example**:
```javascript
await gracefulShutdown('SIGTERM');
```

### `getConnectionState()`

Returns the current connection state as a string.

**Returns**: `string` - One of: 'disconnected', 'connected', 'connecting', 'disconnecting', 'unknown'

**Example**:
```javascript
const state = getConnectionState();
console.log(`Connection state: ${state}`);
```

### `isConnected()`

Checks if the database is currently connected.

**Returns**: `boolean` - `true` if connected, `false` otherwise

**Example**:
```javascript
if (isConnected()) {
  console.log('Database is connected');
}
```

## Configuration

### Environment Variables

The module requires the following environment variable:

- `MONGODB_URI` (required): MongoDB connection string

**Example**:
```env
MONGODB_URI=mongodb://localhost:27017/startup-support-system
```

### Connection Options

The module uses the following Mongoose connection options:

- `maxPoolSize`: 10 (maximum connections in pool)
- `minPoolSize`: 2 (minimum connections in pool)
- `socketTimeoutMS`: 45000 (45 seconds)
- `serverSelectionTimeoutMS`: 5000 (5 seconds)
- `family`: 4 (use IPv4)

### Retry Configuration

- **Max Retries**: 5 attempts
- **Retry Delay**: 5 seconds between attempts

## Connection Events

The module handles the following Mongoose connection events:

- `error`: Logs connection errors
- `disconnected`: Logs disconnection and attempts to reconnect
- `reconnected`: Logs successful reconnection

## Process Signals

The module handles the following process signals for graceful shutdown:

- `SIGINT`: Triggered by Ctrl+C
- `SIGTERM`: Triggered by process managers (PM2, Docker, etc.)

## Error Handling

### Connection Errors

If the initial connection fails, the module will:
1. Log the error with attempt number
2. Wait 5 seconds
3. Retry the connection
4. Repeat up to 5 times
5. Throw an error if all attempts fail

### Runtime Errors

Connection errors during runtime are logged but do not crash the application. Mongoose will automatically attempt to reconnect.

## Testing

### Unit Tests

Run unit tests (requires MongoDB Memory Server):
```bash
npm test -- database.config.test.js
```

### Integration Tests

Run integration tests (requires running MongoDB instance):
```bash
MONGODB_URI=mongodb://localhost:27017/test-db npm test -- database.config.integration.test.js
```

### Manual Testing

1. Start MongoDB:
```bash
docker run -d -p 27017:27017 --name test-mongo mongo:7.0
```

2. Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/test-db
JWT_SECRET=test-secret
PORT=5000
```

3. Start the server:
```bash
npm run dev
```

4. Verify connection logs:
```
🚀 Starting Startup Backend System...
✅ MongoDB Connected: localhost
📊 Database: test-db
✅ Server initialization complete
```

5. Test graceful shutdown (Ctrl+C):
```
🛑 SIGINT received. Closing MongoDB connections...
✅ MongoDB connections closed successfully
```

## Requirements Satisfied

This module satisfies the following requirements from the specification:

- **Requirement 15.1**: Unique index on email field (enforced at model level)
- **Requirement 15.2**: Validate userId references (enforced at model level)
- **Requirement 15.3**: Validate reviewedBy references (enforced at model level)
- **Requirement 19.1**: Connect to MongoDB using URI from environment variables ✅
- **Requirement 19.2**: Log error and retry connection on failure ✅
- **Requirement 19.3**: Log success message when connection is established ✅
- **Requirement 19.4**: Configure connection pooling for efficient database access ✅
- **Requirement 19.5**: Gracefully close database connections on shutdown ✅

## Troubleshooting

### Connection Timeout

If you see timeout errors:
- Verify MongoDB is running
- Check the MONGODB_URI is correct
- Ensure network connectivity to MongoDB server
- Check firewall rules

### Authentication Errors

If you see authentication errors:
- Verify MongoDB credentials in MONGODB_URI
- Ensure the database user has proper permissions
- Check MongoDB authentication is enabled

### Retry Loop

If the server keeps retrying:
- Check MongoDB is accessible
- Verify the connection string format
- Check MongoDB logs for errors
- Ensure MongoDB version compatibility (7.0+ recommended)

## Best Practices

1. **Always use environment variables** for connection strings
2. **Never commit** `.env` files to version control
3. **Use connection pooling** for production deployments
4. **Monitor connection events** in production
5. **Implement health checks** using `isConnected()`
6. **Handle graceful shutdown** in production environments
7. **Use separate databases** for development, testing, and production

## Future Enhancements

Potential improvements for future versions:

- [ ] Configurable retry attempts and delays
- [ ] Connection health monitoring and metrics
- [ ] Automatic failover to replica sets
- [ ] Connection pool size auto-tuning
- [ ] Integration with monitoring services (DataDog, New Relic)
- [ ] Circuit breaker pattern for connection failures
- [ ] Read preference configuration for replica sets
