import { AbstractIndexCreationTask } from 'ravendb';
class DealersContact extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from dealerContact in docs.DealerContacts
                select new
                {
                  Query = new
                  {
                    dealerContact.firstName,
                    dealerContact.lastName,
                    dealerContact.email,
                    phoneDigit = dealerContact.phone.digits
                  },
                  clientId = dealerContact.client.id,
                  dealerContact.representativeType,
                  dealerContact.email,
                  dealerContact.createdOn,
                  dealerContact.updatedOn
                }`;
  }
}

export { DealersContact };
