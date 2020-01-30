import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class InspectionTemplates_Classifications extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from it in docs.InspectionTemplates
select new {
  it.classification,
  count = 1
}`;

    this.reduce = `from m in mapped
group m by new { m.classification  } into g
select new {
  classification = g.Key.classification,
  count = g.Sum( x => x.count)
}`;
  }
}

export { InspectionTemplates_Classifications };
