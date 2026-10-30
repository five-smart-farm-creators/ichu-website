import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const languages = ['en', 'es'];
const references = new Set();

function collectMessages(value, prefix = '', messages = new Map()) {
  if (typeof value === 'string') {
    messages.set(prefix, value);
    return messages;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`Invalid translation entry at ${prefix || 'messages'}`);
  }

  const keys = Object.keys(value);
  const pluralCategories = ['zero', 'one', 'two', 'few', 'many', 'other'];
  const isPlural = keys.length > 0 && keys.every(key => pluralCategories.includes(key));
  if (isPlural) {
    if (!Object.hasOwn(value, 'other')) throw new Error(`Plural entry requires an other form: ${prefix}`);
    keys.forEach((category) => {
      if (typeof value[category] !== 'string') throw new Error(`Invalid plural form: ${prefix}.${category}`);
      messages.set(`${prefix}.${category}`, value[category]);
    });
    return messages;
  }

  keys.forEach((key) => {
    if (!/^[a-z][A-Za-z0-9]*$/.test(key)) throw new Error(`Use a semantic camelCase key: ${prefix}.${key}`);
    collectMessages(value[key], prefix ? `${prefix}.${key}` : key, messages);
  });
  if (keys.length === 0) throw new Error(`Empty translation namespace: ${prefix || 'messages'}`);
  return messages;
}

function isMessageEntry(value) {
  if (typeof value === 'string') return true;
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const categories = ['zero', 'one', 'two', 'few', 'many', 'other'];
  const keys = Object.keys(value);
  return keys.length > 0
    && keys.includes('other')
    && keys.every(key => categories.includes(key))
    && keys.every(key => typeof value[key] === 'string');
}

function placeholders(message) {
  return [...message.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)]
    .map(match => match[1])
    .sort()
    .join('|');
}

function collectHtmlReferences(source) {
  const patterns = [
    /\bdata-i18n(?:-[a-z-]+)?="([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+)"/g,
    /\bdata-msg-key="([a-z][A-Za-z0-9]*(?:\.[A-Za-z0-9]+)+)"/g,
  ];
  patterns.forEach((pattern) => {
    for (const match of source.matchAll(pattern)) references.add(match[1]);
  });
}

async function readJson(path) {
  return JSON.parse(await readFile(resolve(root, path), 'utf8'));
}

async function main() {
  const catalogs = new Map();
  for (const language of languages) {
    const locale = await readJson(`public/locales/${language}.json`);
    if (locale.language !== language || !locale.messages || !locale.chatKeywords) {
      throw new Error(`Invalid locale metadata: ${language}`);
    }
    const messages = collectMessages(locale.messages);
    if (!Object.values(locale.chatKeywords).every(keywords => Array.isArray(keywords)
      && keywords.every(keyword => typeof keyword === 'string'))) {
      throw new Error(`Invalid chat keywords: ${language}`);
    }
    catalogs.set(language, { locale, messages });
  }

  const english = catalogs.get('en');
  const spanish = catalogs.get('es');
  const englishKeys = [...english.messages.keys()].sort();
  const spanishKeys = [...spanish.messages.keys()].sort();
  if (JSON.stringify(englishKeys) !== JSON.stringify(spanishKeys)) {
    throw new Error('English and Spanish message trees must have identical keys and plural forms.');
  }
  if (JSON.stringify(Object.keys(english.locale.chatKeywords).sort())
    !== JSON.stringify(Object.keys(spanish.locale.chatKeywords).sort())) {
    throw new Error('English and Spanish chat topics must have identical keys.');
  }
  english.messages.forEach((message, key) => {
    if (placeholders(message) !== placeholders(spanish.messages.get(key))) {
      throw new Error(`Placeholder mismatch: ${key}`);
    }
  });

  const htmlFiles = [
    'index.html', 'how-it-works.html', 'media.html', '404.html',
    'partials/_header.html', 'partials/_footer.html',
  ];
  for (const file of htmlFiles) collectHtmlReferences(await readFile(resolve(root, file), 'utf8'));

  const scriptFiles = ['assets/scripts/i18n.js', 'assets/scripts/main.js', 'assets/scripts/not-found.js'];
  const keyLiteral = /['"]((?:common|home|howItWorks|media|notFound)\.[A-Za-z0-9.]+)['"]/g;
  for (const file of scriptFiles) {
    const source = await readFile(resolve(root, file), 'utf8');
    for (const match of source.matchAll(keyLiteral)) references.add(match[1].replace(/\.$/, ''));
  }

  const missing = [...references].filter((key) => {
    const value = key.split('.').reduce((current, segment) => current?.[segment], english.locale.messages);
    return !isMessageEntry(value);
  });
  if (missing.length) throw new Error(`Missing referenced translation keys:\n${missing.join('\n')}`);

  console.log(`Validated ${englishKeys.length} message forms across ${languages.join(' and ')}.`);
  console.log(`Validated ${references.size} HTML and JavaScript translation references.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
