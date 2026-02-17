FROM node:24-bookworm-slim

RUN apt-get update && apt-get install -y git curl gettext-base && rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

# Install OpenClaw globally
RUN npm install -g openclaw@latest

# Create workspace
WORKDIR /workspace

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 18789

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
