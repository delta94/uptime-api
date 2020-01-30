import { AbstractIndexCreationTask } from 'ravendb';

class PaymentPlans extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from paymentPlan in docs.PaymentPlans
select new
{
  Query = new
  {
    paymentPlan.name,
    models = Enumerable.Select(paymentPlan.models, model => model.name)
  },
  paymentPlan.updatedOn
}`;
  }
}

export { PaymentPlans };
