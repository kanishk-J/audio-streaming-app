# Audio Streaming Application

This project is an audio streaming application that allows users to upload, store, and play music files. It uses a Node.js backend with Express, a PostgreSQL database, and AWS S3 for file storage.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (usually comes with Node.js)
- MySQL
- AWS account with S3 access
- FFmpeg (required for audio conversion)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/audio-streaming-app.git
   cd audio-streaming-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Install FFmpeg:
   - On macOS (using Homebrew):
     ```
     brew install ffmpeg
     ```
   - On Ubuntu or Debian:
     ```
     sudo apt update
     sudo apt install ffmpeg
     ```
   - On Windows:
     Download from the official FFmpeg website and add it to your system PATH.

## Configuration

1. Create a `.env` file in the root directory of the project.

2. Add the following environment variables to the `.env` file:
   ```
   # Database Configuration
   DB_HOST=your_database_host
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_NAME=your_database_name
   SEED=false

   # AWS Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key_id
   AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
   AWS_REGION=your_aws_region

   # S3 Configuration
   S3_BUCKET_NAME=your_s3_bucket_name

   # Server Configuration
   PORT=3000

   # File Upload Configuration
   UPLOAD_DIR=music

   # Temporary HLS Directory
   TEMP_HLS_DIR=temp/hls
   ```

   Replace the placeholder values with your actual configuration details.

## Running the Application

1. Ensure FFmpeg is properly installed and accessible from the command line.

2. Start the server:
   ```
   npm start
   ```

3. The application should now be running on `http://localhost:3000`.

## Usage

1. Open a web browser and navigate to `http://localhost:3000/app`.

2. You'll see a list of albums. Click on an album to view its songs.

3. Click on a song to play it using the built-in audio player.

4. To upload new music files, use the API endpoint described below. The application will use FFmpeg to convert the uploaded files to the HLS format for streaming.

## API Endpoints

- `GET /music_files/list`: Retrieve a list of all music files
- `POST /music_files/upload`: Upload a new music file (requires FFmpeg for conversion)

For more detailed API documentation, please refer to the API documentation file (if available) or the source code.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

