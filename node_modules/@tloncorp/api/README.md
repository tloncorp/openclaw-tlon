# @tloncorp/api

TypeScript API client for Tlon's Urbit applications.

## Installation

```bash
npm install @tloncorp/api
```

Or install from GitHub:

```bash
npm install github:tloncorp/api-beta#main
```

## Usage

```typescript
import {
  configureClient,
  getGroups,
  getContacts,
  getCurrentUserId,
} from "@tloncorp/api";

// Configure the client
configureClient({
  shipName: "your-ship-name",
  shipUrl: "https://your-ship.tlon.network",
  getCode: async () => "your-access-code",
});

// Make API calls
const groups = await getGroups();
const contacts = await getContacts();
```

## Examples

See the [examples/cli](./examples/cli) directory for a working CLI example.

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode
npm run dev
```

## License

MIT
