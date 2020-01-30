import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class Classifications extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from equipment in docs.Equipment
select new {
  equipment.classification
}`;

    this.map = `from equipment in docs.InspectionTemplates
select new {
  equipment.classification
}`;

    this.reduce = `from m in mapped
group m by new { m.classification  } into g
select new {
  classification = g.Key.classification
}`;
  }
}

export { Classifications };
