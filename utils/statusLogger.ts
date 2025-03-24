import { CollectionType } from '../types/collections';

const CREATED = 'CREATED';

type STATUS_TYPES = typeof CREATED;

function constructLogMessage(status: STATUS_TYPES, key: CollectionType, id: string) {
  return `[INFO]: ${status.toLowerCase()} record '${id}' in '${key}' collection`;
}

function created(key: CollectionType, id: string) {
  console.log(constructLogMessage(CREATED, key, id));
}

export default {
  created,
};
