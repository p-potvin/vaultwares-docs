import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

nginx_config = """server {
    listen 80 default_server;
    listen [::]:80 default_server;

    server_name _;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
"""

cmd = f"echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S bash -c 'cat <<EOF > /etc/nginx/sites-available/default\n{nginx_config}EOF\n' && echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S systemctl restart nginx"

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode())
print("STDERR:", stderr.read().decode())
client.close()
