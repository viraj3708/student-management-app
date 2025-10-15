# GitHub Pages Setup Guide for Student Management App

## Overview

This guide will help you set up GitHub Pages to host your Student Management Application. Once configured, your app will be accessible at:
**https://viraj3708.github.io/student-management-app/**

## Prerequisites

- You must be the repository owner (viraj3708) or have admin access
- The repository must be public (private repositories require GitHub Pro)

## Step-by-Step Setup Instructions

### Step 1: Access Repository Settings

1. Navigate to your repository: https://github.com/viraj3708/student-management-app
2. Click on the **Settings** tab (gear icon) in the top navigation bar

### Step 2: Locate Pages Settings

1. In the left sidebar of the Settings page, scroll down to find **Pages**
2. Click on **Pages** to open the GitHub Pages configuration

### Step 3: Configure GitHub Pages

1. Under the **Build and deployment** section:
   - Find the **Source** dropdown/menu
   - Select **GitHub Actions** from the options
2. Click the **Save** button

### Step 4: Verify Configuration

After clicking "Save", you should see:
- A confirmation message
- The source should now show "GitHub Actions"
- A note about where your site will be available

## What Happens Next

Once you complete these steps:

1. The existing GitHub Actions workflow will automatically run
2. Your site will be deployed to https://viraj3708.github.io/student-management-app/
3. The deployment should complete within 2-5 minutes

## Monitoring Deployment Progress

1. Go to the **Actions** tab in your repository
2. Look for the **Deploy to GitHub Pages** workflow
3. Click on the running or latest workflow to see detailed progress
4. When complete, the status will show as "Success"

## Accessing Your Deployed Application

After successful deployment, your application will be available at:
**https://viraj3708.github.io/student-management-app/**

## Troubleshooting Common Issues

### Issue 1: Pages Not Updating
- Wait 5-10 minutes for changes to propagate
- Make a small change to any file and push to trigger a new workflow
- Check that you're logged in as the repository owner

### Issue 2: 404 Page Not Found
- Verify GitHub Pages is enabled with correct settings
- Check that the workflow completed successfully
- Ensure the repository is public

### Issue 3: Workflow Failing
- Check the Actions tab for error details
- Verify all files are properly committed and pushed
- Ensure package.json and build configurations are correct

## GitHub Actions Workflow Details

This repository includes a pre-configured workflow at `.github/workflows/deploy.yml` that:

1. Automatically builds the application on every push to the main branch
2. Deploys the built files to GitHub Pages
3. Makes the application publicly accessible

## Repository Structure Requirements

The application is configured to work with the following structure:
- Source code in the `main` branch
- Built files deployed to the `gh-pages` branch
- Base URL configured as `/student-management-app/`

## Verification Steps

1. Check that GitHub Pages is enabled in repository settings
2. Verify the workflow runs successfully after each push
3. Test the deployed application at the expected URL
4. Confirm all features work as expected in the browser

## Need Help?

If you encounter any issues:

1. Check the Actions tab for detailed error messages
2. Verify all setup steps were completed correctly
3. Ensure you have the necessary permissions (repository owner)
4. Contact support with specific error details

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Documentation](https://vitejs.dev/)

## Contact Information

**Author**: Santosh Bansode
**Repository Owner**: viraj3708
**Application**: Student Management System

This is a one-time setup process. After initial configuration, your site will automatically update with each new commit to the main branch.