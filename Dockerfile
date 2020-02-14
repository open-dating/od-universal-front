########
# Stage 1 - the build process
########
FROM node:12.13.0-alpine as build

RUN apk add --no-cache git curl

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./

ARG REACT_APP_HOST
ENV REACT_APP_HOST "$REACT_APP_HOST"

# grab branch and commit
RUN printf "%s\n" \
    "REACT_APP_GIT_BRANCH=$(git branch | grep \* | cut -d ' ' -f2)" \
    "REACT_APP_GIT_LAST_COMMIT=$(git log --format="%H" -n 1)"  \
    "CI=true" \
    >> .env

RUN npm run test
RUN npm run build

########
# Stage 2 - the production environment
########
FROM nginx:1.17.8-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY docker/nginx/nginx.conf /etc/nginx/nginx.conf

CMD ["nginx", "-g", "daemon off;"]