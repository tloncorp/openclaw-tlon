FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y git curl gettext-base && apt-get install -y git curl jq && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# Install the same OpenClaw version this plugin is developed and tested against.
RUN npm install -g openclaw@2026.2.25

# Create workspace
WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 18789

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
