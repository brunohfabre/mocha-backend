import 'dotenv/config';

import { app } from '@shared/app';

app.listen(process.env.PORT, () =>
  console.log(`Server stating on port ${process.env.PORT}.`),
);
