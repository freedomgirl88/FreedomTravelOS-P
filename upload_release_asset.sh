#!/usr/bin/env bash
set -euo pipefail

if [ -z "${GITHUB_TOKEN:-}" ]; then
  echo "GITHUB_TOKEN is not set. Export a PAT with repo scope into GITHUB_TOKEN." >&2
  exit 1
fi

if [ "$#" -ne 3 ]; then
  echo "Usage: $0 owner/repo tag file" >&2
  exit 1
fi

REPO="$1"
TAG="$2"
FILE="$3"

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE" >&2
  exit 1
fi

RELEASE_JSON=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$REPO/releases/tags/$TAG")
UPLOAD_URL=$(echo "$RELEASE_JSON" | grep -o '"upload_url": *"[^"]*"' | sed -E 's/"upload_url": *"([^"]*)"/\1/' | sed -E 's/\{\?name,label\}//')

if [ -z "$UPLOAD_URL" ] || [ "$UPLOAD_URL" = "null" ]; then
  echo "Failed to find release upload URL. Ensure the release/tag exists." >&2
  echo "Response: $RELEASE_JSON" >&2
  exit 1
fi

FNAME=$(basename "$FILE")
MIME_TYPE=$(file --brief --mime-type "$FILE" || echo "application/octet-stream")

echo "Uploading $FNAME to release $TAG..."
curl -s -X POST -H "Authorization: token $GITHUB_TOKEN" -H "Content-Type: $MIME_TYPE" --data-binary "@$FILE" "$UPLOAD_URL?name=$FNAME"
echo
echo "Upload finished."
