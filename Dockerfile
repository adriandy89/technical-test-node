FROM node:22.11 AS base

# development stage
FROM base AS development
ARG APP
ARG NODE_ENV=develop
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./prisma/schema.prisma ./
RUN npm install
RUN npx prisma generate
COPY . .
RUN npm run build ${APP}

# production stage
FROM base AS production
ARG APP
# ARG NODE_ENV=production
ARG NODE_ENV=develop
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
COPY ./prisma/schema.prisma ./
RUN npm install --prod
RUN npx prisma generate
COPY --from=development /usr/src/app/dist ./dist

# Add an env to save ARG
ENV APP_MAIN_FILE=dist/apps/${APP}/main
EXPOSE 3003
CMD node ${APP_MAIN_FILE}
