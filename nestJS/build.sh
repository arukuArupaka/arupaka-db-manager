#!/bin/bash
npm install -g pnpm@10.4.1
pnpm install
pnpm run generate
pnpm run migrate
pnpm run build