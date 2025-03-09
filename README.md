<img src="https://github.com/user-attachments/assets/777ff08d-1db2-4d60-8f54-b2c4093ad69c" width="200" height="200" style="border-radius:24px"/>

# Video Diary App

A React Native application that allows users to import, crop, and manage video clips with associated metadata.


- **Video Import**: Select videos from your device gallery
- **Video Trimming**: Crop specific segments (5 or 10 seconds) from imported videos
- **Metadata Management**: Add and edit details such as name and description for each video
- **Video List**: Browse through previously cropped videos
- **Details View**: View saved videos with their associated metadata
- **Persistent Storage**: SQLite database integration for reliable data storage
- **Save to Gallery**: Export cropped videos to your device gallery
- **Localization**: Multi-language support for international users

## Tech Stack

- **Expo**: Base framework for React Native development
- **Expo Router**: Navigation implementation
- **Zustand**: State management
- **Tanstack Query**: Async logic and FFMPEG process management
- **FFMPEG**: Video processing library
- **NativeWind**: Styling solution
- **Expo Video**: Video rendering and playback
- **Expo SQLite**: Structured, persistent storage
- **React Native Reanimated**: Smooth animations
- **Zod/Yup**: Form validation

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/eserinoglu/video-diary-expo.git
   cd video-diary-expo
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. This app includes native modules so it requires build.
   ```
   npx expo prebuild
   ```

4. Run on emulator:
   ```
   - For iOS
   npm run ios
   - For Android
   npm run android
   ```


## Usage Guide

### Importing and Trimming a Video

1. From the main screen, tap the "New Diary" button to add a new video
2. Select a video from your device gallery
3. Use the scrubber to select the segment you want to trim
4. Choose the duration (5 or 10 seconds) for your clip
5. Tap "Next" to proceed to metadata entry

### Adding Metadata

1. Enter a name for your video clip
2. Add a description with additional details
3. Tap "Save" to process and store the video

### Managing Your Video Library

1. The main screen displays all your saved videos
2. Tap on any video to view its details
3. Use the edit button to modify the video's metadata
4. You can save any video to your device gallery using the export option

### Changing Language

1. Access the settings menu from the main screen
2. Select your preferred language from the available options
3. The app interface will update to reflect your language choice


## License

This project is licensed under the MIT License - see the LICENSE file for details.
