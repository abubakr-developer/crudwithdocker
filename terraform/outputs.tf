output "public_ip" {
  value = aws_instance.backend.public_ip
}

output "ssh_command" {
  value = "ssh ubuntu@${aws_instance.backend.public_ip}"
}

output "app_url" {
  value = "http://${aws_instance.backend.public_ip}:5173"
}
