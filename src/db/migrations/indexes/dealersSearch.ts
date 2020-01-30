import { AbstractIndexCreationTask } from 'ravendb';
class DealersSearch extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from dealer in docs.Dealers
                select new
                {
                  Query = new
                  {
                    dealer.name,
                    dealerLineOne = dealer.location.lineOne,
                    dealerLineTwo = dealer.location.lineTwo,
                    dealerLineThree = dealer.location.lineThree,
                    dealerCity = dealer.location.city,
                    dealerState = dealer.location.state,
                  },
                  dealer.name,
                  dealer.createdOn,
                  dealer.updatedOn,
                  clientId = dealer.client.id
                }`;
  }
}

export { DealersSearch };
