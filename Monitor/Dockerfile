FROM node:12
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/monitorContainer

# Copia el package.json package-lock.json en /home/node/monitorContainer
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]
RUN ["npm", "install", "ping-monitor"]
RUN ["npm", "install", "--save", "cross-fetch"]

# Expone el puerto 5000 donde corre la aplicación
EXPOSE 8083

# Copia los fuentes dentro del container
COPY apiMonitor.js /home/node/monitorContainer/
COPY monitors.js /home/node/monitorContainer/
COPY sendNotificationToDiscordChanell.js /home/node/monitorContainer/
COPY apiErrors.js /home/node/monitorContainer/
# Le da permisos al usuario node para escribir en /home/node/monitorContainer
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown -R node:users /home/node/

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "apiMonitor" ]

# LISTO!


# Para construir la imagen
# docker build -t <nombre_de_la_imagen> .

# Para correr el container
# docker run -p 8083:8083 --name <nombre_container> --user node <nombre_de_la_imagen>