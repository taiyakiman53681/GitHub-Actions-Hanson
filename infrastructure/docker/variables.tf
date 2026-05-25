variable "app_image_name" {
  type    = string
  default = "infra-docker-lab:latest"
}

variable "container_name" {
  type    = string
  default = "infra-docker-lab-tf"
}

variable "host_port" {
  type    = number
  default = 3001
}

variable "container_port" {
  type    = number
  default = 3000
}