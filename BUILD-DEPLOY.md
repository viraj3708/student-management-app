# Build and Deployment Instructions

## Building the Application

This is a Vite-based React application. Before deploying, you need to build the production version.

### Build Steps

1. **Open Terminal/Command Prompt** in the project directory
2. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```
3. **Build the application**:
   ```bash
   npm run build
   ```
4. **Locate the build output**:
   - The built files will be in the `dist` folder
   - This folder contains all necessary files for deployment

## Deployment Options

### Option 1: GitHub Pages (Static Hosting)

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy to GitHub Pages**:
   - The `dist` folder contains all files needed for GitHub Pages
   - Follow the GitHub Pages setup in repository settings

### Option 2: Any Static Web Host

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Upload files**:
   - Upload the entire contents of the `dist` folder to your web host
   - Ensure the `index.html` is at the root level

### Option 3: Local Installation (EXE)

1. **Use the provided installer**:
   - Double-click the generated EXE file
   - Follow the installation wizard
   - The application will be installed locally

## Testing the Build

Before deployment, test the build locally:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Preview the build**:
   ```bash
   npm run preview
   ```

3. **Check the application**:
   - Visit the URL shown in the terminal (usually http://localhost:4173)
   - Verify all functionality works correctly

## Important Notes

### Data Storage
- All data is stored in the browser's LocalStorage
- When deploying to a new domain, existing data won't transfer
- For production use, consider implementing a backend database

### Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- Requires JavaScript to be enabled

### Performance Optimization
- The build process automatically optimizes files
- Images and assets are compressed
- CSS and JavaScript are minified

## Troubleshooting

### Build Issues
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  npm run build
  ```

### Deployment Issues
- Ensure all files from `dist` folder are uploaded
- Check file permissions on the server
- Verify the web server is configured to serve static files

## Support

For deployment assistance:
- Author: Santosh Bansode
- Refer to DEPLOYMENT-GUIDE.md for step-by-step instructions