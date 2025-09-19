FROM node:20-bookworm-slim AS deps

# Evitar download do Chromium pelo puppeteer (usaremos o do sistema)
ENV PUPPETEER_SKIP_DOWNLOAD=1

WORKDIR /app/backend

# Instalar dependências apenas do backend via npm
COPY backend/package.json ./package.json
RUN npm install --no-audit --no-fund

FROM node:20-bookworm-slim AS build

WORKDIR /app

# Dependências do Chromium necessárias para whatsapp-web.js/puppeteer em runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    fonts-liberation \
    fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

# Wrapper para forçar flags --no-sandbox
RUN printf '#!/bin/sh\nexec /usr/bin/chromium --no-sandbox --disable-setuid-sandbox "$@"\n' > /usr/local/bin/chromium-no-sandbox \
  && chmod +x /usr/local/bin/chromium-no-sandbox

ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-no-sandbox \
    CHROME_PATH=/usr/local/bin/chromium-no-sandbox

# Copiar node_modules do estágio deps e fontes do backend
COPY --from=deps /app/backend/node_modules /app/backend/node_modules
COPY backend /app/backend

WORKDIR /app/backend

# Buildar via TypeScript (tsconfig.build.json)
RUN npx tsc -p tsconfig.build.json

FROM node:20-bookworm-slim AS runner

ENV NODE_ENV=production \
    PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-no-sandbox \
    CHROME_PATH=/usr/local/bin/chromium-no-sandbox

WORKDIR /app/backend

# Instalar Chromium e libs em runtime
RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    chromium \
    ca-certificates \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libxshmfence1 \
    libdrm2 \
    libgbm1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libgtk-3-0 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    fonts-liberation \
    fonts-noto-color-emoji \
  && rm -rf /var/lib/apt/lists/*

RUN printf '#!/bin/sh\nexec /usr/bin/chromium --no-sandbox --disable-setuid-sandbox "$@"\n' > /usr/local/bin/chromium-no-sandbox \
  && chmod +x /usr/local/bin/chromium-no-sandbox

# Copiar apenas runtime: package.json, node_modules, dist
COPY backend/package.json ./package.json
COPY --from=build /app/backend/dist ./dist
COPY --from=deps /app/backend/node_modules ./node_modules

EXPOSE 3000

CMD ["node", "dist/main.js"]


