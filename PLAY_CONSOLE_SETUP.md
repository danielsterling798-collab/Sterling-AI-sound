# Setup Instructions for Google Play Console Automation

## Prerequisites

Before the GitHub Actions workflow can automatically upload to Google Play Console, you need to:

### 1. Create a Service Account in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google Play Android Developer API
4. Navigate to **Service Accounts** → **Create Service Account**
5. Grant the service account the role: **Service Account User**
6. Create a JSON key and download it

### 2. Add GitHub Secrets

In your GitHub repository settings, add the following secrets:

#### Required Secrets for Release Workflow:

**`PLAY_CONSOLE_SERVICE_ACCOUNT`**
- Paste the entire JSON content from the service account key file

**`KEYSTORE_FILE`** (Base64 encoded)
```bash
base64 -i sterling-sound-upload-key.jks > keystore.txt
```
- Paste the output from above

**`KEYSTORE_PASSWORD`**
- Your keystore password

**`KEY_ALIAS`**
- Your key alias (e.g., "upload")

**`KEY_PASSWORD`**
- Your key password

### 3. Generate Signing Key

If you don't have a signing key yet:

```bash
keytool -genkey -v -keystore sterling-sound-upload-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 -alias upload
```

### 4. Configure Play Console Service Account

1. Go to [Google Play Console](https://play.google.com/console)
2. Select **Sterling AI Sound 4**
3. Go to **Settings** → **API access**
4. Link your Google Cloud Project
5. Grant the service account **Release Manager** role

## Workflow Triggers

### Automatic Release (Production)
- Triggered on push to `main` branch when `android/**` files change
- Automatically builds and uploads to Google Play Console production track
- Creates a GitHub Release with build artifacts

### Manual Build (Testing)
- Triggered on pull requests to test builds
- Creates debug APK for testing
- Comments on PR with build status

### Manual Trigger
- You can manually trigger either workflow from GitHub Actions tab

## Monitoring Builds

1. Go to your repository
2. Click **Actions** tab
3. Select the workflow run
4. Check logs for build status

## Troubleshooting

### Build fails with "Gradle not found"
- Ensure `chmod +x android/gradlew` is in the workflow

### Upload fails with "Authentication error"
- Verify the service account JSON is correctly in `PLAY_CONSOLE_SERVICE_ACCOUNT` secret
- Check that service account has **Release Manager** role in Play Console

### Signing fails
- Verify keystore file is correctly base64 encoded
- Check all keystore secrets are set correctly

## Manual Upload (if needed)

If automation fails, upload manually:

```bash
cd android
./gradlew bundleRelease
```

Then upload the `.aab` file directly to [Google Play Console](https://play.google.com/console).

---

**For more help:** See the main [README.md](./README.md)
