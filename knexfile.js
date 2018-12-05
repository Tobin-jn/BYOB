module.exports = {

  test: {
    client: 'pg',
    connection: 'postgres://localhost/devjobs_test',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev_test',
    },
    useNullAsDefault: true,
  },

  development: {
    client: 'pg',
    connection: 'postgres://localhost/devjobs',
    migrations: {
      directory: './db/migrations',
    },
    seeds: {
      directory: './db/seeds/dev',
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + `?ssl=true`,
    migrations: {
      directory: './db/migrations',
    },
    useNullAsDefault: true,
  },
};
