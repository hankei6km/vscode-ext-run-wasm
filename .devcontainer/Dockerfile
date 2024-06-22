FROM node:22-bookworm

RUN apt update -y \
    && apt install -y --no-install-recommends xauth libgtk-3-0 xvfb \
    # playwright は実行時のバージョンと合わせる必要があるので、単純にインストールはできない。
    # && npm install -g @playwright/test \
    # && npx playwright install-deps \
    && rm -rf /var/lib/apt/lists/* 