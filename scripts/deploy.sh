#!/bin/bash

# Deployment script for AWS ECS

set -e

# Configuration
AWS_REGION="us-east-1"
ECR_REPO_NAME="property-marketplace"
ECS_CLUSTER="property-marketplace-cluster"
ECS_SERVICE="property-marketplace-service"
TASK_DEFINITION_FAMILY="property-marketplace"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REPO_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

echo "Starting deployment process..."

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI

# Build Docker image
echo "Building Docker image..."
docker build -t $ECR_REPO_NAME .

# Tag image
echo "Tagging image..."
docker tag $ECR_REPO_NAME:latest $ECR_REPO_URI:latest

# Push image to ECR
echo "Pushing image to ECR..."
docker push $ECR_REPO_URI:latest

# Update task definition with new image
echo "Updating task definition..."
TASK_DEFINITION=$(aws ecs describe-task-definition --task-definition $TASK_DEFINITION_FAMILY --query taskDefinition)

# Remove unnecessary fields
NEW_TASK_DEFINITION=$(echo $TASK_DEFINITION | jq 'del(.taskDefinitionArn) | del(.revision) | del(.status) | del(.requiresAttributes) | del(.placementConstraints) | del(.compatibilities) | del(.registeredAt) | del(.registeredBy)')

# Update image URI
NEW_TASK_DEFINITION=$(echo $NEW_TASK_DEFINITION | jq --arg IMAGE_URI "$ECR_REPO_URI:latest" '.containerDefinitions[0].image = $IMAGE_URI')

# Register new task definition
echo "Registering new task definition..."
aws ecs register-task-definition --cli-input-json "$NEW_TASK_DEFINITION"

# Update service
echo "Updating ECS service..."
aws ecs update-service --cluster $ECS_CLUSTER --service $ECS_SERVICE --task-definition $TASK_DEFINITION_FAMILY

# Wait for deployment to complete
echo "Waiting for deployment to complete..."
aws ecs wait services-stable --cluster $ECS_CLUSTER --services $ECS_SERVICE

echo "Deployment completed successfully!"
