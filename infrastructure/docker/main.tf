resource "docker_image" "app" {
  name = var.app_image_name

  build {
    context    = "../.."
    dockerfile = "docker/Dockerfile"
  }
}

resource "docker_container" "app" {
  name  = var.container_name
  image = docker_image.app.image_id

  ports {
    internal = var.container_port
    external = var.host_port
  }

  env = [
    "PORT=${var.container_port}"
  ]
}