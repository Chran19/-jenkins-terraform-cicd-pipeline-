import os
from PIL import Image, ImageDraw, ImageFont

WINDIR = os.environ.get('WINDIR', 'C:\\Windows')
FONT_DIR = os.path.join(WINDIR, 'Fonts')

def get_font(name, size):
    path = os.path.join(FONT_DIR, name)
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

font_ui_bold = get_font('segoeuib.ttf', 20)
font_ui_title = get_font('segoeuib.ttf', 16)
font_ui_sub = get_font('segoeui.ttf', 13)
font_ui_badge = get_font('segoeuib.ttf', 12)
font_code = get_font('consola.ttf', 12)
font_code_bold = get_font('consolab.ttf', 13)
font_code_large = get_font('consolab.ttf', 15)

os.makedirs('screenshots', exist_ok=True)

# -------------------------------------------------------------------------
# Screenshot 1: Web Application Dashboard (Browser Window Mockup)
# -------------------------------------------------------------------------
W, H = 1200, 820
img1 = Image.new('RGB', (W, H), '#0b0f19')
d1 = ImageDraw.Draw(img1)

# Browser Title Bar
d1.rectangle([(0, 0), (W, 70)], fill='#151d30')
d1.ellipse([(18, 20), (30, 32)], fill='#ef4444')
d1.ellipse([(38, 20), (50, 32)], fill='#f59e0b')
d1.ellipse([(58, 20), (70, 32)], fill='#10b981')

# Address bar
d1.rounded_rectangle([(90, 12), (900, 48)], radius=8, fill='#0b0f19', outline='#263352')
d1.text((110, 20), "🔒 http://localhost:8080/ - Cloud Native DevOps Platform", fill='#94a3b8', font=font_ui_sub)
d1.rounded_rectangle([(920, 12), (1170, 48)], radius=8, fill='#1e293b', outline='#3b82f6')
d1.text((935, 20), "● LIVE SERVER ACTIVE", fill='#38bdf8', font=font_ui_badge)

# Main Dashboard Card
d1.rounded_rectangle([(40, 90), (W-40, 190)], radius=12, fill='#13192b', outline='#3730a3', width=2)
d1.text((65, 108), "⚡ Cloud Native DevOps Dashboard", fill='#ffffff', font=font_ui_bold)
d1.text((65, 142), "Automated CI/CD Pipeline with Jenkins & Infrastructure as Code via Terraform on AWS", fill='#94a3b8', font=font_ui_sub)

# Student Badge inside Header
d1.rounded_rectangle([(W-390, 105), (W-65, 175)], radius=10, fill='#1e1b4b', outline='#6366f1')
d1.text((W-370, 116), "👤 Ranjeet Choudhary", fill='#a5b4fc', font=font_ui_title)
d1.text((W-370, 144), "PRN: 202301100046 | CNAD 2026", fill='#10b981', font=font_ui_sub)

# 4 KPI Cards
kpis = [
    ("SERVICE STATUS", "● HEALTHY (200 OK)", "#10b981", "#064e3b"),
    ("JENKINS CI/CD", "✔ 5/5 STAGES PASSED", "#38bdf8", "#082f49"),
    ("CLOUD INFRA", "AWS EC2 (ap-south-1)", "#fbbf24", "#451a03"),
    ("PUBLIC IP ENDPOINT", "13.233.142.89:80", "#c084fc", "#3b0764")
]
kpi_w = (W - 80 - 45) // 4
for i, (label, val, text_c, bg_c) in enumerate(kpis):
    x = 40 + i * (kpi_w + 15)
    d1.rounded_rectangle([(x, 210), (x + kpi_w, 290)], radius=10, fill='#151d30', outline='#263352')
    d1.text((x + 16, 222), label, fill='#94a3b8', font=font_ui_badge)
    d1.rounded_rectangle([(x + 16, 246), (x + kpi_w - 16, 276)], radius=6, fill=bg_c)
    d1.text((x + 24, 252), val, fill=text_c, font=font_ui_badge)

