import * as JOI from '@hapi/joi';

export function login() {
  const schema = JOI.object({
    body: JOI.object({
      email: JOI.string().email().required(),
      password: JOI.string().max(255).required(),
    }),
  }).unknown();

  return schema;
}

export function register() {
  const schema = JOI.object({
    body: JOI.object({
      email: JOI.string().email().required(),
      password: JOI.string().max(255).required(),
      firstName: JOI.string().max(255).required(),
      lastName: JOI.string().max(255).required(),
    }),
  }).unknown();

  return schema;
}
