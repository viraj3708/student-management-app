// Final Deployment Check Script
const https = require('https');

console.log('=== GitHub Pages Deployment Check ===');
console.log('Repository: viraj3708/student-management-app');
console.log('Expected URL: https://viraj3708.github.io/student-management-app/');
console.log('');

function checkDeployment() {
    console.log('Checking current deployment status...');
    
    const url = 'https://viraj3708.github.io/student-management-app/';
    
    const req = https.get(url, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        
        if (res.statusCode === 200) {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log('');
                console.log('=== ANALYSIS ===');
                
                if (data.includes('/student-management-app/assets/') && 
                    data.includes('.js') && 
                    !data.includes('/src/main.jsx')) {
                    console.log('✅ SUCCESS: Site is loading PRODUCTION assets correctly');
                    console.log('✅ Deployment is WORKING');
                    console.log('');
                    console.log('🔗 Visit: https://viraj3708.github.io/student-management-app/');
                } else if (data.includes('/src/main.jsx')) {
                    console.log('❌ ISSUE: Site is loading DEVELOPMENT assets');
                    console.log('❌ Deployment is NOT WORKING correctly');
                    console.log('');
                    console.log('=== IMMEDIATE ACTION REQUIRED ===');
                    console.log('1. Go to your repository GitHub Actions');
                    console.log('2. Check the latest Deploy to GitHub Pages workflow');
                    console.log('3. Look for errors in the build process');
                    console.log('4. Follow the steps in DEPLOYMENT-ACTION-PLAN.md');
                } else {
                    console.log('⚠️  UNCLEAR: Site is accessible but content needs verification');
                    console.log('🔗 Visit: https://viraj3708.github.io/student-management-app/');
                }
                
                console.log('');
                console.log('=== NEXT STEPS ===');
                if (data.includes('/src/main.jsx')) {
                    console.log('📄 Review: GITHUB-ACTIONS-TROUBLESHOOTING.md');
                    console.log('📋 Follow: DEPLOYMENT-ACTION-PLAN.md');
                    console.log('🔧 Try: Clearing GitHub Pages cache in repository settings');
                } else {
                    console.log('✅ Deployment is successful!');
                    console.log('📝 You can now share the URL with users');
                }
            });
        } else {
            console.log('❌ ERROR: Site is not accessible');
            console.log('🔧 Troubleshooting steps:');
            console.log('   1. Check GitHub Actions workflow');
            console.log('   2. Verify GitHub Pages is enabled');
            console.log('   3. Check repository settings');
        }
    });

    req.on('error', (error) => {
        console.log(`❌ CONNECTION ERROR: ${error.message}`);
        console.log('🔧 Troubleshooting steps:');
        console.log('   1. Check your internet connection');
        console.log('   2. Verify the repository URL is correct');
        console.log('   3. Ensure you have access to the repository');
    });

    req.end();
}

// Run the check
checkDeployment();