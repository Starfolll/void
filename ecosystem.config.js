module.exports = {
   apps: [{
      name: "log",
      script: "node src/services/logger/server.logger.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
   }, {
      name: "api",
      script: "node src/servers/apiManager/server.manager.api.js",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
   }],

   deploy: {
      production: {
         user: "node",
         host: "212.83.163.1",
         ref: "origin/master",
         repo: "git@github.com:repo.git",
         path: "/var/www/production",
         "post-deploy": "npm install && pm2 reload ecosystem.config.js --env production"
      }
   }
};
