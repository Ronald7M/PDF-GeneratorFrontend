# Imagine de bază oficială Node.js pentru a construi aplicația
FROM node:16 as build

# Setăm directorul de lucru în container
WORKDIR /app

# Copiem fișierele de configurare (package.json și package-lock.json) în container
COPY package.json package-lock.json ./

# Instalăm toate dependențele
RUN npm install

# Copiem tot codul sursă în container
COPY . .

# Construim aplicația React
RUN npm run build

# Imagine finală bazată pe Nginx pentru a servi aplicația
FROM nginx:alpine

# Copiem fișierele build din etapa de build în directorul Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expunem portul 80 pentru accesul HTTP
EXPOSE 80

# Pornim serverul Nginx
CMD ["nginx", "-g", "daemon off;"]
