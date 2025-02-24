import primary_color from '@/constants/primary-color'

const forgotPassword = ({ user, resetPasswordUrl }: { user: string; resetPasswordUrl: string }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your Password</title>
    <style>
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-20px);
            }
            60% {
                transform: translateY(-10px);
            }
        }

        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .icon-container {
            background-color: #FFE5E5;
            width: 120px;
            height: 120px;
            border-radius: 60px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            animation: bounce 2s infinite;
        }
        .icon {
            width: 60px;
            height: 60px;
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
        <h1>Oops, sepertinya kamu lupa kata sandi.</h1>
        <p>Halo ${user},</p>
        <p>Kami menerima permintaan kamu untuk mengatur ulang kata sandi, harap klik tombol berikut:</p>
        <p style="text-align: center;">
            <a href="${resetPasswordUrl}" class="button">Atur ulang kata sandi</a>
        </p>
        <p>Abaikan email ini, jika kamu merasa tidak meminta atur ulang kata sandi.</p>
        <p>Tautan ini akan aktif selama 24 jam, harap minta atur ulang kata sandi lagi jika sudah melebihi 24 jam. </p>
        <div class="footer">
            <p>Salin dan tempel tautan berikut jika kamu memiliki kendala saat menekan tombol di atas:</p>
            <p><a href="${resetPasswordUrl}">${resetPasswordUrl}</a></p>
            <p>&copy; 2025 Nubi Academy. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`
}
export default forgotPassword
