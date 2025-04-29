# Installation Guide 🚀

## Web Version

The easiest way to play Number Crunch is through our web version:
1. Visit [https://volkanbatur.github.io/number-crunch-game](https://volkanbatur.github.io/number-crunch-game)
2. Start playing immediately - no installation required!

## Desktop Application

### Prerequisites
- macOS 10.13 or later
- Windows 10 or later
- Linux (Ubuntu 18.04 or equivalent)

### Installation Steps

#### macOS
1. Download the latest `.dmg` file from our [Releases page](https://github.com/volkanbatur/number-crunch-game/releases)
2. Open the downloaded `.dmg` file
3. Drag Number Crunch to your Applications folder
4. Open the app from your Applications folder

#### Windows
1. Download the latest `.exe` installer from our [Releases page](https://github.com/volkanbatur/number-crunch-game/releases)
2. Run the installer
3. Follow the installation wizard
4. Launch Number Crunch from the Start menu

#### Linux
1. Download the latest `.AppImage` file from our [Releases page](https://github.com/volkanbatur/number-crunch-game/releases)
2. Make the file executable:
   ```bash
   chmod +x NumberCrunch.AppImage
   ```
3. Run the application:
   ```bash
   ./NumberCrunch.AppImage
   ```

## Development Setup

If you want to run the game locally for development:

1. Clone the repository:
   ```bash
   git clone https://github.com/volkanbatur/number-crunch-game.git
   cd number-crunch-game
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Troubleshooting

### Common Issues

1. **App won't start**
   - Check if you meet the system requirements
   - Try reinstalling the application
   - Clear your browser cache (for web version)

2. **Installation fails**
   - Make sure you have administrator privileges
   - Check your disk space
   - Disable antivirus temporarily

3. **Development setup issues**
   - Make sure you have Node.js 20.x or later installed
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall dependencies

### Getting Help

If you encounter any issues:
1. Check our [FAQ](./FAQ.md)
2. Search existing [Issues](https://github.com/volkanbatur/number-crunch-game/issues)
3. Create a new issue with detailed information about your problem 