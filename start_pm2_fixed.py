import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

cmd = "pm2 delete vaultwares-docs; pm2 serve /var/www/vaultwares-docs/dist 8080 --name 'vaultwares-docs' --spa"

stdin, stdout, stderr = client.exec_command(cmd)
print("STDOUT:", stdout.read().decode('utf-8', errors='ignore'))
client.close()
