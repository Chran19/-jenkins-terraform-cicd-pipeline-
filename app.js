const http = require('http');
const os = require('os');
const url = require('url');

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';

// Student & Project Metadata
const METADATA = {
    appName: 'Cloud Native CI/CD & Terraform Dashboard',
    version: '2.5.0',
    studentName: 'Ranjeet Choudhary',
    prn: '202301100046',
    course: 'Cloud Native Application Development (CNAD)',
    academicYear: '2026',
    repoUrl: 'https://github.com/Chran19/-jenkins-terraform-cicd-pipeline-',
    cloudProvider: 'Amazon Web Services (AWS)',
    awsRegion: 'ap-south-1 (Mumbai)'
};

// Terraform IaC State Snapshot
const TERRAFORM_STATE = {
    workspace: 'default',
    version: '1.5.7',
    provider: 'hashicorp/aws v5.40.0',
    region: 'ap-south-1',
    lockStatus: 'Synchronized (No Drift)',
    resources: [
        {
            type: 'data.aws_ami.ubuntu',
            name: 'ubuntu_jammy_latest',
            details: 'Canonical Ubuntu 22.04 LTS (HVM:EBS-SSD)',
            status: 'Resolved'
        },
        {
            type: 'aws_security_group',
            name: 'jenkins_app_sg',
            details: 'Ingress: Ports 22 (SSH), 80 (HTTP) | Egress: All (-1)',
            status: 'Active'
        },
        {
            type: 'aws_instance',
            name: 'app_server',
            details: 't2.micro (1 vCPU, 1 GiB RAM) | UserData: Docker Bootstrap',
            status: 'Running'
        }
    ],
    outputs: {
        ec2_public_ip: '13.233.142.89',
        security_group_id: 'sg-0a8b417df8992c10b',
        application_url: 'http://13.233.142.89:80'
    }
};

// Jenkins Pipeline Stage Data
const PIPELINE_STAGES = [
    { id: 1, name: 'Checkout SCM', status: 'SUCCESS', duration: '4s', command: 'git checkout scm (main branch)' },
    { id: 2, name: 'Lint & Unit Test', status: 'SUCCESS', duration: '9s', command: 'npm test (3/3 assertions passed)' },
    { id: 3, name: 'Docker Build', status: 'SUCCESS', duration: '28s', command: 'docker build -t cnad-cicd-webapp:latest .' },
    { id: 4, name: 'Terraform IaC', status: 'SUCCESS', duration: '45s', command: 'terraform init && plan && apply -auto-approve' },
    { id: 5, name: 'Deploy to Cloud', status: 'SUCCESS', duration: '12s', command: 'docker run -d -p 80:80 on AWS EC2 instance' }
];

// Helper: Get System Metrics
function getSystemMetrics() {
    return {
        hostname: os.hostname(),
        platform: os.platform() + ' ' + os.release(),
        architecture: os.arch(),
        uptimeSeconds: Math.floor(os.uptime()),
        freeMemoryMB: Math.round(os.freemem() / (1024 * 1024)),
        totalMemoryMB: Math.round(os.totalmem() / (1024 * 1024)),
        cpuCores: os.cpus().length,
        nodeVersion: process.version,
        processMemoryMB: Math.round(process.memoryUsage().rss / (1024 * 1024))
    };
}

