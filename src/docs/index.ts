import axios, { Method } from 'axios';
import listEndpoints from 'express-list-endpoints';
import { promises as fs } from 'fs';
import { resolve } from 'path';

import { app } from '@shared/app';

import { AuthenticateUserService } from '@modules/users/services/AuthenticateUserService';

type Route = {
  path: string;
  method: Method;
};

const routes = listEndpoints(app);

const newRoutes: Route[] = [];

routes.forEach(route => {
  route.methods.forEach(method => {
    newRoutes.push({
      method: method as Method,
      path: route.path,
    });
  });
});

async function runDocs(): Promise<void> {
  await fs.writeFile(resolve(__dirname, 'docs.json'), '[]', {
    encoding: 'utf8',
  });

  const user = await AuthenticateUserService.execute({
    email: 'bruno.hfabre@gmail.com',
    password: 'abcd1234',
  });

  await Promise.all(
    newRoutes.map(async route => {
      try {
        await axios.request({
          method: route.method,
          url: `http://localhost:3333${route.path}`,
          headers: {
            authorization: `Bearer ${user.token}`,
            isdocsrequest: true,
          },
        });
      } catch (err: any) {
        console.log(err.message, route.method, route.path);
      }
    }),
  );
}

runDocs();
