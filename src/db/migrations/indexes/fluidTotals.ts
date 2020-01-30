import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class FluidReports_Totals extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from fluidReport in docs.FluidsByYear
select new {
  clientId = fluidReport.clientId,
  fluid = fluidReport.fluid,
  unitOfMeasure = fluidReport.unitOfMeasure,
  amount = fluidReport.amount,
  count = 1
}`;

    this.reduce = `from m in mapped
group m by new { m.fluid, m.clientId, m.unitOfMeasure } into g
select new {
  clientId = g.Key.clientId,
  fluid = g.Key.fluid,
  unitOfMeasure = g.Key.unitOfMeasure,
  amount = g.Sum(x => x.amount),
  count = g.Sum( x => x.count)
}`;

    this.outputReduceToCollection = 'FluidsByClient';
  }
}

export { FluidReports_Totals };
