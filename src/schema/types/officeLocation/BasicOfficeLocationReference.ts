import { ObjectType, Field, ID } from 'type-graphql';
import { OfficeLocationReferenceInput } from './OfficeLocationReferenceInput';
import { OfficeLocationInput } from './OfficeLocationInput';
import { OfficeLocation } from './OfficeLocation';

@ObjectType()
export class BasicOfficeLocationReference {
  static fromOfficeLocationReferenceInput(data: OfficeLocationReferenceInput): BasicOfficeLocationReference {
    return new this(data.id, data.name);
  }

  static fromOfficeLocationInput(data: OfficeLocationInput): BasicOfficeLocationReference {
    return new this(data.id, data.name);
  }

  static fromOfficeLocation(data: OfficeLocation): BasicOfficeLocationReference {
    return new this(data.id, data.name);
  }

  @Field()
  public name: string;

  @Field(() => ID)
  public id: string;

  constructor(id: string, name: string) {
    this.name = name;
    this.id = id;
  }
}
