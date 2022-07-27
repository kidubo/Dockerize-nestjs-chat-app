# Specify Node Version and Image
# Name Image development (can be anything)
FROM node:16.16.0 AS development

# Specify Working directory inside container
WORKDIR /kdb/src/app

# Copy package-lock.json & package.json from host to inside container working directory
COPY package.json ./

# Install deps inside container
RUN npm install --force

CMD ["npm", "start"]

EXPOSE 3000


################
## PRODUCTION ##
################


# Build another image named production
FROM node:16.16.0 AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /kdb/src/app

COPY --from=development /kdb/src/app/ ./

EXPOSE 3000

# run app
CMD ["npm", "dist/main.js"]




