#!/bin/bash
ADMIN="admin"
WEB="web"

# Function to move a directory
move_static_folder_and_compress() {
    local APP_NAME=$1

    echo "Moving static directory $APP_NAME"
    mv "./apps/$APP_NAME/.next/static" "./apps/$APP_NAME/.next/standalone/apps/$APP_NAME/.next/static"

    echo "Moving public directory $APP_NAME"
    mv "./apps/$APP_NAME/public" "./apps/$APP_NAME/.next/standalone/apps/$APP_NAME/public"

    echo "Move completed successfully."

    # Compress the directory
    echo "Compressing directory $APP_NAME"
    tar -czf "$APP_NAME.tar.gz" "./apps/$APP_NAME/.next/standalone"

    du -sh "./apps/$APP_NAME/.next/standalone/"
    du -sh "$APP_NAME.tar.gz"
}

move_static_folder_and_compress $ADMIN
move_static_folder_and_compress $WEB