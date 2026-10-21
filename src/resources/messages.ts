import { Resource } from '../resource.js';
import type { Message, CreateMessage, MessageListParams } from '../types.js';
import type { PaginatedResponse } from '../pagination.js';

export class Messages extends Resource<Message> {
  protected get path() { return '/v1/my/messages'; }
  protected get paginated() { return true; }

  async list(params?: MessageListParams): Promise<PaginatedResponse<Message>> {
    const { data, headers } = await this.client.request<Message[]>(
      'GET', this.path, { query: params as Record<string, unknown> },
    );
    const { parsePaginationHeaders } = await import('../pagination.js');
    return { data, pagination: parsePaginationHeaders(headers) };
  }

  /**
   * Send one transactional email or SMS. The idempotency key is required, as
   * the API requires it: a retry with the same key and payload returns the
   * original message instead of sending twice, so reuse a key only to retry
   * the same message.
   */
  async send(params: CreateMessage, idempotencyKey: string): Promise<Message> {
    if (typeof idempotencyKey !== 'string' || idempotencyKey.trim() === '') {
      throw new TypeError(
        'messages.send needs an idempotency key: pass a stable key for this message, and reuse it only to retry the same send.',
      );
    }
    const { data } = await this.client.request<Message>('POST', this.path, {
      body: params as unknown as Record<string, unknown>,
      headers: { 'Idempotency-Key': idempotencyKey },
    });
    return data;
  }
}
