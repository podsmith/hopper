module.exports = {
  apps: [
    {
      name: 'hopper',
      script: 'build/index.js',
      interpreter: 'node',
      node_args: '--enable-source-maps',
      instances: 'max',
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '150M',
      instance_var: 'PM2_INSTANCE_ID',
      min_uptime: 5000,
      listen_timeout: 10_000,
      kill_timeout: 2000,
      max_restarts: 5,
      restart_delay: 2000,
      autorestart: true,
    },
  ],
};