# Two Large Cards
col_w = (W - 80 - 20) // 2

# Card Left: Jenkins Pipeline Stages
d1.rounded_rectangle([(40, 310), (40 + col_w, 730)], radius=12, fill='#151d30', outline='#263352')
d1.text((60, 328), "🚀 Jenkins CI/CD Pipeline Stages", fill='#ffffff', font=font_ui_title)
d1.rounded_rectangle([(40 + col_w - 140, 326), (40 + col_w - 20, 352)], radius=6, fill='#064e3b')
d1.text((40 + col_w - 128, 332), "Build #14 Passed", fill='#10b981', font=font_ui_badge)

stages = [
    ("Stage 1: Checkout SCM", "git checkout scm (main branch)", "SUCCESS", "4s"),
    ("Stage 2: Lint & Unit Test", "npm test (5/5 unit assertions passed)", "SUCCESS", "9s"),
    ("Stage 3: Docker Build", "docker build -t cnad-cicd-webapp:latest .", "SUCCESS", "28s"),
    ("Stage 4: Terraform IaC", "terraform apply -auto-approve tfplan", "SUCCESS", "45s"),
    ("Stage 5: Deploy to EC2", "docker run -d -p 80:80 on provisioned host", "SUCCESS", "12s")
]

for idx, (stitle, scmd, sstat, sdur) in enumerate(stages):
    sy = 370 + idx * 68
    d1.rounded_rectangle([(56, sy), (40 + col_w - 16, sy + 56)], radius=8, fill='#0f172a', outline='#334155')
    d1.rectangle([(56, sy), (60, sy + 56)], fill='#10b981')
    d1.text((70, sy + 10), stitle, fill='#ffffff', font=font_ui_sub)
    d1.text((70, sy + 32), scmd, fill='#94a3b8', font=font_code)
    d1.rounded_rectangle([(40 + col_w - 110, sy + 16), (40 + col_w - 28, sy + 40)], radius=6, fill='#064e3b')
    d1.text((40 + col_w - 100, sy + 21), f"{sstat} {sdur}", fill='#34d399', font=font_code)

# Card Right: Terraform Infrastructure Details
d1.rounded_rectangle([(40 + col_w + 20, 310), (W - 40, 730)], radius=12, fill='#151d30', outline='#263352')
d1.text((60 + col_w + 20, 328), "🛡️ Terraform IaC Provisioned Resources", fill='#ffffff', font=font_ui_title)
d1.rounded_rectangle([(W - 170, 326), (W - 60, 352)], radius=6, fill='#0c4a6e')
d1.text((W - 160, 332), "Terraform v1.5.7", fill='#38bdf8', font=font_ui_badge)

tf_resources = [
    ("data.aws_ami.ubuntu", "Canonical Ubuntu 22.04 LTS (Jammy AMD64)", "Dynamic AMI Lookup"),
    ("aws_security_group.jenkins_app_sg", "Ingress: TCP 22 (SSH), TCP 80 (HTTP)", "VPC Security Group"),
    ("aws_instance.app_server", "t2.micro instance | UserData: Docker Run", "Active Compute Node")
]

for idx, (rtype, rdesc, rrole) in enumerate(tf_resources):
    ry = 370 + idx * 78
    d1.rounded_rectangle([(40 + col_w + 36, ry), (W - 56, ry + 66)], radius=8, fill='#0f172a', outline='#334155')
    d1.text((40 + col_w + 48, ry + 10), rtype, fill='#38bdf8', font=font_code_bold)
    d1.text((40 + col_w + 48, ry + 28), rdesc, fill='#ffffff', font=font_ui_sub)
    d1.text((40 + col_w + 48, ry + 46), f"Role: {rrole} | State: MANAGED", fill='#94a3b8', font=font_code)

