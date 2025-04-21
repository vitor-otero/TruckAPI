To run..

 docker build --platform=linux/amd64 -t truckapi .


then ...

docker run -d -p 3000:3000 --name truckapi_container truckapi
