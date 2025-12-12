import type {
  RabbitMqAckResult,
  RabbitMqConsumeResult,
  RabbitMqExchangeResult,
  RabbitMqPublishResult,
  RabbitMqQueueResult,
} from "@probitas/client-rabbitmq";

export const mockRabbitMqPublishResult = (
  overrides: Partial<RabbitMqPublishResult> = {},
): RabbitMqPublishResult => ({
  kind: "rabbitmq:publish" as const,
  ok: true,
  duration: 100,
  ...overrides,
});

export const mockRabbitMqConsumeResult = (
  overrides: Partial<RabbitMqConsumeResult> = {},
): RabbitMqConsumeResult => ({
  kind: "rabbitmq:consume" as const,
  ok: true,
  message: {
    content: new TextEncoder().encode("test message"),
    properties: { contentType: "text/plain" },
    fields: {
      routingKey: "test.key",
      exchange: "test.exchange",
      deliveryTag: 1n,
      redelivered: false,
    },
  },
  duration: 100,
  ...overrides,
});

export const mockRabbitMqQueueResult = (
  overrides: Partial<RabbitMqQueueResult> = {},
): RabbitMqQueueResult => ({
  kind: "rabbitmq:queue" as const,
  ok: true,
  queue: "test-queue",
  messageCount: 10,
  consumerCount: 2,
  duration: 100,
  ...overrides,
});

export const mockRabbitMqAckResult = (
  overrides: Partial<RabbitMqAckResult> = {},
): RabbitMqAckResult => ({
  kind: "rabbitmq:ack" as const,
  ok: true,
  duration: 100,
  ...overrides,
});

export const mockRabbitMqExchangeResult = (
  overrides: Partial<RabbitMqExchangeResult> = {},
): RabbitMqExchangeResult => ({
  kind: "rabbitmq:exchange" as const,
  ok: true,
  duration: 100,
  ...overrides,
});
