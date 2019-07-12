FROM node:boron
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 3000

# Define environment variable
ENV NAME Tourneykit

CMD ["npm", "run", "start"]
