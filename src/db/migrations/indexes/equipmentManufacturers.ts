import { AbstractIndexCreationTask } from 'ravendb';

// tslint:disable-next-line: class-name
class Equipment_Manufacturers extends AbstractIndexCreationTask {
  public constructor() {
    super();

    this.map = `from equipment in docs.Equipment
select new {
  equipment.manufacturer,
  count = 1
}`;

    this.reduce = `from m in mapped
group m by new { m.manufacturer  } into g
select new {
  manufacturer = g.Key.manufacturer,
  count = g.Sum( x => x.count)
}`;
  }
}

export { Equipment_Manufacturers };
