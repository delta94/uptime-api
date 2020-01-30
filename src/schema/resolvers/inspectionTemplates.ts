import { Context } from '@/helpers/interfaces';
import { Roles, verifyAccess, fluidCheck, getAppSettings, formatSearchTerm, classificationCheck, getShortUuid } from '@/helpers/utils';
import { QueryStatistics } from 'ravendb';
import { Resolver, Query, Args, Arg, Ctx, Mutation } from 'type-graphql';
import { TablePaginationWithSearchTextArgs } from '@/types/TablePaginationWithSearchTextArgs';
import { InspectionTemplateTableList } from '@/types/inspectionTemplate/InspectionTemplateTableList';
import { InspectionTemplate } from '@/types/inspectionTemplate/InspectionTemplate';
import { InspectionTemplateInput } from '@/types/inspectionTemplate/InspectionTemplateInput';
import { RoleTypeEnum, ColorsHexEnum } from '@/types/Enums';
import { InspectionTemplateReference } from '@/types/inspectionTemplate/InspectionTemplateReference';
import { InspectionTemplateForSelectionList } from '@/types/inspectionTemplate/InspectionTemplateForSelectionList';
import { Fluids } from '@/types/appSettings/Fluids';
import { Classifications } from '@/types/appSettings/Classifications';
import { ClassificationTableList } from '@/types/inspectionTemplate/ClassificationTableList';
import { Equipment } from '@/db/migrations/indexes';
import { ClassificationArgs } from '@/types/inspectionTemplate/ClassificationArgs';
import { uniq } from 'lodash';
import { ClientSearchTextArgs } from '@/types/client/ClientSearchTextArgs';
import { IdNameReference } from '@/types/common/IdNameReference';
import { ChecklistItemStatus } from '@/types/inspectionTemplate/ChecklistItemStatus';

@Resolver()
export class InspectionTemplateResolver {
  //#region Queries

  @Query(() => ClassificationTableList)
  async classifications(@Ctx() { session }: Context): Promise<ClassificationTableList> {
    const classifications = await getAppSettings<Classifications>(session, 'Classifications');
    if (!classifications) return { classifications: [], totalRows: 0 };
    return { classifications: classifications.data, totalRows: classifications.data.length };
  }

  @Query(() => InspectionTemplateTableList)
  async inspectionTemplates(
    @Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<InspectionTemplateTableList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const inspectionTemplateQuery = session
      .query<InspectionTemplate>({ indexName: 'InspectionTemplates' })
      .statistics((s: QueryStatistics) => (stats = s))
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      inspectionTemplateQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
      if (req.user.clientId) {
        inspectionTemplateQuery.andAlso().whereEquals('clientId', req.user.clientId);
      }
    } else if (req.user.clientId) {
      inspectionTemplateQuery.whereEquals('clientId', req.user.clientId);
    }

    return { inspectionTemplates: await inspectionTemplateQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => InspectionTemplateForSelectionList)
  async inspectionTemplatesForSelection(
    @Args() { skip, pageSize, searchText }: TablePaginationWithSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<InspectionTemplateForSelectionList> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    let stats: QueryStatistics;
    const inspectionTemplateQuery = session
      .query<InspectionTemplate>({ indexName: 'InspectionTemplates' })
      .statistics((s: QueryStatistics) => (stats = s))
      .selectFields(['id', 'title'])
      .ofType<InspectionTemplateReference>(typeof InspectionTemplateReference)
      .orderByDescending('updatedOn')
      .skip(skip)
      .take(pageSize);

    if (searchText) {
      inspectionTemplateQuery.search('Query', formatSearchTerm(searchText.split(' ')), 'AND');
    }

    if (req.user.clientId) {
      inspectionTemplateQuery
        .openSubclause()
        .whereEquals('clientId', req.user.clientId)
        .orElse()
        .whereEquals('clientId', false)
        .closeSubclause();
    }

    return { inspectionTemplates: await inspectionTemplateQuery.all(), totalRows: stats.totalResults };
  }

