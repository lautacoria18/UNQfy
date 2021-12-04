FROM node:12
# Utiliza la imagen de node 8 como base.
# A partir de esta imagen se ejecutarán los comandos de abajo creando una nueva imagen.

# Configura variables de entorno necesariar para correr node
ENV NODE_ENV=development
ENV DEBUG=true

# Crea un directorio y nos movemos ahí
WORKDIR /home/node/loggingContainer

# Copia el package.json package-lock.json en /home/node/loggingContainer
COPY package.json .
COPY package-lock.json .

# Ejecuta npm install. Esto produce que se instalen todas las dependencias necearias para correr la aplicación
RUN ["npm", "install"]
RUN ["npm", "install", "winston-loggly-bulk"]
RUN ["npm", "install","winston-loggly-bulk", "winston"]
RUN ["npm", "install", "--save", "cross-fetch"]
# Expone el puerto 5000 donde corre la aplicación
EXPOSE 8082

# Copia los fuentes dentro del container
COPY apiLogging.js /home/node/loggingContainer/
COPY notifyStatusLogging.js /home/node/loggingContainer/
# Le da permisos al usuario node para escribir en /home/node/loggingContainer
# Como comentario, notar que el comando RUN nos permite ejecutar culquier comando bash valido.
RUN chown -R node:users /home/node/

# Habilita el usuario node. Por defecto, los containers corren los comandos con el usuario root
USER node

# Comando por defecto sino se provee uno al hacer docker run
# El comando corre el servicio
CMD [ "node", "apiLogging" ]

# LISTO!


# Para construir la imagen
# docker build -t <nombre_de_la_imagen> .

# Para correr el container
# docker run -p 8082:8082 --name <nombre_container> --user node <nombre_de_la_imagen>