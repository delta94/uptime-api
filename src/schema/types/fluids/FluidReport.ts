import { IDocumentSession } from 'ravendb';
import { ObjectType, Field, ID, Float } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { FluidReportInput } from './FluidReportInput';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { JobReference } from '../job/JobReference';
import { IdNameReference } from '../common/IdNameReference';
import { getNowUtc } from '@/helpers/utils';
import { InspectionReference } from '../inspection/InspectionReference';
import { Equipment } from '../equipment/Equipment';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class FluidReport {
  static async fromFluidReportInput(session: IDocumentSession, data: FluidReportInput) {
    let fluidReport: FluidReport;
    const { id, equipment, detailedEquipment, ...rest } = data;

    if (data.id) {
      fluidReport = await session.load(data.id);
      fluidReport.equipment = await DetailedEquipmentReference.fromEquipmentReferenceInput(session, equipment);
    } else {
      fluidReport = new this(
        data.equipment
          ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
          : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment),
        data.fluid,
        data.unitOfMeasure,
        data.amount,
        data.meterValue
      );
      fluidReport.createdOn = getNowUtc();
    }

    Object.assign(fluidReport, { ...rest, updatedOn: getNowUtc() });

    if (fluidReport) {
      const equipment = await session.load<Equipment>(fluidReport.equipment.id);
      if (equipment) {
        if (equipment.meterType === 'Hours') {
          if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 24))
            throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
        } else {
          if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 600))
            throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
        }
        equipment.meterValue = data.meterValue;
      }
    }

    return fluidReport;
  }

  @Field(() => ID, { nullable: true })
  public id?: string;

  @Field(() => DetailedEquipmentReference)
  public equipment: DetailedEquipmentReference;

  @Field(() => IdNameReference)
  public client: IdNameReference;

  @Field(() => IdNameReference, { nullable: true })
  public officeLocation?: IdNameReference;

  @Field(() => JobReference, { nullable: true })
  public job: JobReference;

  @Field(() => UserReference)
  public user: UserReference;

  @Field(() => InspectionReference, { nullable: true })
  public inspection?: InspectionReference;

  @Field()
  public fluid: string;

  @Field(() => Float)
  public meterValue: number;

  @Field()
  public unitOfMeasure: string;

  @Field(() => Float)
  public amount: number;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  completedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  constructor(equipment: DetailedEquipmentReference, fluid: string, unitOfMeasure: string, amount: number, meterValue: number) {
    this.equipment = equipment;
    this.fluid = fluid;
    this.unitOfMeasure = unitOfMeasure;
    this.amount = amount;
    this.meterValue = meterValue;
  }
}