// Generate Modern HTML Dashboard
function renderDashboardHTML(activeTab = 'overview') {
    const metrics = getSystemMetrics();
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${METADATA.appName} | ${METADATA.studentName}</title>
    <style>
        :root {
            --bg-primary: #0b0f19;
            --bg-card: #151d30;
            --bg-card-hover: #1c263d;
            --accent-blue: #3b82f6;
            --accent-emerald: #10b981;
            --accent-purple: #8b5cf6;
            --accent-amber: #f59e0b;
            --text-main: #f8fafc;
            --text-muted: #94a3b8;
            --border-color: #263352;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; }
        body { background: var(--bg-primary); color: var(--text-main); min-height: 100vh; padding: 24px; }
        .container { max-width: 1200px; margin: 0 auto; }
        
        /* Top Navigation Header */
        header {
            background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
            border: 1px solid #3730a3;
            border-radius: 16px;
            padding: 24px 32px;
            margin-bottom: 24px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 16px;
        }
        .header-title h1 { font-size: 24px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 10px; }
        .header-title p { color: var(--text-muted); font-size: 14px; margin-top: 4px; }
        .student-pill {
            background: rgba(99, 102, 241, 0.2);
            border: 1px solid rgba(99, 102, 241, 0.5);
            padding: 10px 18px;
            border-radius: 12px;
            text-align: right;
        }
        .student-pill .name { font-size: 15px; font-weight: 600; color: #a5b4fc; }
        .student-pill .prn { font-size: 13px; color: var(--accent-emerald); font-weight: 500; }

        /* KPI Quick Stats Row */
        .kpi-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .kpi-card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 20px;
            transition: transform 0.2s, border-color 0.2s;
        }
        .kpi-card:hover { transform: translateY(-2px); border-color: var(--accent-blue); }
        .kpi-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 8px; }
        .kpi-val { font-size: 22px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
        .badge-success { color: var(--accent-emerald); background: rgba(16, 185, 129, 0.15); font-size: 12px; padding: 4px 8px; border-radius: 6px; }

        /* Section Layout */
        .section-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
        @media(max-width: 900px) { .section-grid { grid-template-columns: 1fr; } }
        
        .card {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            padding: 24px;
        }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; }
        .card-header h2 { font-size: 18px; font-weight: 600; display: flex; align-items: center; gap: 8px; }

        /* Pipeline Stages */
        .pipeline-track { display: flex; flex-direction: column; gap: 12px; }
        .stage-box {
            background: #0f172a;
            border: 1px solid var(--border-color);
            border-radius: 10px;
            padding: 14px 18px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .stage-box.success { border-left: 4px solid var(--accent-emerald); }
        .stage-info .title { font-weight: 600; font-size: 14px; }
        .stage-info .cmd { font-size: 12px; color: var(--text-muted); font-family: 'Consolas', monospace; margin-top: 4px; }
        .stage-status { font-size: 12px; font-weight: 600; color: var(--accent-emerald); background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 20px; }

        /* Terraform Resource Table */
        .tf-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .tf-table th { text-align: left; padding: 10px; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
        .tf-table td { padding: 12px 10px; border-bottom: 1px solid #1c263d; }
        .tf-code { font-family: 'Consolas', monospace; color: #38bdf8; }

        /* Live Endpoints Footer */
        .endpoint-bar {
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 14px;
            padding: 18px 24px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
        }
        .endpoint-links a {
            color: #93c5fd;
            text-decoration: none;
            background: #1e293b;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 13px;
            margin-right: 8px;
            transition: all 0.2s;
        }
        .endpoint-links a:hover { background: var(--accent-blue); color: #fff; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Main Top Bar -->
        <header>
            <div class="header-title">
                <h1>⚡ Cloud Native DevOps Dashboard</h1>
                <p>Automated CI/CD Pipeline with Jenkins & Infrastructure as Code via Terraform on AWS</p>
            </div>
            <div class="student-pill">
                <div class="name">👤 ${METADATA.studentName}</div>
                <div class="prn">PRN: ${METADATA.prn} | ${METADATA.course}</div>
            </div>
        </header>

        <!-- KPI Metrics Grid -->
        <div class="kpi-row">
            <div class="kpi-card">
                <div class="kpi-label">Service Health</div>
                <div class="kpi-val"><span class="badge-success">● HEALTHY</span> HTTP 200</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">CI/CD Automation</div>
                <div class="kpi-val"><span class="badge-success">✔ 5/5 PASSED</span> Jenkins</div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Cloud Infrastructure</div>
                <div class="kpi-val">AWS EC2 <span style="font-size:12px; color:#94a3b8; font-weight:normal;">(${TERRAFORM_STATE.region})</span></div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">Public IP Endpoint</div>
                <div class="kpi-val" style="font-size: 18px; color: #38bdf8;">${TERRAFORM_STATE.outputs.ec2_public_ip}</div>
            </div>
        </div>

        <!-- Two Column Content Grid -->
        <div class="section-grid">
            <!-- Left: Jenkins Pipeline Stages -->
            <div class="card">
                <div class="card-header">
                    <h2>🚀 Jenkins CI/CD Pipeline Stages</h2>
                    <span class="badge-success">Build #12 Passed</span>
                </div>
                <div class="pipeline-track">
                    ${PIPELINE_STAGES.map(s => `
                    <div class="stage-box success">
                        <div class="stage-info">
                            <div class="title">Stage ${s.id}: ${s.name}</div>
                            <div class="cmd">${s.command}</div>
                        </div>
                        <div class="stage-status">${s.status} (${s.duration})</div>
                    </div>`).join('')}
                </div>
            </div>

            <!-- Right: Terraform IaC Resources -->
            <div class="card">
                <div class="card-header">
                    <h2>🛡️ Terraform Provisioned Infrastructure</h2>
                    <span style="font-size:12px; color:#38bdf8; background:#0c4a6e; padding:4px 8px; border-radius:6px;">Terraform v${TERRAFORM_STATE.version}</span>
                </div>
                <table class="tf-table">
                    <thead>
                        <tr>
                            <th>Resource Type</th>
                            <th>Resource Name / Details</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${TERRAFORM_STATE.resources.map(r => `
                        <tr>
                            <td class="tf-code">${r.type}</td>
                            <td><strong>${r.name}</strong><br><span style="color:#94a3b8; font-size:12px;">${r.details}</span></td>
                            <td><span class="badge-success">✔ ${r.status}</span></td>
                        </tr>`).join('')}
                    </tbody>
                </table>
                <div style="margin-top: 16px; padding: 12px; background: #0f172a; border-radius: 8px; font-size: 12px;">
                    <strong>Security Group Ingress Rules:</strong> Port 22 (SSH Admin) & Port 80 (HTTP Web Service)
                </div>
            </div>
        </div>

        <!-- Telemetry & API Endpoints Bar -->
        <div class="endpoint-bar">
            <div>
                <span style="font-weight:600; font-size:14px;">🖥️ System Telemetry:</span>
                <span style="color:var(--text-muted); font-size:13px; margin-left:8px;">Node ${metrics.nodeVersion} | Memory: ${metrics.processMemoryMB} MB | Platform: ${metrics.platform}</span>
            </div>
            <div class="endpoint-links">
                <span style="font-size:13px; color:var(--text-muted); margin-right:8px;">Explore APIs:</span>
                <a href="/api/status" target="_blank">/api/status</a>
                <a href="/api/metrics" target="_blank">/api/metrics</a>
                <a href="/api/terraform" target="_blank">/api/terraform</a>
                <a href="/api/pipeline" target="_blank">/api/pipeline</a>
            </div>
        </div>
    </div>
</body>
</html>`;
}

// HTTP Server Handler
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // CORS & Common Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('X-Student-Author', METADATA.studentName);
    res.setHeader('X-Student-PRN', METADATA.prn);

    // Route: HTML Dashboard UI
    if (pathname === '/' || pathname === '/dashboard') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderDashboardHTML());
        return;
    }

    // Route: Dedicated Terraform UI page
    if (pathname === '/terraform') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderDashboardHTML('terraform'));
        return;
    }

    // Route: Dedicated Pipeline UI page
    if (pathname === '/pipeline') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(renderDashboardHTML('pipeline'));
        return;
    }

    // Route: REST API - Status & Metadata
    if (pathname === '/api/status') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'HEALTHY',
            code: 200,
            metadata: METADATA,
            timestamp: new Date().toISOString()
        }, null, 2));
        return;
    }

    // Route: REST API - System Metrics
    if (pathname === '/api/metrics') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'SUCCESS',
            metrics: getSystemMetrics(),
            timestamp: new Date().toISOString()
        }, null, 2));
        return;
    }

    // Route: REST API - Terraform Resources & Outputs
    if (pathname === '/api/terraform') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'SUCCESS',
            terraform: TERRAFORM_STATE,
            timestamp: new Date().toISOString()
        }, null, 2));
        return;
    }

    // Route: REST API - Jenkins Pipeline Stages
    if (pathname === '/api/pipeline') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'SUCCESS',
            stages: PIPELINE_STAGES,
            timestamp: new Date().toISOString()
        }, null, 2));
        return;
    }

    // 404 Fallback
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint Not Found', pathname }, null, 2));
});

if (require.main === module) {
    server.listen(PORT, HOST, () => {
        console.log(`================================================================`);
        console.log(`  🚀 ${METADATA.appName}`);
        console.log(`  👤 Author: ${METADATA.studentName} | PRN: ${METADATA.prn}`);
        console.log(`  🌐 Server running at: http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
        console.log(`  📡 REST API: http://localhost:${PORT}/api/status`);
        console.log(`================================================================`);
    });
}

module.exports = server;
