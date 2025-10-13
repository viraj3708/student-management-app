# Deployment Guide for Student Management App

## Option 1: GitHub Deployment (Recommended)

### Prerequisites
- GitHub account
- Git installed on your computer

### Steps

1. **Create GitHub Repository**
   - Go to https://github.com and sign in
   - Click the "+" icon and select "New repository"
   - Name it "student-management-app"
   - Keep it Public
   - **Do NOT initialize with README**
   - Click "Create repository"

2. **Connect Local Repository to GitHub**
   Open Terminal/Command Prompt in your project folder and run:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/student-management-app.git
   git branch -M main
   git push -u origin main
   ```
   Replace YOUR-USERNAME with your actual GitHub username.

3. **Enable GitHub Pages** (REQUIRED for web hosting)
   - Go to your repository settings on GitHub: https://github.com/viraj3708/student-management-app/settings/pages
   - Under "Build and deployment", select "GitHub Actions" as the source
   - Click "Save"
   - This step is MANDATORY for the application to work

4. **Verify Deployment**
   - Visit: https://github.com/viraj3708/student-management-app/actions to see workflow runs
   - After a successful workflow, your site will be available at: https://viraj3708.github.io/student-management-app

## Option 2: Direct File Upload to GitHub

If the Git method doesn't work:

1. **Download Your Project**
   - Compress your entire project folder into a ZIP file

2. **Upload to GitHub**
   - Go to your new GitHub repository
   - Click "Add file" → "Upload files"
   - Drag and drop your ZIP file
   - Commit changes

## Option 3: Local Deployment

For local use only:

1. **Using the EXE Installer**
   - Double-click the generated EXE file to install the application
   - The application will be installed on your PC
   - Run it from your desktop or start menu

2. **Manual Local Deployment**
   - Keep the project folder as is
   - Open `index.html` in a web browser to run the application

## Troubleshooting

### Common Issues

1. **"Repository not found" error**
   - Make sure you've created the repository on GitHub first
   - Check that the repository name matches exactly
   - Verify your GitHub username is correct

2. **Authentication Issues**
   - Use your GitHub username and personal access token instead of password
   - Or use SSH keys if you're familiar with them

3. **Permission Denied**
   - Make sure you're the owner of the repository
   - Check that you have write permissions

4. **GitHub Pages Not Working**
   - ENSURE GitHub Pages is enabled in repository settings
   - Select "GitHub Actions" as the source in Pages settings
   - Wait for the workflow to complete successfully

### Need Help?

If you continue to have issues:
1. Take a screenshot of any error messages
2. Contact support or share the error details
3. Consider using Option 2 (direct upload) as an alternative

## Contact Information

For support with this application:
- Author: Santosh Bansode
- Email: santoshbansode@example.com

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)