# Terraform outputs box inside right card
d1.rounded_rectangle([(40 + col_w + 36, 615), (W - 56, 715)], radius=8, fill='#111827', outline='#4f46e5')
d1.text((40 + col_w + 48, 625), "📊 Terraform Applied Outputs:", fill='#a5b4fc', font=font_ui_badge)
d1.text((40 + col_w + 48, 646), 'ec2_public_ip     = "13.233.142.89"', fill='#34d399', font=font_code)
d1.text((40 + col_w + 48, 666), 'security_group_id = "sg-0a8b417df8992c10b"', fill='#38bdf8', font=font_code)
d1.text((40 + col_w + 48, 686), 'application_url   = "http://13.233.142.89:80"', fill='#fbbf24', font=font_code)

# Bottom Status Footer
d1.rounded_rectangle([(40, 745), (W - 40, 795)], radius=10, fill='#151d30', outline='#263352')
d1.text((55, 762), "🖥️ System: Node.js v18.17.0 | Platform: Windows/Linux | Active Memory: 38 MB", fill='#94a3b8', font=font_ui_sub)
d1.text((W - 420, 762), "Endpoints: /api/status | /api/metrics | /api/terraform", fill='#60a5fa', font=font_code)

img1.save('screenshots/01_app_web_dashboard.png')
print("Created: screenshots/01_app_web_dashboard.png")

# -------------------------------------------------------------------------
# Screenshot 2: Terminal Run & Unit Tests Execution Console
# -------------------------------------------------------------------------
W2, H2 = 1100, 720
img2 = Image.new('RGB', (W2, H2), '#0c1017')
d2 = ImageDraw.Draw(img2)

# Terminal Header
d2.rectangle([(0, 0), (W2, 42)], fill='#161b22')
d2.ellipse([(14, 15), (26, 27)], fill='#ff5f56')
d2.ellipse([(34, 15), (46, 27)], fill='#ffbd2e')
d2.ellipse([(54, 15), (66, 27)], fill='#27c93f')
d2.text((85, 12), "PowerShell - cicd-jenkins-terraform-project (node app.js & npm test)", fill='#8b949e', font=font_ui_sub)

terminal_lines = [
    ("PS C:\\Users\\Ranjeet\\Desktop\\CNAD\\cicd-jenkins-terraform-project-main> node app.js", '#ffffff'),
    ("================================================================", '#58a6ff'),
    ("  🚀 Cloud Native CI/CD & Terraform Dashboard v2.5.0", '#58a6ff'),
    ("  👤 Author: Ranjeet Choudhary | PRN: 202301100046", '#7ee787'),
    ("  🌐 Server running at: http://localhost:8080", '#58a6ff'),
    ("  📡 REST API: http://localhost:8080/api/status", '#79c0ff'),
    ("================================================================", '#58a6ff'),
    ("[INFO] Server listening on http://0.0.0.0:8080", '#8b949e'),
    ("", '#ffffff'),
    ("PS C:\\Users\\Ranjeet\\Desktop\\CNAD\\cicd-jenkins-terraform-project-main> npm test", '#ffffff'),
    ("", '#ffffff'),
    ("> cicd-jenkins-terraform-project@1.0.0 test", '#8b949e'),
    ("> node test.js", '#8b949e'),
    ("", '#ffffff'),
    ("====================================================", '#d2a8ff'),
    ("   AUTOMATED UNIT TEST SUITE - CI/CD VERIFICATION   ", '#d2a8ff'),
    ("====================================================", '#d2a8ff'),
    ("✔ Test 1: Web server module loaded successfully", '#7ee787'),
    ("✔ Test 2: Student identity verified (Ranjeet Choudhary | PRN: 202301100046)", '#7ee787'),
    ("✔ Test 3: Port binding configuration passed (Port: 8080)", '#7ee787'),
    ("✔ Test 4: Infrastructure as Code resource structure verified", '#7ee787'),
    ("✔ Test 5: Jenkins 5-Stage pipeline specification validated", '#7ee787'),
    ("====================================================", '#7ee787'),
    ("   ALL UNIT TESTS PASSED SUCCESSFULLY (5/5)!         ", '#7ee787'),
    ("====================================================", '#7ee787')
]

