import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

cmds = [
    "cd /var/www/vaultwares-docs && sed -i 's/tailwindcss:/\\'@tailwindcss\\/postcss\\':/g' postcss.config.js",
    "cd /var/www/vaultwares-docs && npm install -D @tailwindcss/postcss",
    "cd /var/www/vaultwares-docs && npm run build",
    "echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S systemctl restart nginx"
]

for cmd in cmds:
    print('RUNNING:', cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    # Ignoring stdout for build to prevent checkmark printing crash
    
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if err: print("ERR:", err)

client.close()
