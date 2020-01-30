import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class FluidReports_Month extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from fluidReport in docs.FluidsByDay
select new {
  clientId = fluidReport.clientId,
  fluid = fluidReport.fluid,
  amount = fluidReport.amount,
  createdOn = new DateTime(fluidReport.createdOn.Year, fluidReport.createdOn.Month, 1),
  unitOfMeasure = fluidReport.unitOfMeasure,
  count = 1
}`;

    this.reduce = `from m in mapped
group m by new { m.createdOn, m.fluid, m.clientId, m.unitOfMeasure  } into g
select new {
  clientId = g.Key.clientId,
  fluid = g.Key.fluid,
  unitOfMeasure = g.Key.unitOfMeasure,
  createdOn = g.Key.createdOn,
  amount = g.Sum(x => x.amount),
  count = g.Sum( x => x.count)
}`;

    this.outputReduceToCollection = 'FluidsByMonth';
  }
}

export { FluidReports_Month };
