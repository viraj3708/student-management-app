// Script to monitor GitHub Pages deployment progress
const https = require('https');

function monitorDeployment() {
    console.log('Monitoring GitHub Pages deployment...');
    console.log('Repository: viraj3708/student-management-app');
    console.log('Deployment triggered at:', new Date().toLocaleString());
    console.log('');

    // Check deployment status every 30 seconds for up to 10 minutes
    let attempts = 0;
    const maxAttempts = 20; // 10 minutes (20 * 30 seconds)
    const interval = 30000; // 30 seconds

    const checkStatus = () => {
        attempts++;
        console.log(`Checking deployment status (attempt ${attempts}/${maxAttempts})...`);

        const url = 'https://viraj3708.github.io/student-management-app/';
        
        const req = https.get(url, (res) => {
            console.log(`Status Code: ${res.statusCode}`);
            
            if (res.statusCode === 200) {
                // Get content to check if it's the correct built version
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    // Check if the content contains the built JavaScript reference
                    if (data.includes('/student-management-app/assets/') && 
                        data.includes('.js') && 
                        !data.includes('/src/main.jsx')) {
                        console.log('✅ SUCCESS: GitHub Pages site is accessible with correct assets!');
                        console.log('✅ Your Student Management App deployment is FIXED.');
                        console.log('');
                        console.log('🔗 Visit: https://viraj3708.github.io/student-management-app/');
                        console.log('✅ The application should now load correctly.');
                    } else if (data.includes('/src/main.jsx')) {
                        console.log('⚠️  WARNING: Site is still loading development assets');
                        console.log('⏳ Deployment may still be in progress...');
                        if (attempts < maxAttempts) {
                            console.log(`⏳ Next check in ${interval/1000} seconds...`);
                            setTimeout(checkStatus, interval);
                        } else {
                            console.log('❌ Max attempts reached. Deployment may have failed.');
                            console.log('🔧 Troubleshooting steps:');
                            console.log('   1. Check GitHub Actions workflow in your repository');
                            console.log('   2. Ensure the build process completes successfully');
                            console.log('   3. Verify the dist folder contains built assets');
                        }
                    } else {
                        console.log('ℹ️  INFO: Site is accessible but content needs verification');
                        console.log('🔗 Visit: https://viraj3708.github.io/student-management-app/');
                    }
                });
            } else if (res.statusCode === 404) {
                console.log('⚠️  WARNING: Site not found (404)');
                console.log('⏳ Deployment may still be in progress...');
                if (attempts < maxAttempts) {
                    console.log(`⏳ Next check in ${interval/1000} seconds...`);
                    setTimeout(checkStatus, interval);
                } else {
                    console.log('❌ Max attempts reached. Deployment may have failed.');
                    console.log('🔧 Troubleshooting steps:');
                    console.log('   1. Check GitHub Actions workflow in your repository');
                    console.log('   2. Ensure GitHub Pages is enabled in repository settings');
                }
            } else {
                console.log(`⚠️  WARNING: Unexpected status code ${res.statusCode}`);
                if (attempts < maxAttempts) {
                    console.log(`⏳ Next check in ${interval/1000} seconds...`);
                    setTimeout(checkStatus, interval);
                }
            }
        });

        req.on('error', (error) => {
            console.log(`❌ ERROR: ${error.message}`);
            if (attempts < maxAttempts) {
                console.log(`⏳ Next check in ${interval/1000} seconds...`);
                setTimeout(checkStatus, interval);
            }
        });

        req.end();
    };

    // Start the first check
    checkStatus();
}

// Run the monitor
monitorDeployment();