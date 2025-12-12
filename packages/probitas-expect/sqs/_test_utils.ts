import type {
  SqsDeleteBatchResult,
  SqsDeleteQueueResult,
  SqsDeleteResult,
  SqsEnsureQueueResult,
  SqsMessage,
  SqsMessages,
  SqsReceiveResult,
  SqsSendBatchResult,
  SqsSendResult,
} from "@probitas/client-sqs";

// Helper to create SqsMessages (array with helper methods)
export function createMockSqsMessages(messages: SqsMessage[]): SqsMessages {
  const arr = [...messages] as SqsMessage[] & {
    first(): SqsMessage | undefined;
    firstOrThrow(): SqsMessage;
    last(): SqsMessage | undefined;
    lastOrThrow(): SqsMessage;
  };
  arr.first = function () {
    return this[0];
  };
  arr.firstOrThrow = function () {
    if (this.length === 0) throw new Error("No messages available");
    return this[0];
  };
  arr.last = function () {
    return this[this.length - 1];
  };
  arr.lastOrThrow = function () {
    if (this.length === 0) throw new Error("No messages available");
    return this[this.length - 1];
  };
  return arr as unknown as SqsMessages;
}

export const mockSqsSendResult = (
  overrides: Partial<SqsSendResult> = {},
): SqsSendResult => ({
  kind: "sqs:send" as const,
  ok: true,
  messageId: "msg-123",
  md5OfBody: "md5hash",
  duration: 100,
  ...overrides,
});

export const mockSqsSendBatchResult = (
  overrides: Partial<SqsSendBatchResult> = {},
): SqsSendBatchResult => ({
  kind: "sqs:send-batch" as const,
  ok: true,
  successful: [{ id: "1", messageId: "msg-1" }],
  failed: [],
  duration: 100,
  ...overrides,
});

export const mockSqsReceiveResult = (
  overrides: Partial<Omit<SqsReceiveResult, "messages">> & {
    messages?: SqsMessage[];
  } = {},
): SqsReceiveResult => {
  const { messages: rawMessages, ...rest } = overrides;
  const defaultMessages: SqsMessage[] = [
    {
      messageId: "m1",
      body: '{"order":"123"}',
      attributes: {},
      receiptHandle: "r1",
      md5OfBody: "md5hash",
    },
  ];
  return {
    kind: "sqs:receive" as const,
    ok: true,
    messages: createMockSqsMessages(rawMessages ?? defaultMessages),
    duration: 100,
    ...rest,
  };
};

export const mockSqsDeleteResult = (
  overrides: Partial<SqsDeleteResult> = {},
): SqsDeleteResult => ({
  kind: "sqs:delete" as const,
  ok: true,
  duration: 100,
  ...overrides,
});

export const mockSqsDeleteBatchResult = (
  overrides: Partial<SqsDeleteBatchResult> = {},
): SqsDeleteBatchResult => ({
  kind: "sqs:delete-batch" as const,
  ok: true,
  successful: ["1"],
  failed: [],
  duration: 100,
  ...overrides,
});

export const mockSqsEnsureQueueResult = (
  overrides: Partial<SqsEnsureQueueResult> = {},
): SqsEnsureQueueResult => ({
  kind: "sqs:ensure-queue" as const,
  ok: true,
  queueUrl: "https://sqs.us-east-1.amazonaws.com/123456/test-queue",
  duration: 100,
  ...overrides,
});

export const mockSqsDeleteQueueResult = (
  overrides: Partial<SqsDeleteQueueResult> = {},
): SqsDeleteQueueResult => ({
  kind: "sqs:delete-queue" as const,
  ok: true,
  duration: 100,
  ...overrides,
});

export const mockSqsMessage = (
  overrides: Partial<SqsMessage> = {},
): SqsMessage => ({
  messageId: "msg-123",
  body: '{"test":"value"}',
  attributes: {},
  receiptHandle: "handle-123",
  md5OfBody: "md5hash",
  ...overrides,
});
