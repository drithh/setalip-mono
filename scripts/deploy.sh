#!/bin/bash

# Set the variables
DEST_DIR="/home/pilates/"

ADMIN="admin"
WEB="web"

# Create destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
  echo "Creating directory $DEST_DIR."
  mkdir -p "$DEST_DIR"
fi

extract_and_reload() {
  local APP_NAME=$1
  local PORT=$2

  echo "Extracting $APP_NAME"
  tar -xzf "$DEST_DIR/$APP_NAME.tar.gz" -C "$DEST_DIR"

  echo "Moving $APP_NAME"
  mv "$DEST_DIR/apps/$APP_NAME/.next/standalone" "$DEST_DIR/main/$APP_NAME"
  
  echo "Moving compressed file to backup"
  mv "$DEST_DIR/$APP_NAME.tar.gz" "$DEST_DIR/backup/$APP_NAME.tar.gz"

  echo "Copying main .env file to $APP_NAME"
  cp "$DEST_DIR/main/.env" "$DEST_DIR/main/$APP_NAME/.env"
  
  echo "Append PORT to $APP_NAME .env file"
  echo "PORT=$PORT" >> "$DEST_DIR/main/$APP_NAME/.env"

  echo "chmod +x $APP_NAME"
  chmod +x "$DEST_DIR/main/$APP_NAME/apps/$APP_NAME/server.js"

  echo "Reloading $APP_NAME with PM2"
  /root/.local/share/fnm/node-versions/v21.7.3/installation/bin/pm2 reload $APP_NAME --update-env
}

# removeing backup
echo "Removing backup directory"
rm -rf "$DEST_DIR/backup"

echo "Moving main to backup"
mv "$DEST_DIR/main" "$DEST_DIR/backup"

echo "Creating main directory"
mkdir -p "$DEST_DIR/main"

echo "Copy .env file to main"
cp "$DEST_DIR/.env" "$DEST_DIR/main/.env"

# Move and reload the admin app
extract_and_reload $ADMIN 3000
extract_and_reload $WEB 3001

echo "Removing apps directory"
rm -rf "$DEST_DIR/apps"

echo "Deployment completed successfully."