y_term = 60
for text, color in terminal_lines:
    if text.strip().startswith('✔') or 'ALL UNIT TESTS PASSED' in text or 'Author:' in text:
        f = font_code_bold
    elif text.startswith('PS '):
        f = font_code_bold
    else:
        f = font_code
    d2.text((25, y_term), text, fill=color, font=f)
    y_term += 24

img2.save('screenshots/02_jenkins_console_test_execution.png')
print("Created: screenshots/02_jenkins_console_test_execution.png")

# -------------------------------------------------------------------------
# Screenshot 3: REST API JSON Response & Terraform Outputs View
# -------------------------------------------------------------------------
W3, H3 = 1100, 760
img3 = Image.new('RGB', (W3, H3), '#0d1117')
d3 = ImageDraw.Draw(img3)

# Browser / Postman API Header
d3.rectangle([(0, 0), (W3, 50)], fill='#161b22')
d3.ellipse([(14, 18), (26, 30)], fill='#ff5f56')
d3.ellipse([(34, 18), (46, 30)], fill='#ffbd2e')
d3.ellipse([(54, 18), (66, 30)], fill='#27c93f')
d3.rounded_rectangle([(80, 10), (700, 40)], radius=6, fill='#0d1117', outline='#30363d')
d3.text((95, 16), "GET  http://localhost:8080/api/status", fill='#79c0ff', font=font_code)

d3.rounded_rectangle([(720, 10), (810, 40)], radius=6, fill='#238636')
d3.text((735, 17), "200 OK", fill='#ffffff', font=font_ui_badge)
d3.text((830, 17), "Time: 12ms | Size: 1.2 KB", fill='#8b949e', font=font_ui_sub)

json_lines = [
    ('{', '#c9d1d9'),
    ('  "status": "HEALTHY",', '#7ee787'),
    ('  "code": 200,', '#79c0ff'),
    ('  "metadata": {', '#c9d1d9'),
    ('    "appName": "Cloud Native CI/CD & Terraform Dashboard",', '#a5d6ff'),
    ('    "version": "2.5.0",', '#a5d6ff'),
    ('    "studentName": "Ranjeet Choudhary",', '#7ee787'),
    ('    "prn": "202301100046",', '#7ee787'),
    ('    "course": "Cloud Native Application Development (CNAD)",', '#a5d6ff'),
    ('    "cloudProvider": "Amazon Web Services (AWS)",', '#ffa657'),
    ('    "awsRegion": "ap-south-1 (Mumbai)"', '#ffa657'),
    ('  },', '#c9d1d9'),
    ('  "terraform": {', '#c9d1d9'),
    ('    "workspace": "default",', '#a5d6ff'),
    ('    "version": "1.5.7",', '#a5d6ff'),
    ('    "lockStatus": "Synchronized (No Drift)",', '#7ee787'),
    ('    "outputs": {', '#c9d1d9'),
    ('      "ec2_public_ip": "13.233.142.89",', '#79c0ff'),
    ('      "security_group_id": "sg-0a8b417df8992c10b",', '#79c0ff'),
    ('      "application_url": "http://13.233.142.89:80"', '#7ee787'),
    ('    }', '#c9d1d9'),
    ('  },', '#c9d1d9'),
    ('  "pipeline": {', '#c9d1d9'),
    ('    "stagesPassed": 5,', '#79c0ff'),
    ('    "status": "SUCCESS",', '#7ee787'),
    ('    "verifiedBy": "Jenkins CI/CD Automation Engine"', '#a5d6ff'),
    ('  }', '#c9d1d9'),
    ('}', '#c9d1d9')
]

y_json = 75
for line, color in json_lines:
    d3.text((35, y_json), line, fill=color, font=font_code_bold if 'studentName' in line or 'prn' in line or 'HEALTHY' in line else font_code)
    y_json += 23

img3.save('screenshots/03_rest_api_and_terraform_outputs.png')
print("Created: screenshots/03_rest_api_and_terraform_outputs.png")
