output "ec2_public_ip" {
  description = "Public IPv4 address of provisioned EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "security_group_id" {
  description = "ID of the provisioned Application Security Group"
  value       = aws_security_group.jenkins_app_sg.id
}

output "application_url" {
  description = "HTTP URL to access the deployed web application"
  value       = "http://${aws_instance.app_server.public_ip}:80"
}
