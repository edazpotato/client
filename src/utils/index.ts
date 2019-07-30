import {
  DiscordRegex,
  DiscordRegexNames,
} from '../constants';

import * as PermissionTools from './permissions';
import * as Snowflake from './snowflake';

export {
  PermissionTools,
  Snowflake,
};

export function anyToCamelCase(object: any, skip?: Array<string>): any {
  if (object === null) {
    return object;
  }
  if (typeof(object) === 'object') {
    if (Array.isArray(object)) {
      const obj: Array<any> = [];
      for (let value of object) {
        obj.push(anyToCamelCase(value));
      }
      return obj;
    } else {
      const obj: {[key: string]: any} = {};
      for (let key in object) {
        if (skip && skip.includes(key)) {
          obj[key] = object[key];
        } else {
          obj[toCamelCase(key)] = anyToCamelCase(object[key]);
        }
      }
      return obj;
    }
  }
  return object;
}

export function getAcronym(name?: string): string {
  if (name != null) {
    return name.replace(/\w+/g, match => match[0]).replace(/\s/g, '');
  }
  return '';
}

export function hexToInt(hex: string): number {
  return parseInt(hex.replace(/#/, ''), 16);
}

export function intToHex(int: number, hashtag?: boolean): string {
  return ((hashtag) ? '#' : '') + int.toString(16).padStart(6, '0');
}

export function intToRGB(int: number): {
  r: number,
  g: number,
  b: number,
} {
  return {
    r: (int >> 16) & 0x0ff,
    g: (int >> 8) & 0x0ff,
    b: int & 0x0ff,
  };
}


export interface RegexPayload {
  animated?: boolean,
  id?: string,
  language?: string,
  match: {
    regex: RegExp,
    type: string,
  },
  name?: string,
  text?: string,
}

export function regex(
  type: string,
  content: string,
): null | RegexPayload {
  type = String(type || '').toUpperCase();
  const regex = (<any> DiscordRegex)[type];
  if (regex === undefined) {
    throw new Error(`Unknown regex type: ${type}`);
  }
  const match = regex.exec(content);
  if (!match) {
    return null;
  }

  const payload: RegexPayload = {
    match: {
      regex,
      type,
    },
  };
  switch (type) {
    case DiscordRegexNames.EMOJI: {
      payload.name = <string> match[1];
      payload.id = <string> match[2];
      payload.animated = content.startsWith('<a:');
    }; break;
    case DiscordRegexNames.MENTION_CHANNEL:
    case DiscordRegexNames.MENTION_ROLE:
    case DiscordRegexNames.MENTION_USER: {
      payload.id = <string> match[1];
    }; break;
    case DiscordRegexNames.TEXT_CODEBLOCK: {
      payload.language = <string> match[2];
      payload.text = <string> match[3];
    }; break;
    case DiscordRegexNames.TEXT_BOLD:
    case DiscordRegexNames.TEXT_CODESTRING:
    case DiscordRegexNames.TEXT_ITALICS:
    case DiscordRegexNames.TEXT_SNOWFLAKE:
    case DiscordRegexNames.TEXT_SPOILER:
    case DiscordRegexNames.TEXT_STRIKE:
    case DiscordRegexNames.TEXT_UNDERLINE:
    case DiscordRegexNames.TEXT_URL: {
      payload.text = <string> match[1];
    }; break;
    default: {
      throw new Error(`Unknown regex type: ${type}`);
    };
  }
  return payload;
}

export function rgbToInt(r: number, g: number, b: number): number {
  return ((r & 0x0ff) << 16) | ((g & 0x0ff) << 8) | (b & 0x0ff);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (ms) {
      setTimeout(resolve, ms);
    } else {
      resolve();
    }
  });
}

export function toCamelCase(value: string): string {
  if (!value.includes('_')) {
    return value;
  }
  value = value
    .split('_')
    .map((v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase())
    .join('');
  return value.charAt(0).toLowerCase() + value.slice(1);
}