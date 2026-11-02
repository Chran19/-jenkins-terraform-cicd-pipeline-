const http = require('http');

const PORT = process.env.PORT || 80;
const HOST = '0.0.0.0';

const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const responsePayload = {
        status: 'SUCCESS',
        service: 'CI/CD Automated Application',
        author: 'Ranjeet Choudhary',
        prn: '202301100046',
        course: 'Cloud Native Application Development (CNAD)',
        pipeline: 'Jenkins CI/CD Pipeline',
        infrastructure: 'AWS EC2 via Terraform IaC',
        timestamp: new Date().toISOString()
    };
    res.end(JSON.stringify(responsePayload, null, 2));
});

if (require.main === module) {
    server.listen(PORT, HOST, () => {
        console.log(`[INFO] Server listening on http://${HOST}:${PORT}`);
    });
}

module.exports = server;
