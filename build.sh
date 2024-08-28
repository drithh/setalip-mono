#!/bin/bash

# Define the root directory of your projects
ROOT_DIR="$(pwd)"

# Array of relative paths to the project directories
PROJECTS=(
  "packages/ui"
  "apps/admin"
  "apps/web"
)

# Function to build each project
build_project() {
  local project_path="$1"
  echo "Navigating to $project_path"
  cd "$project_path" || { echo "Directory not found: $project_path"; exit 1; }

  echo "Installing dependencies for $project_path..."
  pnpm install || { echo "Failed to install dependencies for $project_path"; exit 1; }

  echo "Building $project_path..."
  pnpm run build || { echo "Build failed for $project_path"; exit 1; }

  # Navigate back to the root directory
  cd "$ROOT_DIR" || exit
}

# Navigate to the root directory
echo "Navigating to root directory: $ROOT_DIR"
cd "$ROOT_DIR" || { echo "Root directory not found: $ROOT_DIR"; exit 1; }

# Iterate over each project path and build the project
for project in "${PROJECTS[@]}"; do
  build_project "$ROOT_DIR/$project"
done

echo "All projects built successfully!"
