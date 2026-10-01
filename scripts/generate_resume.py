"""Generate the public 2026 resume. Uses only audited portfolio and user-supplied facts."""
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets' / 'resume' / 'saptarshi-ghosh-2026.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
INK = colors.HexColor('#27231f')
RED = colors.HexColor('#973e31')
MUTED = colors.HexColor('#605950')
RULE = colors.HexColor('#b8afa1')
WIDTH, HEIGHT = A4
MARGIN = 18 * mm
CONTENT = WIDTH - 2 * MARGIN

styles = getSampleStyleSheet()
styles.add(ParagraphStyle('Name', fontName='Times-Bold', fontSize=29, leading=31, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle('Role', fontName='Helvetica', fontSize=10, leading=14, textColor=RED, spaceAfter=9))
styles.add(ParagraphStyle('Contact', fontName='Helvetica', fontSize=8.5, leading=12, textColor=MUTED))
styles.add(ParagraphStyle('SectionLabel', fontName='Helvetica-Bold', fontSize=9, leading=12, textColor=RED, spaceBefore=13, spaceAfter=7))
styles.add(ParagraphStyle('Entry', fontName='Helvetica-Bold', fontSize=10.2, leading=14, textColor=INK, spaceAfter=3))
styles.add(ParagraphStyle('Dates', fontName='Helvetica', fontSize=8.5, leading=14, textColor=MUTED, alignment=TA_RIGHT))
styles.add(ParagraphStyle('BodyCopy', fontName='Helvetica', fontSize=9.4, leading=13.2, textColor=INK, spaceAfter=6))
styles.add(ParagraphStyle('Fine', fontName='Helvetica', fontSize=8.4, leading=11.5, textColor=MUTED, spaceAfter=5))
styles.add(ParagraphStyle('ProjectBody', parent=styles['BodyCopy'], fontSize=9.2, leading=12.2, spaceAfter=3))
styles.add(ParagraphStyle('ProjectFine', parent=styles['Fine'], spaceAfter=3))
styles.add(ParagraphStyle('Subheader', fontName='Times-Bold', fontSize=19, leading=22, textColor=INK, spaceAfter=7))
story = []

def para(text, style='BodyCopy'):
    return Paragraph(text, styles[style])

def link(url, label):
    return f'<a href="{escape(url)}" color="#973e31">{escape(label)}</a>'

def section(title):
    story.append(para(title.upper(), 'SectionLabel'))
    rule = Table([['']], colWidths=[CONTENT], rowHeights=[0.6])
    rule.setStyle(TableStyle([('BACKGROUND', (0, 0), (-1, -1), RULE), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0)]))
    story.extend([rule, Spacer(1, 7)])

def entry(title, date, subtitle='', body=''):
    heading = Table([[para(title, 'Entry'), para(date, 'Dates')]], colWidths=[CONTENT * 0.7, CONTENT * 0.3])
    heading.setStyle(TableStyle([('VALIGN', (0, 0), (-1, -1), 'TOP'), ('LEFTPADDING', (0, 0), (-1, -1), 0), ('RIGHTPADDING', (0, 0), (-1, -1), 0), ('TOPPADDING', (0, 0), (-1, -1), 0), ('BOTTOMPADDING', (0, 0), (-1, -1), 0)]))
    story.append(heading)
    if subtitle:
        story.append(para(subtitle, 'Fine'))
    if body:
        story.append(para(body))
    story.append(Spacer(1, 5))

def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(MARGIN, 14 * mm, WIDTH - MARGIN, 14 * mm)
    canvas.setFont('Helvetica', 7)
    canvas.setFillColor(MUTED)
    canvas.drawString(MARGIN, 10 * mm, 'SAPTARSHI GHOSH  /  OCTOBER 2026')
    canvas.drawRightString(WIDTH - MARGIN, 10 * mm, f'{doc.page}')
    canvas.restoreState()

story.append(para('Saptarshi Ghosh', 'Name'))
story.append(para('ASSOCIATE SOFTWARE ENGINEER  /  AI &amp; ML  /  CREATIVE DESIGN', 'Role'))
story.append(para('Kolkata, West Bengal, India  |  +91 6296770327  |  ' + link('mailto:saptarshi0777@gmail.com', 'saptarshi0777@gmail.com'), 'Contact'))
story.append(para(link('https://github.com/eliot-99', 'github.com/eliot-99') + '  |  ' + link('https://www.linkedin.com/in/saptarshi-ghosh-rana/', 'LinkedIn: saptarshi-ghosh-rana'), 'Contact'))
story.append(Spacer(1, 13))
story.append(para('Software engineer and 2026 B.Tech CSE (AI/ML) graduate from UEM Kolkata. I work across frontend web development, AI/ML applications and graphic design, combining technical practice with visual storytelling. Vice Chancellor\'s Award recipient and former Lead Designer for Ureckon fest.'))

section('Professional experience')
entry('Associate Software Engineer - Nexaric', 'Sep 2026 - Present', body='Currently working as an Associate Software Engineer, following a three-month frontend web development internship with Nexaric.')
entry('Frontend Web Developer Intern - Nexaric', 'Jun - Aug 2026', 'Three-month internship', 'Worked with React.js, TypeScript, Node.js, Tailwind CSS and AI tools for frontend web development.')

section('Education')
entry('B.Tech in CSE (Artificial Intelligence & Machine Learning)', '2022 - 2026', 'University of Engineering and Management, Kolkata', 'Graduated in 2026. <b>CGPA: 8.50 / 10.</b>')
entry('Higher Secondary (WBCHSE) - Science', '2022', 'Hoomgarh Chandabila High School, West Bengal', 'Physics, Chemistry and Mathematics. <b>89%.</b>')
entry('Secondary Education (WBBSE)', '2020', 'Hoomgarh Chandabila High School, West Bengal', '<b>80%.</b>')

