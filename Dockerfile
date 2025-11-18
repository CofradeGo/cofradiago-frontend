# Imagen base Node.js 22
FROM node:22

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los package.json para instalar dependencias primero
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos todo el proyecto al contenedor
COPY . .

# Ejecutamos build de Vite + React + TS
RUN npm run build

# Instalamos servidor estático
RUN npm install -g serve

# Exponemos puerto 4173 para frontend
EXPOSE 4173

# Comando que levanta la app
CMD ["serve", "-s", "dist", "-l", "4173"]
