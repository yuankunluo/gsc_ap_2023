# RUN POSTGRES
docker run --name gsc-postgres -e POSTGRES_PASSWORD=devpassword -e POSTGRES_USER=devuser -p 5432:5432 -d postgres