section('Technical & creative skills')
skill_rows = [
    ('Frontend & web', 'React.js, TypeScript, JavaScript, HTML, CSS, Tailwind CSS, Flask, WebSockets, PWA'),
    ('Programming & data', 'Python, Java, C, SQL, MySQL, MongoDB, Node.js, NumPy, Pandas'),
    ('AI & machine learning', 'TensorFlow, Keras, Scikit-learn, OpenCV, AI tools'),
    ('Visualization', 'Matplotlib, Seaborn'),
    ('Tools & systems', 'Git, GitHub, Linux, Docker, n8n automation, Arduino, Raspberry Pi'),
    ('Design', 'Adobe Photoshop, Illustrator, Figma, Premiere Pro'),
    ('Fundamentals', 'Object-oriented programming, Operating Systems, Database Management Systems'),
]
for title, body in skill_rows:
    story.append(para(f'<b>{escape(title)}:</b> {escape(body)}'))

story.append(PageBreak())
story.append(para('Selected work & recognition', 'Subheader'))
story.append(para('Personal projects across computer vision, AI, data science and the web.', 'Fine'))

section('Projects')
projects = [
    ('PPE Detection for Construction Site Safety', 'YOLOv8 / Python / PyTorch / OpenCV', 'https://github.com/eliot-99/PPE-Detection-for-Construction-Site-Safety-using-YoloV8', 'Developed a computer vision system to detect personal protective equipment on construction sites. Implemented training and inference pipelines for real-time helmet and vest detection; prototype testing explored a potential 20% accident reduction in simulated environments.'),
    ('LinkedAI - AI Post Creation Platform', 'Flask / Python / HTML / CSS / JavaScript', 'https://github.com/eliot-99/LinkedAI', 'Built a web-based platform for image annotation and machine learning model training, streamlining dataset preparation for computer vision. The interface enabled over 50 users to annotate images during initial testing.'),
    ('Plant Disease Detection Using CNN', 'TensorFlow / Keras / Python / CNN', 'https://github.com/eliot-99/Plant-Disease-Detection-Using-CNN-', 'Designed a CNN-based system to detect plant diseases from leaf images for early agricultural diagnosis. Trained and deployed a prototype classifier for multiple disease categories.'),
    ('DataScope - AI-Powered Data Analysis Platform', 'Flask / Python / Google Gemini AI', 'https://github.com/eliot-99/DataScope', 'Built a web application for statistical analysis, visualizations, automated data-quality assessment, AI insights and machine learning readiness recommendations.'),
    ('AI Quiz Hub - Intelligent Quiz Platform', 'Next.js / TypeScript / Llama AI / Vanta.js', 'https://github.com/eliot-99/AI-Quiz-Hub', 'Created an AI-powered quiz platform with English, Hindi and Bengali support, 3D backgrounds, audio and analytics. Generates 50-question quizzes with Meta\'s Llama 3.1 70B model through OpenRouter.'),
    ('Interactive Portfolio Website', 'HTML5 / CSS3 / JavaScript / Responsive Design', 'https://github.com/eliot-99/Portfolio', 'Designed and developed a responsive portfolio with animations, interactive elements and mobile navigation, showcasing software projects, design and photography.'),
]
for title, stack, repo, body in projects:
    story.append(para(escape(title), 'Entry'))
    story.append(para(escape(stack) + '  |  ' + link(repo, 'Repository'), 'ProjectFine'))
    story.append(para(escape(body), 'ProjectBody'))
    story.append(Spacer(1, 2))

section('Achievements')
awards = [
    ('Vice Chancellor\'s Award - UEM Kolkata (2024)', 'https://drive.google.com/file/d/1iKrvPGfMwMD-flTtJdX6ROjabFrz1AQz/view'),
    ('1st Position, Ray Imagine Poster Design Competition (2024)', 'https://drive.google.com/file/d/1kttAtTQNQbuUi62F0B85XV8mjHF0AIP_/view'),
]
for label, url in awards:
    story.append(para(escape(label) + '  |  ' + link(url, 'Certificate')))
story.append(para('Lead Designer, Ureckon techno-management fest, UEM Kolkata (2023-2024). Managed creative direction and the design team.'))

section('Certifications')
certs = [
    ('Machine Learning & Data Science - GeeksforGeeks', 'https://drive.google.com/file/d/1FApuSq34ejQMMrXHg8_-G8LO3gDL-Kq-/view'),
    ('Python for Data Science, AI & Development - IBM', 'https://drive.google.com/file/d/1vAlAkDDJxQ89AIWmkE65xWWqFiB7W1S-/view'),
    ('Cloud Computing - LinkedIn Learning', 'https://drive.google.com/file/d/1hRdEWhfBssgOichYMN1DherrUhisY_6f/view'),
    ('Photoshop 2024 Essential Training - LinkedIn Learning', 'https://drive.google.com/file/d/1Fv5aQup0dgsidaB8jXCKQ1ayl8fgkPV3/view'),
]
for label, url in certs:
    story.append(para(link(url, label) + ' (2024)', 'Fine'))
story.append(Spacer(1, 8))
story.append(para('<b>Interests:</b> Photography, travelling and filmmaking.', 'Fine'))

doc = SimpleDocTemplate(str(OUT), pagesize=A4, leftMargin=MARGIN, rightMargin=MARGIN, topMargin=17 * mm, bottomMargin=20 * mm, title='Saptarshi Ghosh - Resume 2026', author='Saptarshi Ghosh', subject='Software Engineering, AI/ML and Creative Design')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUT)
