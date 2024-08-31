#!/bin/bash

# .env file path
ENV_FILE=".secrets"

# GitHub repository and environment
REPO="drithh/setalip-mono"            # Replace with your repository name
ENV_NAME="Production"  # Replace with your environment name

# Read each line from the .env file
while IFS= read -r line; do
  # Skip empty lines or lines starting with '#'
  [[ -z "$line" || "$line" == \#* ]] && continue
  
  # Parse key and value from the line
  IFS='=' read -r KEY VALUE <<< "$line"
  
  # Trim any extra whitespace from KEY and VALUE
  KEY=$(echo "$KEY" | xargs)
  VALUE=$(echo "$VALUE" | xargs)

  echo "Setting secret for $KEY in $ENV_NAME environment of $REPO with value $VALUE"
  # Set the GitHub secret
  gh secret set "$KEY" --env "$ENV_NAME" --body "$VALUE" --repo "$REPO"
done < "$ENV_FILE"
