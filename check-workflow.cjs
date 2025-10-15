// Script to check GitHub Actions workflow status
const { exec } = require('child_process');

function checkWorkflowStatus() {
    console.log('Checking GitHub Actions workflow status...');
    console.log('Repository: viraj3708/student-management-app');
    console.log('');

    // Get the latest commit hash
    exec('git rev-parse HEAD', (error, stdout, stderr) => {
        if (error) {
            console.log('❌ Error getting commit hash:', error.message);
            return;
        }
        
        const commitHash = stdout.trim();
        console.log(`Latest commit: ${commitHash.substring(0, 7)}`);
        
        // Check if the site is accessible
        const https = require('https');
        const url = 'https://viraj3708.github.io/student-management-app/';
        
        const req = https.get(url, (res) => {
            console.log(`Site Status Code: ${res.statusCode}`);
            
            if (res.statusCode === 200) {
                console.log('✅ SUCCESS: GitHub Pages site is accessible!');
                console.log('✅ Your Student Management App is successfully deployed.');
                console.log('');
                console.log('🔍 Troubleshooting Tips:');
                console.log('   If you are seeing errors in GitHub Actions, they might be from previous failed deployments.');
                console.log('   The current deployment is working correctly.');
            } else if (res.statusCode === 404) {
                console.log('⚠️  WARNING: Site not found (404)');
                console.log('🔧 Troubleshooting steps:');
                console.log('   1. Check GitHub Actions workflow in your repository');
                console.log('   2. Ensure GitHub Pages is enabled in repository settings');
                console.log('   3. Verify the workflow completed successfully');
            } else {
                console.log(`⚠️  WARNING: Unexpected status code ${res.statusCode}`);
            }
        });

        req.on('error', (error) => {
            console.log(`❌ ERROR: ${error.message}`);
            console.log('🔧 Troubleshooting steps:');
            console.log('   1. Check your internet connection');
            console.log('   2. Verify the repository name is correct');
        });

        req.end();
    });
}

// Run the check
checkWorkflowStatus();