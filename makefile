REGISTRY   = srjm2024
IMAGE_NAME = gerador-qrcode-srjm
TAG        = latest

.PHONY: build push all 

all: build push

build:
	sudo docker build -t $(REGISTRY)/$(IMAGE_NAME):$(TAG) .

push:
	sudo docker push $(REGISTRY)/$(IMAGE_NAME):$(TAG)


