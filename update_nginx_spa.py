import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

nginx_config = """server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    root /var/www/vaultwares-docs/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
"""

sftp = client.open_sftp()
with sftp.file('/tmp/nginx_spa', 'w') as f:
    f.write(nginx_config)
sftp.close()

cmd = "echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S mv /tmp/nginx_spa /etc/nginx/sites-available/default && echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S systemctl restart nginx && pm2 delete vaultwares-docs"

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode('utf-8', errors='ignore'))
print("STDERR:", stderr.read().decode('utf-8', errors='ignore'))
client.close()
