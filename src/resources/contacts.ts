import { Resource } from '../resource.js';
import type { Contact, CreateContact, UpdateContact, ContactListParams, BulkContactAction, BulkContactResult } from '../types.js';
import type { PaginatedResponse } from '../pagination.js';

export class Contacts extends Resource<Contact, CreateContact, UpdateContact> {
  protected get path() { return '/v1/my/contacts'; }
  protected get paginated() { return true; }

  override async list(params?: ContactListParams): Promise<PaginatedResponse<Contact>> {
    return super.list(params as Record<string, unknown>) as Promise<PaginatedResponse<Contact>>;
  }
  async bulk(params: BulkContactAction): Promise<BulkContactResult> {
    const { data } = await this.client.request<BulkContactResult>('POST', `${this.path}/bulk`, {
      body: params as unknown as Record<string, unknown>,
    });
    return data;
  }

}
