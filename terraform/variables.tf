variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "instance_type" {
  type    = string
  default = "t3.micro" # Free-tier eligible where available; verify AWS pricing.
}

variable "key_name" {
  type        = string
  description = "Existing EC2 key pair name (without the .pem extension)."
}

variable "my_ip" {
  type        = string
  description = "Your public IPv4 address in CIDR notation, e.g. 1.2.3.4/32."
}

variable "repo_url" {
  type        = string
  description = "Public Git URL of the React/Node project to clone and run."
}
