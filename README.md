

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 15mm;
            background-color: #ffffff;
        }
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            color: #2c3e50;
            line-height: 1.5;
            margin: 0;
            padding: 0;
        }
        .header {
            background-color: #1a73e8;
            color: white;
            padding: 40px 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 26pt;
            letter-spacing: 1px;
        }
        .header p {
            font-size: 12pt;
            opacity: 0.9;
            margin-top: 10px;
        }
        .content {
            padding: 30px;
        }
        h2 {
            color: #1a73e8;
            border-left: 5px solid #1a73e8;
            padding-left: 12px;
            font-size: 16pt;
            margin-top: 30px;
            margin-bottom: 15px;
        }
        h3 {
            color: #34495e;
            font-size: 13pt;
            margin-top: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }
        .tech-grid {
            display: table;
            width: 100%;
            margin: 15px 0;
        }
        .tech-col {
            display: table-cell;
            width: 50%;
            padding: 10px;
            vertical-align: top;
        }
        .badge-list {
            margin-top: 5px;
        }
        .badge {
            display: inline-block;
            background-color: #f1f3f4;
            color: #5f6368;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 9pt;
            margin-right: 5px;
            margin-bottom: 5px;
            border: 1px solid #dadce0;
        }
        pre {
            background-color: #282c34;
            color: #abb2bf;
            padding: 15px;
            border-radius: 6px;
            font-size: 9pt;
            overflow-x: hidden;
            white-space: pre-wrap;
        }
        ul {
            padding-left: 20px;
        }
        li {
            margin-bottom: 8px;
        }
        .footer {
            text-align: center;
            font-size: 9pt;
            color: #95a5a6;
            margin-top: 40px;
            padding-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Medlink Healthcare</h1>
        <p>A Full-Stack Mobile Solution for Modern Healthcare Management</p>
    </div>

    <div class="content">
        <h2>Project Overview</h2>
        <p>
            Medlink (also known as <strong>Caresense360</strong>) is an integrated healthcare platform designed to streamline medical appointments and patient-doctor interactions [cite: 2, 27]. The project consists of a high-performance Node.js backend and a feature-rich React Native mobile application [cite: 21, 80].
        </p>

        <h2>Core Features</h2>
        <ul>
            <li><strong>Appointment System:</strong> Complete lifecycle management for healthcare bookings [cite: 22].</li>
            <li><strong>Doctor Management:</strong> Specialized registration and profile management for medical professionals [cite: 23, 85].</li>
            <li><strong>AI Predictions:</strong> Advanced diagnostics modules for organ-specific analysis including lungs, kidneys, and heart [cite: 42, 43, 46].</li>
            <li><strong>Direct Chat:</strong> Real-time messaging between patients and doctors using Gifted Chat [cite: 80].</li>
            <li><strong>Security First:</strong> Robust protection including rate limiting, NoSQL injection prevention, and JWT authentication [cite: 27].</li>
        </ul>

        <h2>Technology Stack</h2>
        <div class="tech-grid">
            <div class="tech-col">
                <h3>Backend (Node.js)</h3>
                <div class="badge-list">
                    <span class="badge">Express 4.18</span>
                    <span class="badge">MongoDB / Mongoose</span>
                    <span class="badge">Firebase Admin</span>
                    <span class="badge">Cloudinary API</span>
                    <span class="badge">JWT & Bcrypt</span>
                </div>
                <p style="font-size: 9pt; margin-top: 10px;">
                    Utilizes <code>helmet</code> for secure headers and <code>express-rate-limit</code> for brute-force protection [cite: 21, 27].
                </p>
            </div>
            <div class="tech-col">
                <h3>Frontend (Mobile)</h3>
                <div class="badge-list">
                    <span class="badge">React Native 0.73</span>
                    <span class="badge">Expo SDK 50</span>
                    <span class="badge">NativeWind (Tailwind)</span>
                    <span class="badge">React Navigation</span>
                    <span class="badge">Lottie Animations</span>
                </div>
                <p style="font-size: 9pt; margin-top: 10px;">
                    Built with <code>expo-image-picker</code> for medical document uploads and <code>lottie-react-native</code> for health visualizations [cite: 80].
                </p>
            </div>
        </div>

       

        <h2>Architecture</h2>
        <ul>
            <li><strong>Navigation:</strong> Complex hierarchy utilizing Stack and Tab navigation to separate User and Doctor dashboards [cite: 78, 100, 101].</li>
            <li><strong>Global State:</strong> Uses <code>AuthContext</code> for consistent authentication state across the app [cite: 122].</li>
            <li><strong>Error Handling:</strong> Centralized backend middleware for graceful API error responses [cite: 27, 31].</li>
        </ul>
    </div>

    <div class="footer">
        Generated for Medlink Healthcare - 2026
    </div>
</body>
</html>
Medlink_README.html
Displaying Medlink_README.html.
