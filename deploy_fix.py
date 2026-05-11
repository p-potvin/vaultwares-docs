import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

cmds = [
    "cd /var/www/vaultwares-docs && git remote set-url origin https://github.com/p-potvin/vaultwares-docs.git",
    "cd /var/www/vaultwares-docs && git fetch origin && git reset --hard origin/main",
    "cd /var/www/vaultwares-docs && npm install",
    "cd /var/www/vaultwares-docs && npm run build",
    "pm2 restart vaultwares-docs || pm2 serve /var/www/vaultwares-docs/dist 8080 --name 'vaultwares-docs' --spa"
]

for cmd in cmds:
    print('RUNNING:', cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    
    out = stdout.read().decode('utf-8', errors='ignore').strip()
    if out: print("OUT:", out)
    
    err = stderr.read().decode('utf-8', errors='ignore').strip()
    if err: print("ERR:", err)

client.close()
