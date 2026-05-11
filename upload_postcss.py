import paramiko

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('212.193.6.35', username='clopeux', password='Caloric1-Junkie4-Distract0-Art5-Concur8')

sftp = client.open_sftp()
with sftp.file('/var/www/vaultwares-docs/postcss.config.js', 'w') as f:
    f.write("export default { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } }\n")
sftp.close()

cmds = [
    "cd /var/www/vaultwares-docs && npm run build",
    "echo Caloric1-Junkie4-Distract0-Art5-Concur8 | sudo -S systemctl restart nginx"
]

for cmd in cmds:
    print('RUNNING:', cmd)
    stdin, stdout, stderr = client.exec_command(cmd)
    
    stdout.channel.recv_exit_status()
    print("FINISHED:", cmd)

client.close()
