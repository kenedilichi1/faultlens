import axios from 'axios';

const services = [
  'payment-service',
  'auth-service',
  'email-service',
  'inventory-service',
  'gateway-service',
];

const errorMessages = [
  'Redis connection timeout',
  'Database query failed',
  'JWT token validation failed',
  'Third-party API unavailable',
  'Rate limit exceeded',
  'Payment processing failed',
];

const warnMessages = [
  'High memory usage detected',
  'Slow response time detected',
  'Retry attempt triggered',
];

const infoMessages = [
  'User login successful',
  'Payment processed successfully',
  'Email sent successfully',
  'Inventory updated',
];

const environments = ['DEV', 'STAGING', 'PROD'];

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function generateLog() {
  const random = Math.random();

  let level: 'INFO' | 'WARN' | 'ERROR';
  let message: string;

  if (random < 0.15) {
    level = 'ERROR';
    message = randomItem(errorMessages);
  } else if (random < 0.35) {
    level = 'WARN';
    message = randomItem(warnMessages);
  } else {
    level = 'INFO';
    message = randomItem(infoMessages);
  }

  return {
    serviceName: randomItem(services),
    environment: randomItem(environments),
    level,
    message,
    metadata: {
      region: 'eu-west-1',
      instanceId: `instance-${Math.floor(Math.random() * 10)}`,
      retryCount: Math.floor(Math.random() * 5),
    },
  };
}

async function sendLog() {
  const log = generateLog();

  try {
    await axios.post('http://localhost:3000/api/logs', log);

    console.log(`[${log.level}] ${log.serviceName}: ${log.message}`);
  } catch (error) {
    console.error(error);
    console.error('Failed to send log');
  }
}

setInterval(sendLog, 1000);