  @Query(() => InspectionTemplate)
  async inspectionTemplateById(@Arg('id') id: string, @Ctx() { session, req }: Context): Promise<InspectionTemplate> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    return session.load<InspectionTemplate>(id);
  }

  //#endregion

  //#region Mutations

  @Mutation(() => [String])
  async distinctClassifications(@Args() { classification }: ClassificationArgs, @Ctx() { session }: Context): Promise<string[]> {
    // verifyAccess(req, [
    //   { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
    //   { role: Roles.Client, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    //   { role: Roles.Operator, roleType: RoleTypeEnum.Client },
    // ]);

    const inspectionTemplates = session
      .query<InspectionTemplate>({ indexName: 'InspectionTemplates' })
      .orderByDescending('classification')
      .search('classification', formatSearchTerm(classification.split(' ')), 'AND')
      .distinct()
      .selectFields<string>('classification')
      .take(15)
      .lazily();

    const equipment = session
      .query<Equipment>({ indexName: 'Equipment' })
      .orderByDescending('classification')
      .whereStartsWith('classification', classification)
      .distinct()
      .selectFields<string>('classification')
      .take(15)
      .lazily();

    await session.advanced.eagerly.executeAllPendingLazyOperations();
    // console.log(await session.advanced.eagerly.executeAllPendingLazyOperations());
    const templates = await inspectionTemplates.getValue();
    const equipments = await equipment.getValue();
    return uniq(templates.concat(equipments));

    // return session
    //   .query({ indexName: 'Classifications' })
    //   .orderByDescending('classification')
    //   .whereStartsWith('classification', classification)
    //   .selectFields<string>('classification')
    //   .take(15)
    //   .all();
  }

  @Mutation(() => [InspectionTemplateReference])
  async inspectionTemplatesForSelect(
    @Args() { searchText, clientId, classification }: ClientSearchTextArgs,
    @Ctx() { session, req }: Context
  ): Promise<InspectionTemplateReference[]> {
    verifyAccess(req, [{ role: Roles.Administrator, roleType: RoleTypeEnum.Corporate }]);

    return session
      .query<InspectionTemplate>({ indexName: 'InspectionTemplates' })
      .whereEquals('clientId', clientId)
      .andAlso()
      .whereEquals('classification', classification)
      .andAlso()
      .search('title', formatSearchTerm(searchText.split(' ')), 'AND')
      .orderByDescending('title')
      .selectFields<InspectionTemplateReference>(['id', 'title'])
      .take(15)
      .all();
  }

  @Mutation(() => InspectionTemplate)
  async saveInspectionTemplate(
    @Arg('data', () => InspectionTemplateInput) data: InspectionTemplateInput,
    @Ctx() { session, req }: Context
  ): Promise<InspectionTemplate> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    // Check if fluid exists and if not add it
    const dataFluids = await getAppSettings<Fluids>(session, 'Fluids');
    data.checklist.forEach(oneCheckItem => {
      if (oneCheckItem && oneCheckItem.consumable) {
        fluidCheck(oneCheckItem.consumableFluid, dataFluids.data);
      }
    });

    // Check if classification exists and if not add it
    const dataClassifications = await getAppSettings<Classifications>(session, 'Classifications');
    if (data) classificationCheck(data.classification, dataClassifications.data);

    const entity = await InspectionTemplate.fromInspectionTemplateInput(session, data);
    if (req.user.clientId) entity.client = await IdNameReference.clientFromJwtUser(session, req.user);

    // Give id to each checkListItem
    entity.checklist.forEach(item => {
      if (!item.id || item.id === undefined || item.id === '') {
        item.id = getShortUuid();
      }

      // Temp fix to set shouldSendAlert based on color input
      item.statuses.forEach((status: ChecklistItemStatus, index: number) => {
        switch (status.color.toUpperCase()) {
          case ColorsHexEnum.Red:
            console.log('Red');
            status.shouldSendAlert = true;
            break;

          case ColorsHexEnum.Yellow:
            console.log('Yellow');
            status.shouldSendAlert = false;
            break;

          case ColorsHexEnum.Green:
            console.log('Green');
            status.shouldSendAlert = false;
            break;

          default:
            console.log('Missing color?');
            console.log(status);
            status.shouldSendAlert = false;
            break;
        }
        
      });
    });

    await session.store<InspectionTemplate>(entity);
    await session.saveChanges();
    return entity;
  }

  @Mutation(() => InspectionTemplate)
  async cloneInspectionTemplate(@Arg('idToClone') idToClone: string, @Ctx() { session, req }: Context): Promise<InspectionTemplate> {
    verifyAccess(req, [
      { role: Roles.Administrator, roleType: RoleTypeEnum.Corporate },
      { role: Roles.Client, roleType: RoleTypeEnum.Client },
      { role: Roles.Mechanic, roleType: RoleTypeEnum.Client },
    ]);

    const clone = await session.load<InspectionTemplate>(idToClone);
    if (!clone) return null;
    session.advanced.evict(clone);

    const { id, createdOn, ...rest } = clone;
    const entity = await InspectionTemplate.fromInspectionTemplateInput(session, { ...rest });
    entity.title = `Cloned: ${clone.title}`;
    await session.store<InspectionTemplate>(entity);
    await session.saveChanges();
    return entity;
  }

  //#endregion
}
