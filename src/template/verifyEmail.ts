import primary_color from '@/constants/primary-color'

const verifyEmail = ({ user, verifyUrl }: { user: string; verifyUrl: string }) => {
  return `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifikasi Email Anda</title>
    <style>
        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
            100% {
                transform: scale(1);
            }
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .icon-container {
            background-color: #E1F5FE;
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            animation: pulse 2s infinite;
        }
        .icon {
            width: 50px;
            height: 50px;
        }
        h1 {
            color: ${primary_color};
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            margin-bottom: 15px;
        }
        .button {
            display: inline-block;
            background-color: ${primary_color};
            color: #ffffff !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 5px;
            font-weight: bold;
            text-align: center;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #888;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Verifikasi Email Kamu</h1>
        <p>Halo, ${user}</p>
        <p>Terima kasih telah mendaftar! Untuk menyelesaikan proses pendaftaran dan mengaktifkan akun kamu silakan klik tombol di bawah ini:</p>
        <p style="text-align: center;">
            <a href="${verifyUrl}" class="button">Verifikasi Email Saya</a>
        </p>
        <p>Jika Anda tidak mendaftar untuk layanan ini, Anda dapat mengabaikan email ini.</p>
        <p>Link verifikasi ini akan kedaluwarsa dalam 24 jam demi alasan keamanan. Jika Anda memerlukan link verifikasi baru setelah itu, silakan kunjungi situs web kami dan minta link baru.</p>
        <div class="footer">
            <p>Jika Anda mengalami masalah saat mengklik tombol "Verifikasi Email Saya", salin dan tempel URL di bawah ini ke browser web Anda:</p>
            <p><a href="${verifyUrl}">${verifyUrl}</a></p>
           <p>&copy; 2025 Nubi Academy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>

`
}
export default verifyEmail
