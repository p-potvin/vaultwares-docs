import paramiko
import os

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

sftp = client.open_sftp()

files_to_upload = [
    'src/App.tsx',
    'src/index.css',
    'src/themes.ts',
    'src/translations.ts',
    'tailwind.config.js',
    'package.json'
]

for file in files_to_upload:
    local_path = os.path.join(r'c:\Users\Administrator\Desktop\Github Repos\vaultwares-docs', file.replace('/', os.sep))
    remote_path = os.path.join('/var/www/vaultwares-docs', file).replace('\\', '/')
    print(f"Uploading {file}...")
    sftp.put(local_path, remote_path)

sftp.close()

cmds = [
    "cd /var/www/vaultwares-docs && npm install",
    "cd /var/www/vaultwares-docs && npm run build",
    "echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S systemctl restart nginx"
]

for cmd in cmds:
    print('RUNNING:', cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    stdout.channel.recv_exit_status()
    print("FINISHED:", cmd)

client.close()
