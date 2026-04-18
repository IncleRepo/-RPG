const DEFAULT_CHARACTER_STATE = Object.freeze({
  progression: Object.freeze({
    level: 1,
  }),
  resources: Object.freeze({
    health: Object.freeze({
      current: 100,
      max: 100,
    }),
    mana: Object.freeze({
      current: 50,
      max: 50,
    }),
  }),
  wallet: Object.freeze({
    gold: 0,
  }),
  collections: Object.freeze({
    inventory: Object.freeze([]),
    equipment: Object.freeze({}),
  }),
  attributes: Object.freeze({}),
});

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map(cloneValue);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, cloneValue(entry)])
    );
  }

  return value;
}

function mergeRecords(baseRecord, patchRecord = {}) {
  const nextRecord = cloneValue(baseRecord);

  for (const [key, value] of Object.entries(patchRecord)) {
    const currentValue = nextRecord[key];

    if (isPlainObject(currentValue) && isPlainObject(value)) {
      nextRecord[key] = mergeRecords(currentValue, value);
      continue;
    }

    nextRecord[key] = cloneValue(value);
  }

  return nextRecord;
}

function sanitizeNumber(value, fallback = 0, minimum = 0) {
  if (!Number.isFinite(value)) {
    return fallback;
  }

  return Math.max(minimum, Math.trunc(value));
}

function normalizeResource(resource, fallback = {}) {
  const max = sanitizeNumber(resource.max, sanitizeNumber(fallback.max));
  const current = Math.min(max, sanitizeNumber(resource.current, max));

  return {
    current,
    max,
  };
}

export class CharacterProfile {
  constructor(initialState = {}) {
    const mergedState = mergeRecords(DEFAULT_CHARACTER_STATE, initialState);

    for (const [sectionName, sectionValue] of Object.entries(mergedState)) {
      this[sectionName] = sectionValue;
    }

    this.level = this.progression.level;
    this.setResource('health', this.resources.health);
    this.setResource('mana', this.resources.mana);
    this.gold = this.wallet.gold;
  }

  get level() {
    return this.progression.level;
  }

  set level(value) {
    this.progression.level = sanitizeNumber(value, 1, 1);
  }

  get health() {
    return this.resources.health;
  }

  get mana() {
    return this.resources.mana;
  }

  get gold() {
    return this.wallet.gold;
  }

  set gold(value) {
    this.wallet.gold = sanitizeNumber(value);
  }

  setResource(resourceName, nextValue) {
    const fallback = this.resources[resourceName];
    this.resources[resourceName] = normalizeResource(nextValue, fallback);

    return this.resources[resourceName];
  }

  updateSection(sectionName, patchValue) {
    const currentSection = this[sectionName];

    if (isPlainObject(currentSection) && isPlainObject(patchValue)) {
      this[sectionName] = mergeRecords(currentSection, patchValue);
      return this[sectionName];
    }

    this[sectionName] = cloneValue(patchValue);
    return this[sectionName];
  }

  setCollection(collectionName, nextValue) {
    this.collections[collectionName] = cloneValue(nextValue);
    return this.collections[collectionName];
  }

  setAttribute(attributeName, nextValue) {
    this.attributes[attributeName] = cloneValue(nextValue);
    return this.attributes[attributeName];
  }

  getCollectionSize(collectionName) {
    const collection = this.collections[collectionName];

    if (Array.isArray(collection)) {
      return collection.length;
    }

    if (isPlainObject(collection)) {
      return Object.values(collection).filter((entry) => entry !== null && entry !== undefined)
        .length;
    }

    return 0;
  }

  toJSON() {
    return cloneValue(
      Object.fromEntries(Object.entries(this).filter(([, value]) => typeof value !== 'function'))
    );
  }
}

export function createPlayableCharacter(initialState = {}) {
  return new CharacterProfile(
    mergeRecords(
      {
        collections: {
          inventory: [],
          equipment: {
            weapon: null,
            armor: null,
            accessory: null,
          },
        },
        attributes: {
          appearance: {
            hairStyle: 'adventurer',
            hairColor: 'chestnut',
          },
        },
      },
      initialState
    )
  );
}
