import type {
  RabbitMqAckResult,
  RabbitMqConsumeResult,
  RabbitMqExchangeResult,
  RabbitMqPublishResult,
  RabbitMqQueueResult,
  RabbitMqResult,
} from "@probitas/client-rabbitmq";
import {
  expectRabbitMqPublishResult,
  type RabbitMqPublishResultExpectation,
} from "./rabbitmq/publish.ts";
import {
  expectRabbitMqConsumeResult,
  type RabbitMqConsumeResultExpectation,
} from "./rabbitmq/consume.ts";
import {
  expectRabbitMqQueueResult,
  type RabbitMqQueueResultExpectation,
} from "./rabbitmq/queue.ts";
import {
  expectRabbitMqAckResult,
  type RabbitMqAckResultExpectation,
} from "./rabbitmq/ack.ts";
import {
  expectRabbitMqExchangeResult,
  type RabbitMqExchangeResultExpectation,
} from "./rabbitmq/exchange.ts";

// Re-export interfaces
export type {
  RabbitMqAckResultExpectation,
  RabbitMqConsumeResultExpectation,
  RabbitMqExchangeResultExpectation,
  RabbitMqPublishResultExpectation,
  RabbitMqQueueResultExpectation,
};

/**
 * Expectation type returned by expectRabbitMqResult based on the result type.
 */
export type RabbitMqExpectation<R extends RabbitMqResult> = R extends
  RabbitMqConsumeResult ? RabbitMqConsumeResultExpectation
  : R extends RabbitMqQueueResult ? RabbitMqQueueResultExpectation
  : R extends RabbitMqPublishResult ? RabbitMqPublishResultExpectation
  : R extends RabbitMqExchangeResult ? RabbitMqExchangeResultExpectation
  : R extends RabbitMqAckResult ? RabbitMqAckResultExpectation
  : never;

/**
 * Create a fluent expectation chain for any RabbitMQ result validation.
 *
 * This unified function accepts any RabbitMQ result type and returns
 * the appropriate expectation interface based on the result's type discriminator.
 *
 * @example
 * ```ts
 * // For publish result - returns RabbitMqPublishResultExpectation
 * const publishResult = await channel.sendToQueue(queue, content);
 * expectRabbitMqResult(publishResult).toBeOk();
 *
 * // For consume result - returns RabbitMqConsumeResultExpectation
 * const consumeResult = await channel.get(queue);
 * expectRabbitMqResult(consumeResult).toBeOk().toHaveContent().routingKey("key");
 *
 * // For queue result - returns RabbitMqQueueResultExpectation
 * const queueResult = await channel.assertQueue("my-queue");
 * expectRabbitMqResult(queueResult).toBeOk().messageCount(0);
 *
 * // For exchange result - returns RabbitMqExchangeResultExpectation
 * const exchangeResult = await channel.assertExchange("my-exchange", "direct");
 * expectRabbitMqResult(exchangeResult).toBeOk();
 *
 * // For ack result - returns RabbitMqAckResultExpectation
 * const ackResult = await channel.ack(message);
 * expectRabbitMqResult(ackResult).toBeOk();
 * ```
 */
export function expectRabbitMqResult<R extends RabbitMqResult>(
  result: R,
): RabbitMqExpectation<R> {
  switch (result.kind) {
    case "rabbitmq:consume":
      return expectRabbitMqConsumeResult(
        result as unknown as RabbitMqConsumeResult,
      ) as unknown as RabbitMqExpectation<R>;
    case "rabbitmq:queue":
      return expectRabbitMqQueueResult(
        result as unknown as RabbitMqQueueResult,
      ) as unknown as RabbitMqExpectation<R>;
    case "rabbitmq:publish":
      return expectRabbitMqPublishResult(
        result as unknown as RabbitMqPublishResult,
      ) as unknown as RabbitMqExpectation<R>;
    case "rabbitmq:exchange":
      return expectRabbitMqExchangeResult(
        result as unknown as RabbitMqExchangeResult,
      ) as unknown as RabbitMqExpectation<R>;
    case "rabbitmq:ack":
      return expectRabbitMqAckResult(
        result as unknown as RabbitMqAckResult,
      ) as unknown as RabbitMqExpectation<R>;
    default:
      throw new Error(
        `Unknown RabbitMQ result kind: ${(result as { kind: string }).kind}`,
      );
  }
}
