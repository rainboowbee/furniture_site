module.exports = {
  apps: [{
    name: 'gardenfab',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/gardenfab',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: '/var/log/pm2/gardenfab-error.log',
    out_file: '/var/log/pm2/gardenfab-out.log',
    log_file: '/var/log/pm2/gardenfab-combined.log',
    time: true
  }]
};
