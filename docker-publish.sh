TAG=frederickoller/cv
VERSION=$([[ -z "$1" ]] && echo 'latest' || echo "$1")

docker buildx build --platform linux/amd64 -t $TAG --load .
docker tag $TAG dockhub.lieberweiss.com/$TAG:$VERSION
docker push dockhub.lieberweiss.com/$TAG:$VERSION
