FROM node:20-bookworm-slim

# Evita download do Chromium pelo puppeteer (usaremos o do sistema)
ENV PUPPETEER_SKIP_DOWNLOAD=1

# Instalar Chromium e dependências necessárias para rodar headless
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

# Wrapper para forçar flags --no-sandbox e --disable-setuid-sandbox
RUN printf '#!/bin/sh\nexec /usr/bin/chromium --no-sandbox --disable-setuid-sandbox "$@"\n' > /usr/local/bin/chromium-no-sandbox \
  && chmod +x /usr/local/bin/chromium-no-sandbox

ENV PUPPETEER_EXECUTABLE_PATH=/usr/local/bin/chromium-no-sandbox \
    CHROME_PATH=/usr/local/bin/chromium-no-sandbox

WORKDIR /app

# Habilitar Yarn 4 conforme package.json (packageManager)
RUN corepack enable

# Copiar manifestos primeiro para cache de dependências
COPY package.json yarn.lock ./

# Preparar Yarn exatamente na versão definida no package.json
RUN corepack prepare "$(jq -r .packageManager < package.json)" --activate || corepack prepare yarn@4.9.1 --activate

# Instalar dependências (inclui devDependencies pois usamos ts-node em runtime)
RUN yarn install --immutable

# Copiar o restante do código
COPY . .

# Opcional: defina a timezone/locale se necessário
ENV NODE_ENV=development

# Comando padrão: inicia a aplicação (ts-node) que imprimirá o QR no stdout
CMD ["yarn", "start"]
