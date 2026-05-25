DOCKER_HOST := unix://${HOME}/.colima/default/docker.sock
TF_DIR := infra/docker

.PHONY: up down rebuild logs ps clean tf-init tf-plan tf-apply tf-destroy tf-fmt tf-validate

up:
	docker compose up

rebuild:
	docker compose up --build

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker ps

clean:
	docker compose down
	docker system prune -f

tf-init:
	cd $(TF_DIR) && DOCKER_HOST=$(DOCKER_HOST) terraform init

tf-fmt:
	cd $(TF_DIR) && terraform fmt

tf-validate:
	cd $(TF_DIR) && DOCKER_HOST=$(DOCKER_HOST) terraform validate

tf-plan:
	cd $(TF_DIR) && DOCKER_HOST=$(DOCKER_HOST) terraform plan

tf-apply:
	cd $(TF_DIR) && DOCKER_HOST=$(DOCKER_HOST) terraform apply

tf-destroy:
	cd $(TF_DIR) && DOCKER_HOST=$(DOCKER_HOST) terraform destroy