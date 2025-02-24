import { Injectable, Inject } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { OpenFeatureClient, Client } from '@openfeature/nestjs-sdk';
import { DevCycleClient } from '@devcycle/nodejs-server-sdk';

const SERVICE_USER = { user_id: 'api-service' };

@Injectable()
export class TaskService {
  private index = 0;

  constructor(
    @OpenFeatureClient() private ofClient: Client,
    @Inject('DVC_CLIENT') private dvcClient: DevCycleClient,
  ) {}

  @Timeout(500)
  async logVariation() {
    const renderFrame = async () => {
      const features = this.dvcClient.allFeatures(SERVICE_USER);
      const { variationName = 'Default' } = features['hello-togglebot'] ?? {};

      const wink = await this.ofClient.getBooleanValue(
        'togglebot-wink',
        false,
        SERVICE_USER,
      );
      const speed = await this.ofClient.getStringValue(
        'togglebot-speed',
        'off',
        SERVICE_USER,
      );

      const spinChars = speed === 'slow' ? '◟◜◝◞' : '◜◠◝◞◡◟';
      const spinner =
        speed === 'off' ? '○' : spinChars[this.index % spinChars.length];
      this.index = (this.index + 1) % spinChars.length;

      const face = wink ? '(- ‿ ○)' : '(○ ‿ ○)';

      const frame = `${spinner} Serving variation: ${variationName} ${face}`;
      const color = speed === 'surprise' ? 'rainbow' : 'blue';

      writeToConsole(frame, color);

      const timeout = ['fast', 'surprise', 'off-axis'].includes(speed)
        ? 100
        : 500;
      setTimeout(async () => await renderFrame(), timeout);
    };

    process.stdout.write('\n');
    await renderFrame();
  }
}

const COLORS = {
  red: '\x1b[91m',
  green: '\x1b[92m',
  yellow: '\x1b[93m',
  blue: '\x1b[94m',
  magenta: '\x1b[95m',
};
const END_CHAR = '\x1b[0m';
type Color = keyof typeof COLORS | 'rainbow';

/**
 * Use chalk to apply the given color to the text
 */
const addColor = (text: string, color: Color) => {
  const colors = {
    ...COLORS,
    rainbow: Object.values(COLORS)[Date.now() % 5],
  };

  return colors.hasOwnProperty(color) ? colors[color] + text + END_CHAR : text;
};

/**
 * Write the text to stdout, with the given colour
 */
const writeToConsole = (text: string, color: Color) => {
  text = addColor(text, color);

  process.stdout.write('\x1b[K  ' + text + '\r');
};
