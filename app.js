const express = require('express');
const fs = require('fs-extra');
const app = express();

async function main() {
  await fs.mkdirs('logs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.text({
    type: ['application/xml', 'text/plain', 'text/html']
  }));
  app.all('*', async (req, res, next) => {
    try {
      const method = req.method;
      const path = req.path;
      const date = new Date().toISOString();
      console.log(`${method} ${path} - ${date}`);

      const name = `logs/req_${date}_${method}_${path.split('/').filter(Boolean).join('_')}.json`;
      const value = {
        request: {
          method: method,
          path: path,
          headers: req.headers,
        },
        body: req.body
      };
      await fs.writeFile(name, JSON.stringify(value, null, 2));
    } catch (error) {
      console.log(error);
    }
    res.status(200).end();
    next();
  });

  app.listen(8080);
}

main().catch(e => console.log(e));
