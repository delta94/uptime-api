import { Field, ID, ObjectType, Float } from 'type-graphql';
import { UserReference } from '../user/UserReference';
import { IDocumentSession } from 'ravendb';
import { DateTime } from 'luxon';
import { InspectionInput } from './InspectionInput';
import { InspectionChecklistItemInput } from './InspectionChecklistItemInput';
import { InspectionChecklistItem } from './InspectionChecklistItem';
import { Equipment } from '../equipment/Equipment';
import { getNowUtc } from '@/helpers/utils';
import { JobReference } from '../job/JobReference';
import { DetailedEquipmentReference } from '../equipment/DetailedEquipmentReference';
import { IdNameReference } from '../common/IdNameReference';
import { FluidReport } from '../fluids/FluidReport';
import { JwtUser } from '../JwtUser';
import { WorkOrder } from '../workOrder/WorkOrder';
import { WorkOrderStatusEnum } from '../Enums';
import { InspectionTemplateReference } from '../inspectionTemplate/InspectionTemplateReference';
import { IdTitleReference } from '../common/IdTitleReference';
import { IsoDateTime } from 'schema/scalars/date';

@ObjectType()
export class Inspection {
  static async fromInspectionInput(session: IDocumentSession, data: InspectionInput, user: JwtUser) {
    let inspection: Inspection;
    const { id, equipmentId, equipment, detailedEquipment, clientId, client, ...rest } = data;
    if (data.id) {
      inspection = await session.load(data.id);
      inspection.equipment = data.equipment
        ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
        : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment);
      inspection.meterValue = data.meterValue;
    } else {
      inspection = new this(
        data.meterValue,
        data.equipment
          ? await DetailedEquipmentReference.fromEquipmentReferenceInput(session, data.equipment)
          : DetailedEquipmentReference.fromDetailedEquipmentReferenceInput(data.detailedEquipment),
        data.type,
        data.checklist
      );
      inspection.createdOn = getNowUtc();
      inspection.meterValue = data.meterValue;
    }

    if (inspection) {
      const equipment = await session.load<Equipment>(inspection.equipment.id);
      if (equipment) {
        if (equipment.meterType === 'Hours') {
          if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 24)) {
            // console.log('data.meterValue', data.meterValue);
            // console.log('equipment.meterValue', equipment.meterValue);
            throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
          }
        } else {
          if (equipment.meterValue !== 0 && (equipment.meterValue > data.meterValue || data.meterValue - equipment.meterValue > 600))
            throw new Error(`${equipment!.meterType} are incorrect. Please re-enter.`);
        }
        equipment.meterValue = data.meterValue;
      }
    }
    Object.assign(inspection, { ...rest, updatedOn: getNowUtc() });
    return inspection;
  }

  @Field(() => ID, { nullable: true })
  public readonly id?: string;

  @Field({ defaultValue: false })
  public completed: boolean;

  @Field(() => IdTitleReference, { nullable: true })
  public inspectionTemplate?: IdTitleReference;

  @Field(() => IdNameReference, { nullable: true })
  public client?: IdNameReference;

  @Field(() => IdNameReference, { nullable: true })
  public officeLocation?: IdNameReference;

  @Field(() => JobReference, { nullable: true })
  public job: JobReference;

  @Field(() => Float, { nullable: true })
  public meterValue?: number;

  @Field(() => String, { nullable: true })
  public meterImage?: string;

  @Field(() => Float, { nullable: true })
  public meterValueDaily?: number;

  @Field(() => String)
  public type: 'Pre-Shift' | 'Post-Shift';

  @Field(() => DetailedEquipmentReference)
  public equipment: DetailedEquipmentReference;

  @Field(() => [InspectionChecklistItem])
  public checklist: InspectionChecklistItem[];

  @Field(() => UserReference)
  public who: UserReference;

  @Field(() => UserReference, { nullable: true })
  public supervisor?: UserReference;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  completedOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  createdOn?: Date;

  @Field(() => IsoDateTime, { defaultValue: getNowUtc() })
  updatedOn?: Date;

  constructor(meterValue: number, equipment: DetailedEquipmentReference, type: 'Pre-Shift' | 'Post-Shift', checklist: InspectionChecklistItemInput[]) {
    this.meterValue = meterValue;
    this.equipment = equipment;
    this.type = type;
    this.checklist = checklist;
    this.createdOn = getNowUtc();
    this.updatedOn = getNowUtc();
  }
}
