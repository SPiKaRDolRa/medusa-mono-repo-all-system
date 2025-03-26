FROM node:22-alpine AS base

# 1. เตรียม env
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@8.15.4 --activate

# 2. ติดตั้ง dependency ก่อน
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# 3. ค่อย copy ส่วนที่เหลือ (source code)
COPY . .

# 4. เริ่ม app
CMD ["pnpm", "start"]
