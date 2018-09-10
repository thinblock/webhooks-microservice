import { get } from 'superagent';
import { services } from '../config/env';

export const getJob = async (id: string) => {
  try {
    const res = await get(`${services.jobs.url}/jobs/${id}?look_up=token`).send();
    return res.body;
  } catch (e) {
    throw e;
  }
};