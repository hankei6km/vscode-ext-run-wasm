FROM mcr.microsoft.com/devcontainers/base:ubuntu

RUN apt update -y \
    && apt install -y --no-install-recommends xvfb \
    # && npm install -g @playwright/test \
    # && npx playwright install-deps \
    && rm -rf /var/lib/apt/lists/* 