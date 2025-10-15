// Script to verify GitHub Pages deployment status
// This script can be run locally to check deployment status

const https = require('https');

function checkDeploymentStatus() {
    console.log('Checking GitHub Pages deployment status...');
    console.log('Repository: viraj3708/student-management-app');
    console.log('Expected URL: https://viraj3708.github.io/student-management-app/');
    console.log('');

    // Check if the site is accessible
    const url = 'https://viraj3708.github.io/student-management-app/';
    
    const req = https.get(url, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
            console.log('✅ SUCCESS: GitHub Pages site is accessible!');
            console.log('✅ Your Student Management App is successfully deployed.');
        } else if (res.statusCode === 404) {
            console.log('⚠️  WARNING: Site not found (404)');
            console.log('🔧 Possible solutions:');
            console.log('   1. Ensure GitHub Pages is enabled in repository settings');
            console.log('   2. Set source to "GitHub Actions"');
            console.log('   3. Wait a few more minutes for deployment to complete');
        } else if (res.statusCode === 301 || res.statusCode === 302) {
            console.log('ℹ️  INFO: Site redirected');
            console.log('   This may be normal during deployment');
        } else {
            console.log(`⚠️  WARNING: Unexpected status code ${res.statusCode}`);
        }
    });

    req.on('error', (error) => {
        if (error.code === 'ENOTFOUND') {
            console.log('❌ ERROR: Could not reach GitHub Pages');
            console.log('🔧 Troubleshooting steps:');
            console.log('   1. Check your internet connection');
            console.log('   2. Verify the repository name is correct');
            console.log('   3. Ensure GitHub Pages is enabled in settings');
        } else {
            console.log(`❌ ERROR: ${error.message}`);
        }
    });

    req.end();

    console.log('');
    console.log('For detailed deployment information, check:');
    console.log('- Repository Settings > Pages');
    console.log('- Repository Actions tab');
    console.log('- GITHUB-PAGES-SETUP-GUIDE.md in your repository');
}

// Run the check
checkDeploymentStatus();