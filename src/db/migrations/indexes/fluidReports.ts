import { AbstractIndexCreationTask } from 'ravendb';

class FluidReports extends AbstractIndexCreationTask {
  public constructor() {
    super();
    this.map = `from fluidReport in docs.FluidReports
select new
{
  Query = new
  {
    fluidReportEquipmentName = fluidReport.equipment.name,
    fluidReport.fluid,
    fluidReportUserFirstName = fluidReport.user.firstName,
    fluidReportUserLastName = fluidReport.user.lastName,
    fluidReportOfficeLocation = fluidReport.officeLocation.name,
    fluidReportAmount = fluidReport.amount,
    fluidReportUnit = fluidReport.unitOfMeasure
  },
  equipment = fluidReport.equipment,
  fluid = fluidReport.fluid,
  clientId = fluidReport.client.id,
  assetId = fluidReport.asset.id,
  equipmentId = fluidReport.equipment.id,
  fluidReport.createdOn
}`;
  }
}

export { FluidReports };
